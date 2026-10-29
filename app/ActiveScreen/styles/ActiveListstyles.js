import { StyleSheet } from 'react-native';

import colors from './colors';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 14, paddingTop: 17, paddingBottom: 14, backgroundColor: '#090909' },
  eyebrow: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { marginTop: 5, color: colors.white, fontSize: 24, fontWeight: '900' },
  subtitle: { marginTop: 3, color: colors.mutedLight, fontSize: 12 },
  searchInput: { height: 49, marginHorizontal: 12, marginTop: 10, paddingHorizontal: 16, borderRadius: 15, backgroundColor: '#29292B', color: colors.white, fontSize: 13 },
  statusTabs: { paddingHorizontal: 10, paddingVertical: 11, gap: 8 },
  statusTab: { height: 35, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 18, backgroundColor: '#242426' },
  selectedStatusTab: { backgroundColor: colors.gold },
  statusDot: { marginRight: 4, color: colors.gold, fontSize: 16, lineHeight: 16 },
  selectedStatusDot: { color: '#080808' },
  statusTabText: { color: colors.mutedLight, fontSize: 11, fontWeight: '800' },
  selectedStatusTabText: { color: '#080808' },
  listContent: { paddingHorizontal: 9, paddingBottom: 110 },
  resultText: { marginHorizontal: 5, marginBottom: 8, color: colors.muted, fontSize: 11 },
  loader: { marginTop: 45 },
  orderCard: { marginBottom: 8, padding: 11, borderTopWidth: 2, borderTopColor: colors.gold, borderRadius: 14, backgroundColor: '#151517' },
  orderTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderCode: { color: colors.white, fontSize: 14, fontWeight: '900' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: '#201D0A' },
  statusBadgeText: { color: colors.gold, fontSize: 10, fontWeight: '900' },
  customerName: { marginTop: 8, color: colors.white, fontSize: 14, fontWeight: '900' },
  customerPhone: { marginTop: 2, color: colors.mutedLight, fontSize: 11 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  routeDot: { width: 18, color: '#B48700', fontSize: 12 },
  dropDot: { width: 18, color: '#292929', fontSize: 12 },
  routeText: { flex: 1, color: colors.mutedLight, fontSize: 11, fontWeight: '700' },
  routeDivider: { height: 1, marginTop: 6, marginLeft: 18, backgroundColor: colors.border },
  orderBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  createdAt: { color: colors.muted, fontSize: 9 },
  amount: { color: colors.gold, fontSize: 16, fontWeight: '900' },
  emptyCard: { alignItems: 'center', justifyContent: 'center', minHeight: 170, padding: 20, borderRadius: 17, backgroundColor: '#242426' },
  emptyTitle: { color: colors.white, fontSize: 17, fontWeight: '900' },
  emptyText: { marginTop: 6, color: colors.mutedLight, fontSize: 12, textAlign: 'center' },
  retryButton: { marginTop: 14, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 16, backgroundColor: colors.gold },
  retryText: { color: '#080808', fontSize: 12, fontWeight: '900' },
});

export default styles;
