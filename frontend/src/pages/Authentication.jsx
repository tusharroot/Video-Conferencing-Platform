import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {/* <Link color="inherit" href="https://mui.com/"> */}
      Tushar Patel. All rights reserved.
      {/* </Link>{" "} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, SetUsername] = React.useState();
  const [password, SetPassword] = React.useState();
  const [name, SetName] = React.useState();
  const [error, setError] = React.useState();
  const [message, setMessage] = React.useState();

  const [formstate, setFormstate] = React.useState(0); 

  const [open, setOpen] = React.useState();

  const {handlelogin, handleregister} = React.useContext(AuthContext);
  let handleAuth = async () => {
    try {
      if (formstate === 0) {
        let result = await handlelogin(username,password);
        
      }
      if (formstate === 1) {
        let result = await handleregister(name, username, password);
        console.log(result);
        setMessage(result);
        setOpen(true);
        SetUsername("")
        setError("")
        setFormstate(0)
        SetPassword("")
      }
    } catch (error) {
      let message = error.response.data.message;
      setError(message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh",alignItems:"center",justifyContent:"center" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <div>
              <Button
                variant={formstate == 0 ? "contained" : ""}
                onClick={() => setFormstate(0)}
              >
                Sign In
              </Button>
              <Button
                variant={formstate == 1 ? "contained" : ""}
                onClick={() => setFormstate(1)}
              >
                Sign Up
              </Button>
            </div>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              {formstate == 1 ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Fullname"
                  label="Fullname"
                  value={name}
                  name="Fullname"
                  autoFocus
                  onChange={(e) => SetName(e.target.value)}
                />
              ) : (
                <></>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                value={username}
                autoFocus
                onChange={(e) => SetUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                id="password"
                onChange={(e) => SetPassword(e.target.value)}
              />
              <p style={{color:"red"}}>{error}</p>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
              >
                {formstate===0?"LogIn":"Register"}
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}
