import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 6,
    paddingTop: 14,
    paddingBottom: 28,
  },
  header: {
    paddingHorizontal: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 11,
    backgroundColor: '#29292B',
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
  amountCard: {
    alignItems: 'center',
    minHeight: 112,
    marginTop: 8,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: colors.amountBorder,
    borderRadius: 19,
    backgroundColor: colors.amountCard,
  },
  amountLabel: {
    color: '#B89400',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  amount: {
    marginTop: 3,
    color: colors.gold,
    fontSize: 43,
    fontWeight: '900',
    lineHeight: 52,
  },
  fieldLabel: {
    marginTop: 14,
    marginBottom: 6,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  inputContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
  },
  currency: {
    color: colors.inputText,
    fontSize: 20,
    fontWeight: '900',
  },
  amountInput: {
    flex: 1,
    height: 58,
    marginLeft: 7,
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  inputPlaceholder: {
    color: colors.inputText,
  },
  changeCard: {
    height: 58,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: colors.card,
  },
  changeAmount: {
    color: colors.green,
    fontSize: 21,
    fontWeight: '900',
  },
  signatureBox: {
    height: 139,
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderColor: '#47474A',
    borderStyle: 'dashed',
    borderRadius: 13,
    backgroundColor: colors.card,
  },
  signatureLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  signaturePrompt: {
    alignSelf: 'center',
    marginBottom: 32,
    color: '#090909',
    fontSize: 13,
  },
  signatureCaptured: {
    color: colors.green,
    fontWeight: '800',
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
