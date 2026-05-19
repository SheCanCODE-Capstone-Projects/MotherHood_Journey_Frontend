/**
 * MotherHood Journey - Design Theme Configuration
 * Based on Serene Matriarch Design System
 */

export const DESIGN_THEME = {
  colors: {
    patient: {
      primary: "#0F766E",
      secondary: "#06B6D4",
      text: "#0D5C5D",
      background: "#F0FDFA",
      accent: "#14B8A6",
      border: "#0F766E",
      light: "#CCFBF1",
      dark: "#134E4A",
    },
    health_worker: {
      primary: "#0369A1",
      secondary: "#0EA5E9",
      text: "#0C4A6E",
      background: "#F0F9FE",
      accent: "#0284C7",
      border: "#0369A1",
      light: "#CFFAFE",
      dark: "#003D82",
    },
    facility_admin: {
      primary: "#047857",
      secondary: "#10B981",
      text: "#065F46",
      background: "#F0FDF4",
      accent: "#059669",
      border: "#047857",
      light: "#D1FAE5",
      dark: "#064E3B",
    },
    district_officer: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      text: "#1E3A8A",
      background: "#EFF6FF",
      accent: "#2563EB",
      border: "#1E40AF",
      light: "#DBEAFE",
      dark: "#1E3A8A",
    },
    government: {
      primary: "#7C3AED",
      secondary: "#8B5CF6",
      text: "#5B21B6",
      background: "#FAF5FF",
      accent: "#A78BFA",
      border: "#7C3AED",
      light: "#EDE9FE",
      dark: "#4C1D95",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  typography: {
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    small: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
};

export function getThemeByRole(role: string) {
  return (
    DESIGN_THEME.colors[role as keyof typeof DESIGN_THEME.colors] ||
    DESIGN_THEME.colors.patient
  );
}

export type ThemeRole = keyof typeof DESIGN_THEME.colors;
