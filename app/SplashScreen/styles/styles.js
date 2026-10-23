import { StyleSheet } from 'react-native';

import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.background,
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
    width: 72,
    height: 72,
    marginBottom: 24,
  },
  wordmarkFrame: {
    width: 220,
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  wordmarkImage: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    marginTop: 9,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  footer: {
    position: 'absolute',
    right: 0,
    bottom: 44,
    left: 0,
    alignItems: 'center',
  },
  accent: {
    width: 32,
    height: 4,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  tagline: {
    color: colors.muted,
    fontSize: 12,
  },
});

export default styles;
