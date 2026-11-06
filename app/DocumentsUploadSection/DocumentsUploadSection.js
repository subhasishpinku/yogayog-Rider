import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { recognizeText } from 'expo-ocr-kit';
import { useNavigation } from '@react-navigation/native';
import { useHome } from '../contexts/HomeContext';
import styles from './styles/styles';

const documentDefinitions = [
  { icon: '▣', title: 'Aadhaar Card', documentType: 'aadhar_file', subtitle: 'Front + Back · Max 5MB' },
  { icon: '💳', title: 'PAN Card', documentType: 'pan_file', subtitle: 'Front only · Max 5MB' },
  { icon: '🚘', title: 'Driving Licence', documentType: 'dl_file', subtitle: 'Front + Back · Must be valid' },
  { icon: '📋', title: 'RC Book (Vehicle)', documentType: 'rc_file', subtitle: 'Registration Certificate', uploadLabel: 'Upload RC Book' },
  { icon: '🛡️', title: 'Vehicle Insurance', documentType: 'vehicle_insurance', subtitle: 'Valid policy document', uploadLabel: 'Upload Insurance' },
  { icon: '🏢', title: 'Bank Passbook / Cheque', documentType: 'bank_passbook', subtitle: 'For payout verification' },
  { icon: '📸', title: 'Profile Photo', documentType: 'profile_picture', subtitle: 'Clear face photo · White background' },
];

const getFileName = (fileUrl, fallback) => {
  if (!fileUrl) return fallback;
  return String(fileUrl).split('/').pop()?.split('?')[0] || fallback;
};

