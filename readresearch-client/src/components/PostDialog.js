import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import { connect } from 'react-redux';
import { getPost, clearErrors } from '../redux/actions/dataActions';

const styles = {
    profileImage: {
        maxWidth: 75,
        height: 75,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        marginBottom:"10px",
    },
    expandButton: {
        position: 'relative',
        left: "0%"
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
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
        position:'relative',
        left:'70%',
    },
    profile:{
        marginTop:"30px"
    }
};

class PostDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    };
    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }
    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { username, postId } = this.props;
        const newPath = `/users/${username}/post/${postId}`;

        if (oldPath === newPath) oldPath = `/users/${username}`;

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getPost(this.props.postId);
    };
    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
    };

    render() {
        const {
            classes,
            post: {
                postId,
                title,
                description,
                url,
                createdAt,
                likeCount,
                commentCount,
                postCategory,
                imageUrl,
                username,
                comments
            },
            UI: { loading }
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={50} thickness={2} />
            </div>
        ) : (
                <Grid container>
                    <Grid item sm={12} lg={3}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            className={classes.profile}
                        >
                            <img src={imageUrl} alt="Profile" className={classes.profileImage} />
                            
                            <Typography
                                variant="caption"
                                color="textPrimary"
                                component={Link}
                                to={`/user/${username}`}
                            >
                                {username}
                            </Typography> 
                        </Grid>
                    </Grid>
                    <Grid item sm={12} lg={9}>
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
                                variant="caption"
                                color="textPrimary"
                                component={Link}
                                to={url}
                            >
                                {url}
                            </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            className={classes.createdAt}
                        >
                            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                        </Typography>
                        <br />
                        <LikeButton postId={postId} />
                        <span>{likeCount} Recommends</span>
                        <MyButton tip="comments">
                            <QuestionAnswerIcon color="secondary" />
                        </MyButton>
                        <span>{commentCount} Comments</span>
                    </Grid>
                    <Grid item sm={9} lg={12}>
                        <CommentForm postId={postId} />
                    </Grid>
                    <hr />
                    <Comments comments={comments} />
                </Grid>
            );
        return (
            <Fragment>
                <MyButton
                    onClick={this.handleOpen}
                    tip="Expand post"
                    tipClassName={classes.expandButton}
                >
                    <UnfoldMore color="primary" />
                </MyButton>
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
                        <CloseIcon color="error"/>
                    </MyButton>
                    <br />
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    post: state.data.post,
    UI: state.UI
});

const mapActionsToProps = {
    getPost,
    clearErrors
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(PostDialog));