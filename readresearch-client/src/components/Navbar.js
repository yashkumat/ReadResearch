import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import MyButton from '../util/MyButton';
import PostPost from './PostPost';
import Notifications from './Notifications';
// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// Icons
import HomeIcon from '@material-ui/icons/Home';

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <div className="menu2">
                <PostPost/>
                <Link to="/">
                  <MyButton tip="Home">
                    <HomeIcon color="secondary"/>
                  </MyButton>
                </Link>
                <Notifications/>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Button className="logo" component={Link} to="/">
                Home
              </Button>
              <div className="menu">
                <Button component={Link} to="/login" className="navitems">
                  Login
                </Button>
                <Button component={Link} to="/signup" className="navitems">
                  Signup
                </Button>
              </div>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Navbar);
