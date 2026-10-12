import { StyleSheet } from 'react-native';
import colors from './colors';
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },
  header: { height: 111, paddingHorizontal: 12, paddingTop: 17, backgroundColor: colors.header },
  ring: { position: 'absolute', top: -30, right: -27, width: 118, height: 118, borderWidth: 14, borderColor: '#302812', borderRadius: 999 },
  avatar: { position: 'absolute', top: 27, right: 21, zIndex: 10, elevation: 2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#473E17' },
  avatarText: { color: colors.gold, fontSize: 18, fontWeight: '900' },
  greeting: { color: colors.mutedLight, fontSize: 13 },
  name: { marginTop: 2, color: colors.white, fontSize: 21, fontWeight: '900' },
  vehicle: { alignSelf: 'flex-start', marginTop: 7, paddingHorizontal: 13, paddingVertical: 6, borderRadius: 18, backgroundColor: '#29292B', color: colors.gold, fontSize: 12, fontWeight: '800' },
  statusCard: { height: 65, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.card },
  statusTitle: { color: colors.white, fontSize: 14, fontWeight: '800' },
  online: { color: colors.green },
  statusSubtext: { marginTop: 3, color: colors.muted, fontSize: 12 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 8 },
  metricCard: { width: '48.5%', height: 72, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.card },
  metricValue: { color: colors.white, fontSize: 23, fontWeight: '900' },
  earnings: { color: colors.gold, fontSize: 23, fontWeight: '900' },
  deliveries: { color: colors.green, fontSize: 23, fontWeight: '900' },
  metricLabel: { marginTop: 2, color: colors.muted, fontSize: 11 },
  sectionTitle: { paddingHorizontal: 12, marginTop: 17, marginBottom: 10, color: colors.white, fontSize: 16, fontWeight: '900' },
  map: { height: 159, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8, borderRadius: 16, backgroundColor: colors.blue },
  locationPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 11, backgroundColor: colors.gold, elevation: 8 },
  locationText: { color: '#080808', fontSize: 14, fontWeight: '900' },
  orderHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nearby: { paddingHorizontal: 12, marginTop: 17, marginBottom: 10, color: colors.gold, fontSize: 12, fontWeight: '800' },
  orderCard: { minHeight: 92, marginHorizontal: 8, padding: 14, borderWidth: 2, borderColor: colors.gold, borderRadius: 17, backgroundColor: colors.card },
  orderMeta: { color: colors.muted, fontSize: 12 },
  orderTitle: { marginTop: 3, color: colors.white, fontSize: 15, fontWeight: '800' },
  fare: { position: 'absolute', top: 17, right: 14, color: colors.gold, fontSize: 17, fontWeight: '900' },
  fareLabel: { position: 'absolute', top: 40, right: 14, color: colors.muted, fontSize: 11 },
  bottomTabs: { position: 'absolute', right: 0, bottom: 0, left: 0, height: 82, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#333336', backgroundColor: '#151517' },
  tab: { alignItems: 'center', width: '25%' },
  tabIcon: { fontSize: 21 },
  tabLabel: { marginTop: 3, color: colors.muted, fontSize: 10 },
  activeTab: { marginTop: 3, color: colors.gold, fontSize: 10, fontWeight: '800' },
  offlineCard: { minHeight: 145, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8, marginTop: 17, borderRadius: 17, backgroundColor: colors.card },
  sleepingIcon: { fontSize: 36 },
  offlineTitle: { marginTop: 8, color: colors.white, fontSize: 17, fontWeight: '900' },
  offlineText: { marginTop: 5, color: colors.muted, fontSize: 12 },
});
export default styles;




