// Define the app's color palette
export const colors = {
  primary: '#FFFFFF', // White
  secondary: '#E0E0E0', // Light Gray
  tertiary: '#B0B0B0', // Medium Gray
  quaternary: '#808080', // Dark Gray
  background: '#000000', // Black
  card: '#1A1A1A', // Very Dark Gray/Off-Black for card backgrounds
  text: '#FFFFFF', // White for main text
  textSecondary: '#E0E0E0', // Light Gray for secondary text
  border: '#333333', // Dark Gray for borders
  error: '#FF3B30', // Red for errors
  success: '#34C759', // Green for success (can keep or change depending on need, but will avoid for general UI)
  warning: '#FFCC00', // Yellow for warnings

  // Dark mode colors (redundant with the all-black theme, but keeping structure)
  dark: {
    background: '#000000', // Black
    card: '#1A1A1A', // Very Dark Gray/Off-Black
    text: '#FFFFFF', // White
    textSecondary: '#E0E0E0', // Light Gray
    border: '#333333', // Dark Gray
  },

  // Light mode colors (will be same as dark for a consistent theme)
  light: {
    background: '#000000', // Black
    card: '#1A1A1A', // Very Dark Gray/Off-Black
    text: '#FFFFFF', // White
    textSecondary: '#E0E0E0', // Light Gray
    border: '#333333', // Dark Gray
  },

  // Core colors
  accent: "#FF6B6B", // Red for negative values/alerts
  positive: "#00FF66", // Green for positive values
  negative: "#FF6B6B", // Red for negative values
  info: "#7AA5FF", // Blue for information
  
  // Category colors
  categories: {
    paypal: "#9D6FFF", // Purple
    food: "#A5F0D3", // Mint green
    dining: "#FF9F7A", // Orange
    transportation: "#9D6FFF", // Purple
    transport: "#9D6FFF", // Purple (alias)
    electricity: "#FFD166", // Yellow
    utilities: "#FFD166", // Yellow (alias)
    entertainment: "#FF9F7A", // Orange
    shopping: "#FF7AAC", // Pink
    housing: "#7AA5FF", // Blue
    home: "#7AA5FF", // Blue (alias)
    health: "#7AFFCB", // Teal
    education: "#9D6FFF", // Purple
    income: "#A5F0D3", // Mint green
    salary: "#A5F0D3", // Mint green (alias)
    transfer: "#7AA5FF", // Blue
    investment: "#9D6FFF", // Purple
    subscription: "#FF7AAC", // Pink
    personal: "#FF9F7A", // Orange
    travel: "#7AA5FF", // Blue
  },

  // Graph colors
  graph: {
    line: "#9D6FFF", // Purple line
    grid: "#333333", // Dark gray grid
    highlight: "#A5F0D3", // Mint green highlight
    text: "#A3A3A3", // Light gray text
  },
  
  transparent: 'transparent',
};