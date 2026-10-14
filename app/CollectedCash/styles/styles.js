import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 102,
  },
  successIcon: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.green,
    borderRadius: 56,
    backgroundColor: colors.greenDark,
  },
  moneyBag: {
    fontSize: 48,
  },
  successTitle: {
    marginTop: 21,
    color: colors.white,
    fontSize: 27,
    fontWeight: '900',
  },
  successTitleAccent: {
    color: colors.white,
  },
  subtitle: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 14,
  },
  detailsCard: {
    alignSelf: 'stretch',
    marginTop: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  detailRow: {
    minHeight: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#333336',
  },
  detailRowLast: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  detailValue: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  greenValue: {
    color: colors.green,
  },
  primaryButton: {
    alignSelf: 'stretch',
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: colors.gold,
  },
  primaryButtonText: {
    color: '#080808',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    alignSelf: 'stretch',
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;
