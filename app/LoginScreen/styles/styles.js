import { StyleSheet } from 'react-native';

import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 175,
    paddingHorizontal: 20,
    paddingTop: 21,
    backgroundColor: colors.header,
    overflow: 'hidden',
  },
  headerRing: {
    position: 'absolute',
    top: 62,
    right: -36,
    width: 122,
    height: 122,
    borderWidth: 14,
    borderColor: '#302812',
    borderRadius: 999,
  },
  welcomeEmoji: {
    fontSize: 29,
    lineHeight: 36,
  },
  title: {
    marginTop: 7,
    color: colors.white,
    fontSize: 25,
    fontWeight: '800',
  },
  description: {
    marginTop: 4,
    color: colors.mutedLight,
    fontSize: 13,
  },
  headerLogo: {
    width: 150,
    height: 38,
    alignSelf: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    position: 'relative',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 110,
  },
  sectionLabel: {
    color: colors.mutedLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 9,
  },
  roleCard: {
    flex: 1,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 15,
    backgroundColor: colors.card,
  },
  roleCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.cardSelected,
  },
  roleIcon: {
    width: 32,
    height: 32,
    marginBottom: 3,
  },
  roleText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  roleTextSelected: {
    color: colors.gold,
  },
  fieldLabel: {
    marginTop: 34,
    color: colors.mutedLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 7,
  },
  countryBox: {
    width: 70,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 14,
    backgroundColor: colors.card,
  },
  countryCode: {
    color: colors.mutedLight,
    fontSize: 11,
  },
  countryPrefix: {
    marginTop: 2,
    color: colors.mutedLight,
    fontSize: 15,
  },
  phoneInput: {
    flex: 1,
    height: 69,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 14,
    backgroundColor: colors.card,
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  terms: {
    position: 'absolute',
    right: 20,
    bottom: 91,
    left: 20,
    color: colors.mutedLight,
    fontSize: 12,
    lineHeight: 19,
  },
  termsLink: {
    color: colors.gold,
    fontWeight: '700',
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    left: 20,
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
