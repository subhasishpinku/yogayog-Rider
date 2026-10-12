import { StyleSheet } from 'react-native';
import colors from './ActiveDeliverycolors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 19,
    paddingTop: 101,
  },
  successIcon: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.green,
    borderRadius: 56,
  },
  checkBox: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EC500',
  },
  checkMark: {
    color: colors.white,
    fontSize: 46,
    fontWeight: '900',
    lineHeight: 50,
  },
  title: {
    marginTop: 24,
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
  },
  orderText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  earnedCard: {
    width: '100%',
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 27,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    backgroundColor: colors.card,
  },
  earnedLabel: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  earnedValue: {
    marginTop: 4,
    color: colors.gold,
    fontSize: 38,
    fontWeight: '900',
  },
  walletText: {
    marginTop: 1,
    color: colors.muted,
    fontSize: 12,
  },
  ratingCard: {
    width: '100%',
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 17,
    backgroundColor: colors.card,
  },
  ratingQuestion: {
    color: colors.mutedLight,
    fontSize: 14,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  star: {
    marginHorizontal: 3,
    color: '#111112',
    fontSize: 36,
    lineHeight: 39,
    textShadowColor: colors.gold,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  starSelected: {
    color: colors.gold,
  },
  homeButton: {
    width: '100%',
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 17,
    backgroundColor: colors.gold,
  },
  homeButtonText: {
    color: '#080808',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;
