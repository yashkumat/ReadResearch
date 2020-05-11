import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Logo from "../images/logo.png";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import {connect} from 'react-redux';
import { loginUser } from "../redux/actions/userActions";

const styles = {
  form: {
    textAlign: "center",
  },
  image: {
    width: "10%",
    height: "10%",
  },
  button: {
    margin: "10px",
  },
  textField: {
    margin: "10px auto 10px auto",
    color:"#FFEB3B"
  },
  customError: {
    margin: "10px auto 10px auto",
    color: "#c23616",
  }
};

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid
          item
          xs={12}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <img src={Logo} alt="Read Research" className={classes.image} />
          <Typography variant="h3" className={classes.title} color="primary">
            Login
          </Typography>
        </Grid>

        <form noValidate onSubmit={this.handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            value={this.state.email}
            label="Email"
            helperText={errors.email}
            error={errors.email ? true : false}
            className={classes.textField}
            onChange={this.handleChange}
            fullWidth
          />

          <TextField
            id="password"
            name="password"
            type="password"
            value={this.state.password}
            label="Password"
            className={classes.textField}
            onChange={this.handleChange}
            helperText={errors.password}
            error={errors.password ? true : false}
            fullWidth
          />

          <Grid item xs={12} container direction="row" justify="center">
            {errors.general && (
              <Typography variant="caption" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} container direction="row" justify="center">
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              className={classes.button}
              justify="center"
            >
              {loading ? (
                <CircularProgress size={23} className={classes.progress} />
              ) : (
                "Login"
              )}
            </Button>
          </Grid>
          <Grid item xs={12} container direction="row" justify="center">
            <Typography
              variant="caption"
              className={classes.signup}
              color="primary"
              component={Link}
              to="/signup"
            >
              Don't have account? Signup here
            </Typography>
          </Grid>
        </form>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user:state.user,
  UI:state.UI
})

const mapActionsToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
