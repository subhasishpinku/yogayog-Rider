import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackground: {
    minHeight: 191,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.header,
  },
  headerOrb: {
    position: 'absolute',
    top: -48,
    right: -1,
    width: 101,
    height: 101,
    borderWidth: 16,
    borderColor: '#5C0A0A',
    borderRadius: 51,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 11,
    backgroundColor: '#4A1616',
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
  orderMeta: {
    marginTop: 3,
    color: '#A06F6F',
    fontSize: 13,
  },
  warningCard: {
    marginTop: 11,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#5B0909',
  },
  warningText: {
    color: colors.red,
    fontSize: 13,
    lineHeight: 16,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 1,
    paddingBottom: 24,
  },
  reasonCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 17,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 15,
    backgroundColor: colors.card,
  },
  reasonCardSelected: {
    borderColor: colors.red,
  },
  reasonIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  blueIcon: { backgroundColor: colors.blue },
  oliveIcon: { backgroundColor: colors.olive },
  plumIcon: { backgroundColor: colors.plum },
  redIcon: { backgroundColor: colors.redDark },
  purpleIcon: { backgroundColor: colors.purple },
  reasonEmoji: {
    fontSize: 21,
  },
  reasonCopy: {
    flex: 1,
    marginLeft: 13,
  },
  reasonTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  reasonSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
  },
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: '#454549',
    borderRadius: 10,
  },
  radioSelected: {
    borderColor: colors.red,
    backgroundColor: colors.red,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  continueButton: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
    borderRadius: 16,
    backgroundColor: colors.red,
  },
  continueText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;
