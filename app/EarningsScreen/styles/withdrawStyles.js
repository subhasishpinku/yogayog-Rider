import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 9,
    paddingTop: 9,
    paddingBottom: 28,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  backIcon: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 24,
  },
  title: {
    marginTop: 14,
    color: colors.white,
    fontSize: 23,
    fontWeight: '900',
  },
  available: {
    marginTop: 2,
    color: colors.mutedLight,
    fontSize: 13,
  },
  balanceCard: {
    height: 107,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
    borderWidth: 1,
    borderColor: colors.goldDark,
    borderRadius: 18,
    backgroundColor: colors.cardDark,
  },
  balanceLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  balanceValue: {
    marginTop: 4,
    color: colors.gold,
    fontSize: 37,
    fontWeight: '900',
  },
  fieldLabel: {
    marginTop: 17,
    color: colors.mutedLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  amountInputWrap: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  rupeeSymbol: {
    color: colors.mutedLight,
    fontSize: 17,
    fontWeight: '800',
  },
  amountInput: {
    flex: 1,
    marginLeft: 8,
    padding: 0,
    color: colors.white,
    fontSize: 23,
    fontWeight: '900',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
  },
  quickAmount: {
    width: '23.5%',
    height: 41,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  quickAmountSelected: {
    borderWidth: 2,
    borderColor: colors.gold,
  },
  quickAmountText: {
    color: colors.mutedLight,
    fontSize: 13,
    fontWeight: '800',
  },
  quickAmountTextSelected: {
    color: colors.gold,
  },
  bankCard: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: colors.card,
  },
  bankIconWrap: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#303033',
  },
  bankIcon: {
    fontSize: 22,
  },
  bankCopy: {
    flex: 1,
    marginLeft: 13,
  },
  bankName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  accountNumber: {
    marginTop: 3,
    color: colors.mutedLight,
    fontSize: 12,
    letterSpacing: 1,
  },
  changeText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  notice: {
    minHeight: 64,
    justifyContent: 'center',
    marginTop: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#5E4B00',
    borderRadius: 14,
    backgroundColor: '#2B281A',
  },
  noticeText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  withdrawAction: {
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    borderRadius: 17,
    backgroundColor: colors.gold,
  },
  withdrawActionText: {
    color: '#080808',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;

