import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 119,
    paddingHorizontal: 12,
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
    backgroundColor: '#302A16',
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
    color: colors.muted,
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 9,
    paddingTop: 11,
    paddingBottom: 28,
  },
  sectionLabel: {
    marginBottom: 7,
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 17,
  },
  dateCard: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#414145',
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  dateCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDark,
  },
  dateDay: {
    color: colors.muted,
    fontSize: 10,
  },
  dateNumber: {
    marginTop: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  selectedText: {
    color: colors.gold,
  },
  slotList: {
    gap: 8,
    marginBottom: 14,
  },
  slotCard: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#414145',
    borderRadius: 11,
    backgroundColor: colors.card,
  },
  slotCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDark,
  },
  slotText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  radio: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#737379',
    borderRadius: 9,
  },
  radioSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
  },
  radioDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1B1B1D',
  },
  noteInput: {
    height: 49,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#414145',
    borderRadius: 13,
    color: colors.white,
    fontSize: 15,
    backgroundColor: colors.card,
  },
  confirmButton: {
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: colors.gold,
  },
  confirmText: {
    color: '#080808',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;
