import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agendacultural.app',
  appName: 'Agenda Cultural',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      minSdkVersion: 21,
      targetSdkVersion: 33,
      versionCode: 1,
      versionName: '1.0.0'
    }
  }
};

export default config;