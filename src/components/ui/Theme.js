import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

const blue = "#85BBE6";
const red = "#CE3B2C";
const green = "#A0D781";
const darkGrey = "#565E66";
const lightGrey = "#d3d3d3";
const placeholder = "#bfbfbf";

const theme = createMuiTheme({
  palette: {
    text: {
      primary: `${darkGrey}`,
    },
    primary: {
      main: `${blue}`,
    },
    secondary: {
      main: `${red}`,
    },
    common: {
      blue: `${blue}`,
      red: `${red}`,
      green: `${green}`,
      white: "#FFFFFF",
      darkGrey: `${darkGrey}`,
      lightGrey: `${lightGrey}`,
      placeholder: `${placeholder}`,
    },
  },
  typography: {
    fontFamily: "Futura",
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        fontFamily: "Futura",
        body: {
          backgroundColor: "white",
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
