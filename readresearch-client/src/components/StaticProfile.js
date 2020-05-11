import React, { Fragment, Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// MUI
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { connect } from 'react-redux';
import { getUser } from '../redux/actions/dataActions';

const styles = {
  paper: {
    padding: 20
  },
  profile: {
    '& .image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '75%',
        left: '60%'
      },
      marginBottom: '10px',
    },
    '& .profile-image': {
      width: 100,
      height: 100,
      objectFit: 'cover',
      maxWidth: '100%',
      borderRadius: '50%'
    },
    '& .profile-details': {
      textAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle'
      },
      '& a': {
        color: '#00bcd4'
      }
    },
    '& hr': {
      border: 'none',
      margin: '0 0 10px 0'
    },
    '& svg.button': {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  noProfileButton: {
    margin: '5px',
    padding: '5px'
  }
};


class StaticProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //states
    };
  }

  componentDidMount() {
    const username = this.props.username;
    this.props.getUser(username);
  }

  render() {
    const { classes, user: { userData: { username, bio, location, website, imageUrl, createdAt } } } = this.props;
    return (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image" />
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${username}`}
              color="primary"
              variant="h5"
            >
              @{username}
            </MuiLink>
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <Fragment>
                <LocationOn color="primary" /> <span>{location}</span>
                <hr />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {' '}
                  {website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />{' '}
            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
          </div>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

StaticProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapActionsToProps = {
  getUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(StaticProfile));