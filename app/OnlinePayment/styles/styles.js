import { StyleSheet } from 'react-native';
import colors from './colors';
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 56 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  backText: { color: colors.text, fontSize: 25, marginTop: -2 },
  eyebrow: { color: colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 25, fontWeight: '800', marginTop: 4 },
  loading: { marginTop: 100 },
  errorCard: { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: 18, padding: 20, marginTop: 30 },
  errorTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  errorText: { color: colors.muted, fontSize: 14, marginTop: 8, lineHeight: 20 },
  retryButton: { alignSelf: 'flex-start', backgroundColor: colors.gold, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11, marginTop: 18 },
  retryText: { color: '#17120a', fontWeight: '800' },
  summaryCard: { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: 22, padding: 22 },
  summaryLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  amount: { color: colors.gold, fontSize: 34, fontWeight: '800', marginTop: 8 },
  statusPill: { alignSelf: 'flex-start', backgroundColor: colors.goldSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginTop: 16 },
  statusText: { color: colors.gold, fontSize: 12, fontWeight: '800' },
  detailsCard: { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: 22, padding: 20, marginTop: 16 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomColor: colors.cardBorder, borderBottomWidth: 1 },
  detailLabel: { color: colors.muted, fontSize: 14 },
  detailValue: { color: colors.text, fontSize: 14, fontWeight: '700', maxWidth: '55%', textAlign: 'right' },
});
export default styles;




