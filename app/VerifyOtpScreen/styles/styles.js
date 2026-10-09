import { StyleSheet } from 'react-native';

import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 136,
    paddingHorizontal: 12,
    paddingTop: 22,
    backgroundColor: colors.header,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#28282A',
  },
  backArrow: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 22,
  },
  title: {
    marginTop: 14,
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  description: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 13,
  },
  content: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 12,
    paddingTop: 48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  otpSection: {
    position: 'absolute',
    top: '50%',
    right: 12,
    left: 12,
    alignItems: 'center',
    transform: [{ translateY: -51 }],
  },
  otpInput: {
    width: 56,
    height: 64,
    padding: 0,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 14,
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  resendText: {
    marginTop: 20,
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  resendLink: {
    color: colors.gold,
    fontWeight: '800',
  },
  button: {
    position: 'absolute',
    right: 12,
    bottom: 28,
    left: 12,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.gold,
  },
  buttonText: {
    color: '#080808',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default styles;
