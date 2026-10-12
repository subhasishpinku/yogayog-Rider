import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 17, paddingBottom: 35 },
  approvalIcon: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 3, borderColor: colors.green, borderRadius: 55, backgroundColor: '#13251A' },
  approvalEmoji: { fontSize: 48 },
  title: { color: colors.white, fontSize: 27, fontWeight: '900', textAlign: 'center' },
  subtitle: { maxWidth: 270, marginTop: 10, color: colors.muted, fontSize: 14, lineHeight: 22, textAlign: 'center' },
  detailsCard: { width: '100%', marginTop: 24, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, backgroundColor: colors.card },
  detailRow: { minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.divider },
  lastDetailRow: { borderBottomWidth: 0 },
  detailLabel: { color: colors.muted, fontSize: 12 },
  detailValue: { color: colors.white, fontSize: 13, fontWeight: '900' },
  riderId: { color: colors.gold },
  activeStatus: { color: colors.green },
  startButton: { width: '100%', height: 57, alignItems: 'center', justifyContent: 'center', marginTop: 24, borderRadius: 16, backgroundColor: colors.gold },
  startButtonText: { color: '#080808', fontSize: 16, fontWeight: '900' },
});

export default styles;
