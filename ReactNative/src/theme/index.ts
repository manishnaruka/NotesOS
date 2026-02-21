/**
 * Theme system — mirrors the 4 CSS variable themes from the Electron app.
 * CSS vars → JS objects so every component can consume them via useTheme().
 */

export type ThemeStyle = 'glass' | 'minimal'
export type ThemeMode = 'dark' | 'light'
export type ThemeId = `${ThemeStyle}-${ThemeMode}`

export interface Theme {
  id: ThemeId
  isDark: boolean
  isGlass: boolean

  // Backgrounds
  bg: string
  bgGradientStart: string
  bgGradientEnd: string
  sidebarBg: string
  toolbarBg: string
  editorBg: string

  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string

  // Borders
  border: string
  borderLight: string
  separator: string

  // Surfaces
  surfaceHover: string
  surfaceActive: string
  selectedBg: string
  selectedBorder: string

  // Inputs
  inputBg: string
  inputBorder: string
  inputFocusBorder: string

  // Buttons
  btnBg: string
  btnBorder: string
  btnPrimaryBg: string
  btnPrimaryHover: string

  // Cards / Modals
  cardBg: string
  cardBorder: string
  overlayBg: string

  // Accent
  accent: string
  accentActiveBg: string
  accentActiveText: string

  // Badges
  badgePurpleBg: string
  badgePurpleText: string
  badgeBlueBg: string
  badgeBlueText: string
  badgeMutedBg: string
  badgeMutedText: string

  // States
  errorBg: string
  errorBorder: string
  errorText: string
  highlightBg: string
  highlightText: string

  // Editor prose
  proseBody: string
  proseHeadings: string
  proseLinks: string
  codeBg: string
  codeText: string
  blockquoteBorder: string
}

const glassDark: Theme = {
  id: 'glass-dark',
  isDark: true,
  isGlass: true,

  bg: '#1a1a2e',
  bgGradientStart: '#0f0c29',
  bgGradientEnd: '#16213e',
  sidebarBg: 'rgba(255, 255, 255, 0.05)',
  toolbarBg: 'rgba(255, 255, 255, 0.04)',
  editorBg: 'rgba(255, 255, 255, 0.03)',

  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.15)',
  separator: 'rgba(255, 255, 255, 0.10)',

  surfaceHover: 'rgba(255, 255, 255, 0.06)',
  surfaceActive: 'rgba(255, 255, 255, 0.10)',
  selectedBg: 'rgba(255, 255, 255, 0.10)',
  selectedBorder: '#60a5fa',

  inputBg: 'rgba(255, 255, 255, 0.06)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
  inputFocusBorder: 'rgba(99, 155, 255, 0.6)',

  btnBg: 'rgba(255, 255, 255, 0.08)',
  btnBorder: 'rgba(255, 255, 255, 0.12)',
  btnPrimaryBg: 'rgba(59, 130, 246, 0.75)',
  btnPrimaryHover: 'rgba(59, 130, 246, 0.90)',

  cardBg: 'rgba(255, 255, 255, 0.07)',
  cardBorder: 'rgba(255, 255, 255, 0.18)',
  overlayBg: 'rgba(0, 0, 0, 0.60)',

  accent: '#3b82f6',
  accentActiveBg: 'rgba(59, 130, 246, 0.25)',
  accentActiveText: '#93c5fd',

  badgePurpleBg: 'rgba(139, 92, 246, 0.20)',
  badgePurpleText: '#c4b5fd',
  badgeBlueBg: 'rgba(59, 130, 246, 0.20)',
  badgeBlueText: '#93c5fd',
  badgeMutedBg: 'rgba(255, 255, 255, 0.08)',
  badgeMutedText: '#94a3b8',

  errorBg: 'rgba(239, 68, 68, 0.10)',
  errorBorder: 'rgba(239, 68, 68, 0.20)',
  errorText: '#fca5a5',
  highlightBg: 'rgba(250, 204, 21, 0.25)',
  highlightText: '#fef08a',

  proseBody: '#e2e8f0',
  proseHeadings: '#f1f5f9',
  proseLinks: '#60a5fa',
  codeBg: 'rgba(0, 0, 0, 0.35)',
  codeText: '#e2e8f0',
  blockquoteBorder: 'rgba(255, 255, 255, 0.15)',
}

const glassLight: Theme = {
  id: 'glass-light',
  isDark: false,
  isGlass: true,

  bg: '#e8ecf1',
  bgGradientStart: '#dfe6ed',
  bgGradientEnd: '#eef1f5',
  sidebarBg: 'rgba(255, 255, 255, 0.55)',
  toolbarBg: 'rgba(255, 255, 255, 0.60)',
  editorBg: 'rgba(255, 255, 255, 0.70)',

  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#94a3b8',

  border: 'rgba(0, 0, 0, 0.06)',
  borderLight: 'rgba(0, 0, 0, 0.10)',
  separator: 'rgba(0, 0, 0, 0.08)',

  surfaceHover: 'rgba(0, 0, 0, 0.04)',
  surfaceActive: 'rgba(0, 0, 0, 0.07)',
  selectedBg: 'rgba(59, 130, 246, 0.08)',
  selectedBorder: '#3b82f6',

  inputBg: 'rgba(255, 255, 255, 0.70)',
  inputBorder: 'rgba(0, 0, 0, 0.10)',
  inputFocusBorder: 'rgba(59, 130, 246, 0.50)',

  btnBg: 'rgba(255, 255, 255, 0.60)',
  btnBorder: 'rgba(0, 0, 0, 0.08)',
  btnPrimaryBg: 'rgba(59, 130, 246, 0.85)',
  btnPrimaryHover: '#3b82f6',

  cardBg: 'rgba(255, 255, 255, 0.65)',
  cardBorder: 'rgba(255, 255, 255, 0.80)',
  overlayBg: 'rgba(0, 0, 0, 0.30)',

  accent: '#3b82f6',
  accentActiveBg: 'rgba(59, 130, 246, 0.12)',
  accentActiveText: '#2563eb',

  badgePurpleBg: 'rgba(139, 92, 246, 0.10)',
  badgePurpleText: '#7c3aed',
  badgeBlueBg: 'rgba(59, 130, 246, 0.10)',
  badgeBlueText: '#2563eb',
  badgeMutedBg: 'rgba(0, 0, 0, 0.05)',
  badgeMutedText: '#64748b',

  errorBg: 'rgba(239, 68, 68, 0.08)',
  errorBorder: 'rgba(239, 68, 68, 0.15)',
  errorText: '#dc2626',
  highlightBg: 'rgba(250, 204, 21, 0.30)',
  highlightText: '#92400e',

  proseBody: '#334155',
  proseHeadings: '#1e293b',
  proseLinks: '#2563eb',
  codeBg: '#1e293b',
  codeText: '#e2e8f0',
  blockquoteBorder: 'rgba(0, 0, 0, 0.12)',
}

