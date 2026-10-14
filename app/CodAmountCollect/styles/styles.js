import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 28,
  },
  header: {
    paddingHorizontal: 2,
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
    fontWeight: '400',
    lineHeight: 26,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  orderMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 13,
  },
  amountCard: {
    alignItems: 'center',
    minHeight: 142,
    marginTop: 7,
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
    letterSpacing: 0.5,
  },
  amount: {
    marginTop: 4,
    color: colors.gold,
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 57,
  },
  amountMeta: {
    marginTop: 2,
    color: '#9C8000',
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 17,
    marginBottom: 10,
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
  },
  methods: {
    gap: 10,
  },
  methodCard: {
    minHeight: 89,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 17,
    backgroundColor: colors.card,
  },
  methodCardSelected: {
    borderColor: colors.gold,
  },
  methodIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.iconBackground,
  },
  cashIcon: {
    backgroundColor: colors.cashIconBackground,
  },
  methodEmoji: {
    fontSize: 25,
  },
  methodCopy: {
    flex: 1,
    marginLeft: 13,
  },
  methodTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  methodDescription: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  radio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#444449',
    borderRadius: 11,
  },
  radioSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
  },
  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#151515',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 11,
    backgroundColor: colors.infoBackground,
  },
  infoIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  infoText: {
    flex: 1,
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
});

export default styles;
