// Default theme

// ----------------------------------------------------------------------------
// IMPORTS

/* Local */
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// ----------------------------------------------------------------------------

const theme = createMuiTheme({
  palette: {
    primary: red,
    type: "light",
  },
});

export default theme;
