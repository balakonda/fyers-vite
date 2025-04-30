import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "Roboto",
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: "info" },
              style: {
                backgroundColor: "#a5d6a7",
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;