const minimalDark: Theme = {
  id: 'minimal-dark',
  isDark: true,
  isGlass: false,

  bg: '#111118',
  bgGradientStart: '#111118',
  bgGradientEnd: '#111118',
  sidebarBg: '#1a1a24',
  toolbarBg: '#1a1a24',
  editorBg: '#141419',

  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  separator: 'rgba(255, 255, 255, 0.08)',

  surfaceHover: 'rgba(255, 255, 255, 0.05)',
  surfaceActive: 'rgba(255, 255, 255, 0.08)',
  selectedBg: 'rgba(59, 130, 246, 0.12)',
  selectedBorder: '#3b82f6',

  inputBg: 'rgba(255, 255, 255, 0.06)',
  inputBorder: 'rgba(255, 255, 255, 0.10)',
  inputFocusBorder: '#3b82f6',

  btnBg: 'rgba(255, 255, 255, 0.06)',
  btnBorder: 'rgba(255, 255, 255, 0.10)',
  btnPrimaryBg: '#3b82f6',
  btnPrimaryHover: '#2563eb',

  cardBg: '#1a1a24',
  cardBorder: 'rgba(255, 255, 255, 0.10)',
  overlayBg: 'rgba(0, 0, 0, 0.65)',

  accent: '#3b82f6',
  accentActiveBg: 'rgba(59, 130, 246, 0.20)',
  accentActiveText: '#93c5fd',

  badgePurpleBg: 'rgba(139, 92, 246, 0.15)',
  badgePurpleText: '#c4b5fd',
  badgeBlueBg: 'rgba(59, 130, 246, 0.15)',
  badgeBlueText: '#93c5fd',
  badgeMutedBg: 'rgba(255, 255, 255, 0.06)',
  badgeMutedText: '#94a3b8',

  errorBg: 'rgba(239, 68, 68, 0.10)',
  errorBorder: 'rgba(239, 68, 68, 0.20)',
  errorText: '#fca5a5',
  highlightBg: 'rgba(250, 204, 21, 0.25)',
  highlightText: '#fef08a',

  proseBody: '#e2e8f0',
  proseHeadings: '#f1f5f9',
  proseLinks: '#60a5fa',
  codeBg: 'rgba(0, 0, 0, 0.40)',
  codeText: '#e2e8f0',
  blockquoteBorder: 'rgba(255, 255, 255, 0.12)',
}

const minimalLight: Theme = {
  id: 'minimal-light',
  isDark: false,
  isGlass: false,

  bg: '#ffffff',
  bgGradientStart: '#ffffff',
  bgGradientEnd: '#ffffff',
  sidebarBg: '#f8f9fb',
  toolbarBg: '#ffffff',
  editorBg: '#ffffff',

  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#94a3b8',

  border: '#e2e8f0',
  borderLight: '#cbd5e1',
  separator: '#e2e8f0',

  surfaceHover: 'rgba(0, 0, 0, 0.03)',
  surfaceActive: 'rgba(0, 0, 0, 0.06)',
  selectedBg: 'rgba(59, 130, 246, 0.06)',
  selectedBorder: '#3b82f6',

  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputFocusBorder: '#3b82f6',

  btnBg: '#f1f5f9',
  btnBorder: '#d1d5db',
  btnPrimaryBg: '#3b82f6',
  btnPrimaryHover: '#2563eb',

  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  overlayBg: 'rgba(0, 0, 0, 0.30)',

  accent: '#3b82f6',
  accentActiveBg: 'rgba(59, 130, 246, 0.10)',
  accentActiveText: '#1d4ed8',

  badgePurpleBg: '#f3e8ff',
  badgePurpleText: '#7c3aed',
  badgeBlueBg: '#dbeafe',
  badgeBlueText: '#2563eb',
  badgeMutedBg: '#f1f5f9',
  badgeMutedText: '#64748b',

  errorBg: '#fef2f2',
  errorBorder: '#fecaca',
  errorText: '#dc2626',
  highlightBg: '#fef08a',
  highlightText: '#92400e',

  proseBody: '#334155',
  proseHeadings: '#1e293b',
  proseLinks: '#2563eb',
  codeBg: '#1e293b',
  codeText: '#e2e8f0',
  blockquoteBorder: '#d1d5db',
}

export const themes: Record<ThemeId, Theme> = {
  'glass-dark': glassDark,
  'glass-light': glassLight,
  'minimal-dark': minimalDark,
  'minimal-light': minimalLight,
}

export function getTheme(id: ThemeId): Theme {
  return themes[id] ?? glassDark
}
