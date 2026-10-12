import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/styles';

const documents = [
  { icon: '▣', title: 'Aadhaar Card', subtitle: 'Front + Back · Max 5MB', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['aadhaar_front.jpg', 'aadhaar_back.jpg'] },
  { icon: '💳', title: 'PAN Card', subtitle: 'Front only · Max 5MB', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['pan_card.jpg'] },
  { icon: '🚘', title: 'Driving Licence', subtitle: 'Front + Back · Must be valid', status: '⌛ Under Review', statusStyle: 'review', files: ['driving_licence.jpg'] },
  { icon: '📋', title: 'RC Book (Vehicle)', subtitle: 'Registration Certificate', status: '✕ Required', statusStyle: 'required', uploadLabel: 'Upload RC Book' },
  { icon: '🛡️', title: 'Vehicle Insurance', subtitle: 'Valid policy document', status: '✕ Required', statusStyle: 'required', uploadLabel: 'Upload Insurance' },
  { icon: '🏢', title: 'Bank Passbook / Cheque', subtitle: 'For payout verification', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['bank_passbook.jpg'] },
  { icon: '📸', title: 'Profile Photo', subtitle: 'Clear face photo · White background', status: '✓ Uploaded', statusStyle: 'uploaded', files: ['profile_photo.jpg'] },
];

const DocumentsUploadSection = () => {
  const navigation = useNavigation();
  const [selectedFiles, setSelectedFiles] = useState({});

  const pickImage = async (documentTitle, fileIndex = 0) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo library access to upload a document.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setSelectedFiles((current) => ({
      ...current,
      [documentTitle]: {
        ...(current[documentTitle] || {}),
        [fileIndex]: asset,
      },
    }));
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
                  onPress={() => document.statusStyle === 'uploaded' && pickImage(document.title)}
                  disabled={document.statusStyle !== 'uploaded'}
                >
                  <Text style={[styles.statusLabel, document.statusStyle === 'uploaded' && styles.uploadedStatus, document.statusStyle === 'review' && styles.reviewStatus, document.statusStyle === 'required' && styles.requiredStatus]}>{document.status}</Text>
                </Pressable>
              </View>

              {fileNames.map((file, fileIndex) => {
                const asset = pickedFiles[fileIndex];
                return (
                  <Pressable key={`${document.title}-${fileIndex}`} style={styles.fileRow} onPress={() => pickImage(document.title, fileIndex)}>
                    {asset?.uri ? <Image source={{ uri: asset.uri }} style={styles.filePreview} /> : <Text style={styles.fileIcon}>▤</Text>}
                    <Text style={styles.fileName}>{asset?.fileName || file}</Text>
                    <Text style={styles.replace}>Replace</Text>
                  </Pressable>
                );
              })}

              {document.uploadLabel && (
                <Pressable style={styles.uploadButton} onPress={() => pickImage(document.title)}>
                  <Text style={styles.uploadText}>📁 {document.uploadLabel}</Text>
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


