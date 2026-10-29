import { StyleSheet } from 'react-native';
import colors from './EditProfileColors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
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
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.card,
    color: colors.white,
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
    backgroundColor: colors.gold,
  },
  saveText: {
    color: '#080808',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;
