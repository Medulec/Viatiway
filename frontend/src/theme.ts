import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2f8f55',        // --moss-500
      light: '#b9dec3',       // --moss-200
      dark: '#1d5c38',        // --moss-700
    },
    error: {
      main: '#c13c3c',        // --danger
    },
    background: {
      default: '#faf8f5',     // --sand-50
      paper: '#ffffff',       // --sand-0
    },
    text: {
      primary: '#2e2a21',     // --sand-800
      secondary: '#6b6253',   // --sand-600
    },
  },
  typography: {
    fontFamily: "'Lato', 'Segoe UI', system-ui, sans-serif",
  },
  shape: {
    borderRadius: 10,         // --radius-md
  },
});

export default theme