import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  map: { ...StyleSheet.absoluteFillObject },
  mapOverlay: { flex: 1, justifyContent: 'space-between', padding: 10 },
  routeCard: { padding: 14, borderWidth: 1, borderColor: '#6A5317', borderRadius: 17, backgroundColor: 'rgba(20,20,31,0.94)' },
  routeLabel: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  routeDestination: { marginTop: 2, color: colors.white, fontSize: 15, fontWeight: '900' },
  routeDistance: { position: 'absolute', top: 13, right: 14, color: colors.gold, fontSize: 21, fontWeight: '900' },
  routeTime: { position: 'absolute', top: 39, right: 16, color: colors.muted, fontSize: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  gpsStatus: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, color: colors.green, backgroundColor: colors.greenDark, fontSize: 11, fontWeight: '900' },
  networkStatus: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, color: colors.white, backgroundColor: '#292934', fontSize: 11, fontWeight: '900' },
  markerRider: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.gold, borderRadius: 24, backgroundColor: colors.gold, shadowColor: colors.gold, shadowOpacity: 0.7, shadowRadius: 12, elevation: 8 },
  riderEmoji: { fontSize: 24 },
  markerDestination: { width: 34, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: colors.red },
  destinationPin: { color: '#080808', fontSize: 22, fontWeight: '900' },
  bottomCard: { padding: 14, borderWidth: 1, borderColor: '#6A5317', borderRadius: 17, backgroundColor: 'rgba(20,20,31,0.96)' },
  bottomLabel: { color: colors.muted, fontSize: 11 },
  locationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  currentLocation: { marginTop: 2, color: colors.white, fontSize: 14, fontWeight: '900' },
  navigateButton: { alignItems: 'center', justifyContent: 'center', minWidth: 98, height: 38, marginLeft: 8, borderRadius: 20, backgroundColor: colors.gold },
  navigateText: { color: '#080808', fontSize: 11, fontWeight: '900' },
  coordinates: { marginTop: 3, color: colors.muted, fontSize: 11 },
  actionRow: { flexDirection: 'row', marginTop: 13 },
  orderButton: { flex: 1, height: 39, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#30303A' },
  callButton: { flex: 1, height: 39, alignItems: 'center', justifyContent: 'center', marginLeft: 8, borderRadius: 20, backgroundColor: colors.gold },
  actionText: { color: colors.white, fontSize: 12, fontWeight: '900' },
  callText: { color: '#080808', fontSize: 12, fontWeight: '900' },
  riderMarkerText: { color: '#080808', fontSize: 10, fontWeight: '900' },
});

export default styles;
