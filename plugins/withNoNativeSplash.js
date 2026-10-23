const {
  withAndroidManifest,
  withAndroidStyles,
} = require('@expo/config-plugins');

const STARTING_THEME = 'Theme.App.Starting';

const withNoNativeSplash = (config) => {
  config = withAndroidManifest(config, (manifestConfig) => {
    const application = manifestConfig.modResults.manifest.application?.[0];
    const mainActivity = application?.activity?.find(
      (activity) => activity.$?.['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      mainActivity.$['android:theme'] = `@style/${STARTING_THEME}`;
    }

    return manifestConfig;
  });

  return withAndroidStyles(config, (stylesConfig) => {
    const resources = stylesConfig.modResults.resources;
    resources.style = resources.style || [];
    resources.style = resources.style.filter(
      (style) => style.$?.name !== 'Theme.App.SplashScreen'
    );

    const existingStartingTheme = resources.style.find(
      (style) => style.$?.name === STARTING_THEME
    );

    if (!existingStartingTheme) {
      resources.style.push({
        $: {
          name: STARTING_THEME,
          parent: 'Theme.AppCompat.DayNight.NoActionBar',
        },
        item: [
          { $: { name: 'android:windowBackground' }, _: '@android:color/transparent' },
          { $: { name: 'android:windowIsTranslucent' }, _: 'true' },
          { $: { name: 'android:windowDisablePreview' }, _: 'true' },
        ],
      });
    }

    return stylesConfig;
  });
};

module.exports = withNoNativeSplash;
