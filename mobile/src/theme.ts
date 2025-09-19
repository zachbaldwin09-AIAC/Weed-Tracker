import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#22c55e', // Green theme for cannabis app
    primaryContainer: '#dcfce7',
    secondary: '#65a30d',
    secondaryContainer: '#f0fdf4',
    tertiary: '#059669',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    outline: '#e2e8f0',
    background: '#fefefe',
    onBackground: '#0f172a',
    onSurface: '#1e293b',
    onPrimary: '#ffffff',
  },
};