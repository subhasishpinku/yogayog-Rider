import { StyleSheet } from 'react-native';

import colors from './colors';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ash, paddingHorizontal: 20, paddingTop: 56 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  titleBar: { height: 70, marginHorizontal: -20, marginTop: -56, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 6, elevation: 6, zIndex: 2 },
  titleBarBack: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  titleBarBackText: { color: '#000000', fontSize: 34, lineHeight: 36 },
  titleBarText: { marginLeft: 8, color: '#000000', fontSize: 18, fontWeight: '900' },
  titleBarSpacer: { width: 36 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  backText: { color: colors.text, fontSize: 25, marginTop: -2 },
  eyebrow: { color: '#000000', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#000000', fontSize: 26, fontWeight: '800', marginTop: 4 },
  loading: { marginTop: 100 },
  errorCard: { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: 18, padding: 20, marginTop: 30 },
  errorTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  errorText: { color: colors.muted, fontSize: 14, marginTop: 8, lineHeight: 20 },
  retryButton: { alignSelf: 'flex-start', backgroundColor: colors.gold, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11, marginTop: 18 },
  retryText: { color: '#17120a', fontWeight: '800' },
  summaryCard: { backgroundColor: '#FFFFFF', borderColor: '#FFC800', borderWidth: 2, borderRadius: 22, padding: 22, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 6, elevation: 6 , marginTop:10},
  summaryLabel: { color: '#000000', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  amount: { color: '#000000', fontSize: 34, fontWeight: '800', marginTop: 8 },
  statusPill: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFC800', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginTop: 16 },
  statusText: { color: '#000000', fontSize: 12, fontWeight: '800' },
  detailsCard: { backgroundColor: '#FFFFFF', borderColor: '#FFC800', borderWidth: 2, borderRadius: 22, padding: 20, marginTop: 16, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 6, elevation: 6 },
  sectionTitle: { color: '#000000', fontSize: 17, fontWeight: '800', marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  detailLabel: { color: '#000000', fontSize: 14 },
  detailValue: { color: '#000000', fontSize: 14, fontWeight: '700', maxWidth: '55%', textAlign: 'right' },
  footerText: { color: colors.background, fontSize: 10, lineHeight: 21, fontWeight: '700', marginTop: 22, textAlign: 'center' },
});

export default styles;
