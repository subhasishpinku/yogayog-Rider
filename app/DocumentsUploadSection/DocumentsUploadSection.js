import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { recognizeText } from 'expo-ocr-kit';
import { useNavigation } from '@react-navigation/native';
import { useHome } from '../contexts/HomeContext';
import styles from './styles/styles';

const documents = [
  { icon: '▣', title: 'Aadhaar Card', documentType: 'aadhar_file', subtitle: 'Front + Back · Max 5MB', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['aadhaar_front.jpg', 'aadhaar_back.jpg'] },
  { icon: '💳', title: 'PAN Card', documentType: 'pan_file', subtitle: 'Front only · Max 5MB', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['pan_card.jpg'] },
  { icon: '🚘', title: 'Driving Licence', documentType: 'dl_file', subtitle: 'Front + Back · Must be valid', status: '⌛ Under Review', statusStyle: 'review', files: ['driving_licence.jpg'] },
  { icon: '📋', title: 'RC Book (Vehicle)', documentType: 'rc_file', subtitle: 'Registration Certificate', status: '✕ Required', statusStyle: 'required', uploadLabel: 'Upload RC Book' },
  { icon: '🛡️', title: 'Vehicle Insurance', documentType: 'vehicle_insurance', subtitle: 'Valid policy document', status: '✕ Required', statusStyle: 'required', uploadLabel: 'Upload Insurance' },
  { icon: '🏢', title: 'Bank Passbook / Cheque', documentType: 'bank_passbook', subtitle: 'For payout verification', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['bank_passbook.jpg'] },
  { icon: '📸', title: 'Profile Photo', documentType: 'profile_picture', subtitle: 'Clear face photo · White background', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['profile_photo.jpg'] },
];

const DocumentsUploadSection = () => {
  const navigation = useNavigation();
  const { uploadRiderDocument } = useHome();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});

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
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow photo library access to upload a document.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
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
          const fileNames = document.files || (pickedFiles[0] ? [pickedFiles[0].fileName || 'selected_document.jpg'] : []);

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
                return (
                  <Pressable key={`${document.title}-${fileIndex}`} style={styles.fileRow} onPress={() => pickImage(document, fileIndex)}>
                    {asset?.uri ? <Image source={{ uri: asset.uri }} style={styles.filePreview} /> : <Text style={styles.fileIcon}>▤</Text>}
                    <Text style={styles.fileName}>{asset?.fileName || file}</Text>
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

        <View style={styles.warning}>
          <Text style={styles.warningText}>⚠  2 documents pending: RC Book &amp; Insurance.{`\n`}    Upload to complete KYC.</Text>
        </View>
        <Pressable style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Save &amp; Continue →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default DocumentsUploadSection;


