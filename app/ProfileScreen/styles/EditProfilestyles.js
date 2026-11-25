import { StyleSheet } from 'react-native';
import colors from './EditProfileColors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ash,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 28,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  backIcon: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 24,
  },
  title: {
    marginTop: 14,
    color: colors.white,
    fontSize: 23,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 2,
    color: colors.mutedLight,
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  fieldGroup: {
    marginBottom: 13,
  },
  fieldLabel: {
    marginBottom: 6,
    color: colors.mutedLight,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.background,
    borderRadius: 14,
    backgroundColor: colors.white,
    color: colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
  readOnlyInput: {
    opacity: 0.65,
  },
  highlightedInput: {
    borderColor: colors.gold,
  },
  splitFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cityField: {
    width: '65%',
  },
  pinField: {
    width: '31%',
  },
  saveButton: {
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderRadius: 17,
    bottom: 20,
    backgroundColor: colors.gold,
  },
  saveText: {
    color:colors.background,
    fontSize: 16,
    fontWeight: '900',
  },
  
titleBar: {
    height: 70,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    elevation: 8,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  titleBarBack: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBarBackText: {
    color: colors.background,
    fontSize: 34,
    lineHeight: 36,
  },
  titleBarText: {
    marginLeft: 8,
    marginTop:7,
    color: colors.background,
    fontSize: 18,
    fontWeight: '900',
    alignItems: 'left',

  },
  titleBarSpacer: {
    width: 36,
  },
});

export default styles;
