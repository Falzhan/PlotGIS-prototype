import { MD3LightTheme } from 'react-native-paper';

export const PALETTE = {
  primary: '#089A96',   // Teal
  secondary: '#FAB700', // Yellow
  support: '#1D3422',   // Dark Green
  glass: 'rgba(255, 255, 255, 0.85)',
};

export const PaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: PALETTE.primary,
    secondary: PALETTE.secondary,
    background: '#f0f4f1',
  },
};
