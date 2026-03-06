/**
 * Global color system for Light & Dark mode
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#4da6ff';

export const Colors = {
  light: {
    // Main
    text: '#11181C',
    secondaryText: '#687076',
    background: '#F8F9FB',
    card: '#FFFFFF',

    // Brand
    tint: tintColorLight,

    // UI
    border: '#E5E7EB',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },

  dark: {
    // Main
    text: '#ECEDEE',
    secondaryText: '#9BA1A6',
    background: '#0F1115',
    card: '#1C1F26',

    // Brand
    tint: tintColorDark,

    // UI
    border: '#2A2F3A',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});