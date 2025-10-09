// app/components/charts-config.ts
"use client"

// Chart color configuration for light and dark themes
export const chartTheme = {
  light: {
    primary: "hsl(221.2 83.2% 53.3%)", // primary
    primaryMuted: "hsla(221.2, 83.2%, 53.3%, 0.3)", // primary with opacity
    mutedForeground: "hsl(215.4 16.3% 46.9%)", // muted-foreground
    accent: "hsl(210 40% 96.1%)", // accent
    border: "hsl(214.3 31.8% 91.4%)", // border
    background: "hsl(0 0% 100%)", // background
  },
  dark: {
    primary: "hsl(217.2 91.2% 59.8%)", // primary
    primaryMuted: "hsla(217.2, 91.2%, 59.8%, 0.3)", // primary with opacity
    mutedForeground: "hsl(215 20.2% 65.1%)", // muted-foreground
    accent: "hsl(217.2 32.6% 17.5%)", // accent
    border: "hsl(217.2 32.6% 17.5%)", // border
    background: "hsl(222.2 84% 4.9%)", // background
  },
} as const;