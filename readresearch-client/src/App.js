import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import Navbar from "./components/Navbar";
import Container from "@material-ui/core/Container";
import jwtDecode from "jwt-decode";
import AuthRoute from "./util/AuthRoute";
import { Provider } from 'react-redux';
import store from './redux/store';
import { logoutUser, getUserData } from "./redux/actions/userActions";
import { SET_AUTHENTICATED } from "./redux/types";
import user from './pages/user';
import axios from 'axios';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#03A9F4' },
    secondary: { main: '#FFEB3B' },
    error: {
      main: "#c23616",
    },
  },
  warning: { main: "#c23616" }
});

axios.defaults.baseURL =
  "https://us-central1-readresearch-88.cloudfunctions.net/api";

const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    store.dispatch(logoutUser());
  } else {
    store.dispatch({ type: SET_AUTHENTICATED })
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <Container maxWidth="md" className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
                <Route exact path="/user/:username" component={user} />
                <Route exact path="/user/:username/post/:postId" component={user} />
              </Switch>
            </Container>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
