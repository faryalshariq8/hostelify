export const theme = {
  colors: {
    primary: "#8B5A2B", // Brown accent
    secondary: "#5C3A21",
    background: "transparent", // Let the blurred ImageBackground show through
    surface: "rgba(255, 255, 255, 0.75)", // Frosted glass cards
    text: "#222222",
    textSecondary: "#7A7A7A",
    border: "#E0DCD3",
    error: "#D9534F",
    success: "#5CB85C",
    warning: "#F0AD4E",
    cardBackground: "rgba(255, 255, 255, 0.8)", // For glassmorphism
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32, // Large rounded corners like Dwellio/N99
  },
  typography: {
    h1: { fontSize: 32, fontWeight: "800", color: "#1E1E1E" },
    h2: { fontSize: 24, fontWeight: "700", color: "#1E1E1E" },
    h3: { fontSize: 18, fontWeight: "600", color: "#1E1E1E" },
    body: { fontSize: 16, color: "#1E1E1E" },
    bodySecondary: { fontSize: 14, color: "#7A7A7A" },
    caption: { fontSize: 12, color: "#7A7A7A" },
  },
  shadows: {
    soft: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
    },
  },
};
