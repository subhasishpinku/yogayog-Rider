import { StyleSheet } from 'react-native';

import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.goldDeep,
  },
  ring: {
    position: 'absolute',
    borderWidth: 20,
    borderColor: colors.ring,
    borderRadius: 999,
  },
  topRing: {
    top: '8.5%',
    right: -42,
    width: 160,
    height: 160,
  },
  bottomRing: {
    bottom: '21%',
    left: -50,
    width: 124,
    height: 124,
    borderWidth: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 28,
  },
  brand: {
    alignItems: 'center',
  },
  riderLogo: {
    width: 140,
    height: 120,
    marginBottom: 5,
  },
  wordmarkFrame: {
    width: 220,
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.goldDeep,
  },
  wordmarkImage: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    marginTop: 9,
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  footer: {
    fontSize: 15,
    position: 'absolute',
    right: 0,
    bottom: 60,
    left: 0,
    color: colors.white,
    alignItems: 'center',
  },
  accent: {
    width: 32,
    height: 4,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: colors.goldDeep,
  },
  tagline: {
    color: colors.white,
    fontSize: 12,
  },
  runningBike: {
    width: 82,
    height: 70,
    marginTop: 8,
  },
});

export default styles;
