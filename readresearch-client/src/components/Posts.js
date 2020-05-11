import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ShareIcon from "@material-ui/icons/Share";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import Divider from '@material-ui/core/Divider';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../redux/actions/dataActions';
import MyButton from "../util/MyButton";
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import LikeButton from "./LikeButton";
import { Fab } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { fbButton, tw, email, linkedin, whatsapp, telegram } from "vanilla-sharing";

const styles = {
  card: {
    display: "flex",
    padding: "10px",
  },
  share: {
    marginLeft: "auto",
  },
  AvatarColumn: {
    minHeight: "100%",
  },
  ContentColumn: {
    padding: "10px",
  },
  title: {
    padding: "10px",
  },
  description: {
    padding: "10px",
  },
  category: {
    padding: "10px",
  },
  url: {
    padding: "10px",
  },
  createdAt: {
    paddingRight: "20px",
    paddingTop: "0px",
  },
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%",
  },
  shareIcon:{
    padding:"20px"
  }
};

let shareUrl = '';
let shareTitle = '';
let shareDescription = "";
let shareHashtags = "";
let shareSubject = "";

class Posts extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  openFacebook = () => {
    fbButton({
      url:shareUrl,
    });
  };

    openTwitter = () => {
      tw({
        url:shareUrl,
        title: shareTitle,
        hashtags: shareHashtags,
      });
    };

  openMail = () => {
    email({
      to: "",
      url: shareUrl,
      title: shareTitle,
      description: shareDescription,
      subject: shareSubject,
    });
  }

  opneLinkedin = () => {
    linkedin({
      url: shareUrl,
      title: shareSubject,
      description: shareTitle,
    });
  }

  openWhatsapp = () => {
    whatsapp({
      url: shareUrl,
      title: shareTitle,
      phone: "",
    });
  }

  openTelegram = () => {
    telegram({
      url: shareUrl,
      title: shareTitle,
    });
  }

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      post: {
        postId,
        createdAt,
        username,
        title,
        description,
        url,
        postCategory,
        likeCount,
        commentCount,
        imageUrl,
      },
      user: { authenticated },
    } = this.props;

    const deletePost =
      authenticated && username === this.props.user.userData.username ? (
        <DeletePost postId={postId} />
      ) : null;

      shareUrl = url;
      shareTitle = `I came accross this insightful article on ReadResearch. Checkout now! ${title}.`;
      shareDescription = description;
      shareHashtags = [`#${postCategory}`];
      shareSubject = 'ReadResearch - Recommendation';

    return (
      <div>
        <Card>
          <CardContent>
            <Grid container spacing={0}>
              <Grid item xs={12} lg={3}>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  className={classes.AvatarColumn}
                >
                  <Grid item xs={12}>
                    <CardActionArea component={Link} to={`/user/${username}`}>
                      <Avatar alt={username} src={imageUrl}></Avatar>
                      <Typography variant="caption" color="textPrimary">
                        {username}
                      </Typography>
                    </CardActionArea>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={9}>
                {deletePost}
                <Typography
                  variant="body2"
                  color="textPrimary"
                  className={classes.category}
                >
                  {postCategory}
                </Typography>
                <Typography
                  variant="h5"
                  color="textPrimary"
                  className={classes.title}
                >
                  {title}
                </Typography>
                <Divider />
                <Typography
                  variant="body1"
                  color="textPrimary"
                  className={classes.description}
                >
                  {description}
                </Typography>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  className={classes.url}
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {url}
                  </a>
                </Typography>
                <Divider />
              </Grid>
            </Grid>
          </CardContent>

          <Grid
            container
            alignItems="flex-start"
            justify="flex-end"
            direction="row"
          >
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.createdAt}
            >
              {dayjs(createdAt).fromNow()}
            </Typography>
          </Grid>

          <CardActions disableSpacing>
            <LikeButton postId={postId} />
            <Typography variant="body2">{likeCount}</Typography>
            <MyButton tip="Comment">
              <QuestionAnswerIcon color="secondary" />
            </MyButton>
            <Typography variant="body2" color="primary" className={classes.url}>
              {commentCount}
            </Typography>
            <PostDialog postId={postId} username={username} />
            <IconButton className={classes.share}>
              <Tooltip title="Share post" aria-label="add">
                <Fab color="primary" size="small">
                  <ShareIcon color="secondary" onClick={this.handleOpen} />
                  <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                  >
                    <MyButton
                      tip="Close"
                      onClick={this.handleClose}
                      tipClassName={classes.closeButton}
                    >
                      <CloseIcon color="error" />
                    </MyButton>
                    <DialogTitle>Share this Post!</DialogTitle>
                    <DialogContent>
                      <IconButton
                        aria-label="facebook"
                        onClick={this.openFacebook}
                        className={classes.shareIcon}
                      >
                        <img
                          src="https://img.icons8.com/material/24/000000/facebook-new.png"
                          alt="Facebook"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="facebook"
                        onClick={this.openTwitter}
                        className={classes.shareIcon}
                      >
                        <img
                          src="https://img.icons8.com/material/24/000000/twitter-squared.png"
                          alt="Twitter"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="facebook"
                        onClick={this.openWhatsapp}
                        className={classes.shareIcon}
                      >
                        <img
                          src="https://img.icons8.com/material/24/000000/whatsapp.png"
                          alt="whatsApp"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="facebook"
                        onClick={this.openTelegram}
                        className={classes.shareIcon}
                      >
                        <img
                          src="https://img.icons8.com/material/24/000000/telegram-app.png"
                          alt="Telegram"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="facebook"
                        onClick={this.opneLinkedin}
                        className={classes.shareIcon}
                      >
                        <img
                          src="https://img.icons8.com/material/24/000000/linkedin.png"
                          alt="Linkedin"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="facebook"
                        onClick={this.openMail}
                        className={classes.shareIcon}
                      >
                        <img
                          src="https://img.icons8.com/material/24/000000/gmail--v1.png"
                          alt="Gmail"
                        />
                      </IconButton>
                    </DialogContent>
                  </Dialog>
                </Fab>
              </Tooltip>
            </IconButton>
          </CardActions>
        </Card>
        <br />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  likePost,
  unlikePost
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Posts));

