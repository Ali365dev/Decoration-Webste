export const tokens = {
  colors: {
    ink: "#111111",
    body: "#555555",
    canvas: "#f5f5f5",
    paper: "#ffffff",
    line: "#dedede",
    lineSoft: "#ebebeb",
    accent: "#f05e2d",
    sale: "#757575",
    placeholder: "#999999",
  },
  radius: {
    pill: "30px",
    media: "10px",
  },
  layout: {
    container: "1260px",
    fullWidthPadding: "3rem",
  },
  motion: {
    default: "all 0.4s",
  },
} as const;

export type DesignTokens = typeof tokens;
