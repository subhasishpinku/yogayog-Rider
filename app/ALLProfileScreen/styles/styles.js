import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 110 },
  header: { paddingHorizontal: 14, paddingTop: 24, paddingBottom: 23, backgroundColor: colors.header },
  title: { color: colors.white, fontSize: 24, fontWeight: '900' },
  subtitle: { marginTop: 5, color: colors.mutedLight, fontSize: 13 },
  sectionTitle: { marginTop: 22, marginBottom: 10, paddingHorizontal: 14, color: colors.muted, fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
  itemCard: { minHeight: 78, flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 10, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 16, backgroundColor: colors.card },
  itemIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#303033' },
  goldIcon: { backgroundColor: colors.goldDark },
  greenIcon: { backgroundColor: colors.greenDark },
  itemIconText: { color: colors.mutedLight, fontSize: 20, fontWeight: '900' },
  goldIconText: { color: colors.gold },
  greenIconText: { color: colors.green },
  itemCopy: { flex: 1, marginLeft: 12 },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', paddingRight: 4 },
  itemTitle: { flexShrink: 1, color: colors.white, fontSize: 14, fontWeight: '900' },
  badge: { marginLeft: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, color: colors.gold, backgroundColor: colors.goldDark, fontSize: 9, fontWeight: '900' },
  itemSubtitle: { marginTop: 5, color: colors.muted, fontSize: 11, lineHeight: 15 },
  chevron: { marginLeft: 6, color: colors.mutedLight, fontSize: 26, fontWeight: '300' },
});

export default styles;
