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
    paddingTop: 18,
  },
  avatarOuter: {
    width: 254,
    height: 254,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#102117',
    borderRadius: 127,
  },
  avatar: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.green,
    borderRadius: 46,
    backgroundColor: colors.greenDark,
  },
  avatarText: {
    color: colors.green,
    fontSize: 36,
    fontWeight: '900',
  },
  customerName: {
    marginTop: -3,
    color: colors.white,
    fontSize: 25,
    fontWeight: '900',
  },
  phoneNumber: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 14,
  },
  callingText: {
    marginTop: 7,
    color: colors.green,
    fontSize: 14,
    fontWeight: '900',
  },
  orderMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
  privacyCard: {
    alignSelf: 'stretch',
    minHeight: 63,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  privacyText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  controlsRow: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 31,
  },
  controlItem: {
    alignItems: 'center',
  },
  controlButton: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#29292B',
  },
  controlButtonActive: {
    backgroundColor: '#343438',
  },
  controlIcon: {
    fontSize: 25,
  },
  endCallButton: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    borderRadius: 40,
    backgroundColor: colors.red,
  },
  endCallIcon: {
    fontSize: 29,
    transform: [{ rotate: '135deg' }],
  },
  controlLabel: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 11,
  },
  unreachableText: {
    marginTop: 24,
    color: colors.muted,
    fontSize: 13,
  },
  nonDeliveryButton: {
    alignSelf: 'stretch',
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#242426',
  },
  nonDeliveryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
});

export default styles;