const DocumentsUploadSection = () => {
  const navigation = useNavigation();
  const { fetchRiderDocuments, riderDocuments, uploadRiderDocument } = useHome();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchRiderDocuments().catch(() => {
      Alert.alert('Unable to load documents', 'Please try again later.');
    });
  }, [fetchRiderDocuments]);

  const documents = useMemo(() => documentDefinitions.map((definition) => {
    const serverDocument = riderDocuments.find(
      (document) => document.document_type === definition.documentType
    );
    const uploaded = Boolean(serverDocument?.uploaded && (serverDocument.file_url || serverDocument.file_path));
    const fileUrl = serverDocument?.file_url || serverDocument?.file_path;

    return {
      ...definition,
      status: uploaded ? '✓ Uploaded' : '✕ Required',
      statusStyle: uploaded ? 'uploaded' : 'required',
      files: uploaded ? [fileUrl] : [],
    };
  }), [riderDocuments]);

  const pendingDocuments = documents.filter((document) => document.statusStyle === 'required');
  const pendingDocumentNames = pendingDocuments.map((document) => document.title).join(' & ');

  const checkDocumentWithOcr = async (uri, documentType) => {
    if (documentType === 'profile_picture') {
      return;
    }

    let result;
    try {
      result = await recognizeText(uri);
    } catch (error) {
      console.error(`[DocumentsUploadSection] ${documentType} OCR error:`, error);
      throw new Error('OCR could not read this image. Please choose a clear JPG or PNG image and try again.');
    }
    const ocrText = String(result?.text || '').toUpperCase();
    const compactText = ocrText.replace(/[^A-Z0-9]/g, '');
    const documentChecks = {
      aadhar_file: /\d{12}/.test(compactText)
        && /AADHAAR|UIDAI|GOVERNMENTOFINDIA|UNIQUEIDENTIFICATION/.test(compactText),
      pan_file: /[A-Z]{5}\d{4}[A-Z]/.test(compactText)
        && /INCOMETAX|PERMANENTACCOUNTNUMBER|GOVERNMENTOFINDIA|GOVTOFINDIA/.test(compactText),
      dl_file: /[A-Z]{2}\d{13,17}/.test(compactText)
        && /DRIVING|LICEN[CS]E|TRANSPORT/.test(ocrText),
      rc_file: /REGISTRATION|CERTIFICATE|CHASSIS|VEHICLE|ENGINE/.test(ocrText),
      vehicle_insurance: /INSURANCE|POLICY|MOTOR|VEHICLE/.test(ocrText),
      bank_passbook: /BANK|CHEQUE|PASSBOOK/.test(ocrText)
        && /IFSC|ACCOUNT|AC|BRANCH|ACCOUNTNUMBER/.test(compactText),
    };

    console.log(`[DocumentsUploadSection] ${documentType} OCR response:`, result);
    console.log(`[DocumentsUploadSection] ${documentType} OCR text:`, ocrText);

    if (!documentChecks[documentType]) {
      throw new Error('Could not verify this document. Please upload a clear image.');
    }
  };

  const pickImage = async (document, fileIndex = 0) => {
    try {
      const isProfilePhoto = document.documentType === 'profile_picture';
      const permission = isProfilePhoto
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          isProfilePhoto
            ? 'Please allow camera access to take a profile selfie.'
            : 'Please allow photo library access to upload a document.'
        );
        return;
      }

      const result = isProfilePhoto
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [3, 4],
            cameraType: ImagePicker.CameraType.front,
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      await checkDocumentWithOcr(asset.uri, document.documentType);
      console.log(`[DocumentsUploadSection] ${document.documentType} OCR passed; uploading now.`);

      setSelectedFiles((current) => ({
        ...current,
        [document.title]: {
          ...(current[document.title] || {}),
          [fileIndex]: asset,
        },
      }));

      setUploading((current) => ({ ...current, [document.documentType]: true }));
      await uploadRiderDocument(asset, document.documentType);
      Alert.alert('Upload complete', `${document.title} uploaded successfully.`);
    } catch (error) {
      Alert.alert('Document check/upload failed', error.message || `Unable to upload ${document.title}.`);
    } finally {
      setUploading((current) => ({ ...current, [document.documentType]: false }));
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Document Upload</Text>
            <Text style={styles.subtitle}>Upload clear photos of all documents</Text>
          </View>
        </View>

        {documents.map((document) => {
          const pickedFiles = selectedFiles[document.title] || {};
          const fileNames = document.files.length > 0
            ? document.files
            : (pickedFiles[0] ? [pickedFiles[0].fileName || 'selected_document.jpg'] : []);

          return (
            <View key={document.title} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={[styles.documentIcon, document.statusStyle === 'uploaded' && styles.greenDocumentIcon, document.statusStyle === 'review' && styles.goldDocumentIcon, document.statusStyle === 'required' && styles.redDocumentIcon]}>
                  <Text style={styles.documentIconText}>{document.icon}</Text>
                </View>
                <View style={styles.documentCopy}>
                  <Text style={styles.documentTitle}>{document.title}</Text>
                  <Text style={styles.documentSubtitle}>{document.subtitle}</Text>
                </View>
                <Pressable
                  style={[styles.status, document.statusStyle === 'uploaded' && styles.uploadedStatus, document.statusStyle === 'review' && styles.reviewStatus, document.statusStyle === 'required' && styles.requiredStatus]}
                  onPress={() => document.statusStyle === 'uploaded' && pickImage(document)}
                  disabled={document.statusStyle !== 'uploaded'}
                >
                  <Text style={[styles.statusLabel, document.statusStyle === 'uploaded' && styles.uploadedStatus, document.statusStyle === 'review' && styles.reviewStatus, document.statusStyle === 'required' && styles.requiredStatus]}>{document.status}</Text>
                </Pressable>
              </View>

              {fileNames.map((file, fileIndex) => {
                const asset = pickedFiles[fileIndex];
                const imageUri = asset?.uri || (typeof file === 'string' && file.startsWith('http') ? file : null);
                return (
                  <Pressable key={`${document.title}-${fileIndex}`} style={styles.fileRow} onPress={() => pickImage(document, fileIndex)}>
                    {imageUri ? (
                      <Pressable
                        onPress={(event) => {
                          event.stopPropagation?.();
                          setPreviewImage({ uri: imageUri, title: document.title });
                        }}
                        accessibilityRole="imagebutton"
                        accessibilityLabel={`View ${document.title}`}
                      >
                        <Image source={{ uri: imageUri }} style={styles.filePreview} />
                      </Pressable>
                    ) : <Text style={styles.fileIcon}>▤</Text>}
                    <Text style={styles.fileName}>{asset?.fileName || getFileName(file, 'selected_document.jpg')}</Text>
                    <Text style={styles.replace}>Replace</Text>
                  </Pressable>
                );
              })}

              {document.uploadLabel && (
                <Pressable style={styles.uploadButton} onPress={() => pickImage(document)} disabled={uploading[document.documentType]}>
                  <Text style={styles.uploadText}>{uploading[document.documentType] ? 'Uploading...' : `📁 ${document.uploadLabel}`}</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        {pendingDocuments.length > 0 && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              ⚠  {pendingDocuments.length} {pendingDocuments.length === 1 ? 'document' : 'documents'} pending: {pendingDocumentNames}.{`\n`}    Upload to complete KYC.
            </Text>
          </View>
        )}
        <Pressable style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Save &amp; Continue →</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={Boolean(previewImage)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.imagePreviewOverlay}>
          <Pressable
            style={styles.imagePreviewBackdrop}
            onPress={() => setPreviewImage(null)}
            accessibilityRole="button"
            accessibilityLabel="Close document preview"
          />
          <View style={styles.imagePreviewDialog}>
            <Text style={styles.imagePreviewTitle}>{previewImage?.title}</Text>
            {previewImage?.uri && (
              <Image source={{ uri: previewImage.uri }} style={styles.imagePreview} resizeMode="contain" />
            )}
            <Pressable style={styles.imagePreviewClose} onPress={() => setPreviewImage(null)}>
              <Text style={styles.imagePreviewCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DocumentsUploadSection;


