import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#00a8ff',
          secondary: '#192a56',
          accent: '#e84118',
          error: '#c0392b',
          info: '#00cec9',
          success: '#00b894',
          warning: '#fdcb6e',
          background: '#1e272e',
          surface: '#2f3640',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      elevation: 0,
      rounded: 'lg',
    },
    VCard: {
      elevation: 0,
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VList: {
      elevation: 0,
      rounded: 'lg',
    },
    VNavigationDrawer: {
      elevation: 0,
    },
    VAppBar: {
      elevation: 0,
    },
  },
}); 