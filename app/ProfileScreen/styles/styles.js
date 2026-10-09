import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 112,
  },
  header: {
    height: 213,
    paddingHorizontal: 12,
    paddingTop: 18,
    overflow: 'hidden',
    backgroundColor: colors.header,
  },
  headerRing: {
    position: 'absolute',
    top: -47,
    right: -15,
    width: 122,
    height: 122,
    borderWidth: 15,
    borderColor: '#2E2810',
    borderRadius: 70,
  },
  avatar: {
    width: 79,
    height: 79,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.goldDark,
    borderRadius: 24,
    backgroundColor: '#302706',
  },
  avatarText: {
    color: colors.gold,
    fontSize: 31,
    fontWeight: '900',
  },
  name: {
    marginTop: 13,
    color: colors.white,
    fontSize: 21,
    fontWeight: '900',
  },
  role: {
    marginTop: 2,
    color: colors.mutedLight,
    fontSize: 13,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  statusChip: {
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#303033',
  },
  onlineChip: {
    backgroundColor: colors.greenDark,
  },
  ratingChip: {
    backgroundColor: colors.yellowDark,
  },
  onlineText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '800',
  },
  ratingText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
  },
  statusText: {
    color: colors.mutedLight,
    fontSize: 11,
    fontWeight: '700',
  },
  detailCard: {
    marginHorizontal: 8,
    marginTop: 16,
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  detailTitle: {
    marginBottom: 8,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  detailRow: {
    minHeight: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
  },
  detailValue: {
    maxWidth: '65%',
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
    textAlign: 'right',
  },
  highlightValue: {
    color: colors.gold,
  },
  warningValue: {
    color: '#FF9D00',
  },
  editButton: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 17,
    backgroundColor: colors.gold,
  },
  editIcon: {
    marginRight: 8,
    color: '#080808',
    fontSize: 24,
    lineHeight: 24,
  },
  editText: {
    color: '#080808',
    fontSize: 17,
    fontWeight: '900',
  },
});

export default styles;
