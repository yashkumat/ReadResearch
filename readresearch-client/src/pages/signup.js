import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Logo from "../images/logo.png";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

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
    },
    customError: {
        margin: "10px auto 10px auto",
        color: "red",
    }
};

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
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
      confirmPassword: this.state.confirmPassword,
      username: this.state.username,
    };
    this.props.signupUser(userData, this.props.history);
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
            Signup
          </Typography>
        </Grid>

        <form noValidate onSubmit={this.handleSubmit}>
          <Grid item xs={12} container direction="row" justify="center">
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
          </Grid>
          <Grid item xs={12} container direction="row" justify="center">
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={this.state.confirmPassword}
              label="Confirm Password"
              className={classes.textField}
              onChange={this.handleChange}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              fullWidth
            />

            <TextField
              id="username"
              name="username"
              type="text"
              value={this.state.username}
              label="Username"
              className={classes.textField}
              onChange={this.handleChange}
              helperText={errors.username}
              error={errors.username ? true : false}
              fullWidth
            />
          </Grid>

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
                "Signup"
              )}
            </Button>
          </Grid>

          <Grid item xs={12} container direction="row" justify="center">
            <Typography
              variant="caption"
              className={classes.signup}
              color="primary"
              component={Link}
              to="/login"
            >
              Already have account? Login here
            </Typography>
          </Grid>
        </form>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  signupUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(signup));
