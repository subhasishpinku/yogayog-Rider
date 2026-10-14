import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 118,
    paddingHorizontal: 10,
    paddingTop: 16,
    backgroundColor: colors.header,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 11,
    backgroundColor: '#571515',
  },
  backText: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 26,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 3,
    color: '#A06F6F',
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 6,
    paddingTop: 24,
    paddingBottom: 28,
  },
  shipmentCard: {
    padding: 14,
    borderRadius: 15,
    backgroundColor: colors.card,
  },
  cardLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  shipmentId: {
    marginTop: 4,
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  shipmentMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
  fieldLabel: {
    marginTop: 15,
    marginBottom: 7,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  attemptRow: {
    flexDirection: 'row',
    gap: 8,
  },
  attemptButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  attemptSelected: {
    borderWidth: 2,
    borderColor: colors.red,
  },
  attemptText: {
    color: '#707076',
    fontSize: 16,
    fontWeight: '900',
  },
  attemptTextSelected: {
    color: colors.white,
  },
  proofCard: {
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#4A4A4D',
    borderStyle: 'dashed',
    borderRadius: 13,
    backgroundColor: colors.card,
  },
  cameraIcon: {
    fontSize: 22,
  },
  proofTitle: {
    marginTop: 7,
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  proofSubtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
  },
  notesInput: {
    minHeight: 49,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#414145',
    borderRadius: 13,
    color: colors.white,
    fontSize: 15,
    backgroundColor: colors.card,
  },
  warningCard: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colors.redDark,
  },
  warningIcon: {
    marginRight: 10,
    color: '#E5C300',
    fontSize: 16,
  },
  warningText: {
    flex: 1,
    color: colors.red,
    fontSize: 12,
    lineHeight: 17,
  },
  confirmButton: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: colors.red,
  },
  confirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;
