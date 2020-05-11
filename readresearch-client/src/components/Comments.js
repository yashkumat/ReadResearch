import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = {
    commentImage: {
        width: 50,
        height: 50,
        objectFit: 'cover',
        borderRadius: '50%',
    },
    commentData:{
        marginTop:'10px',
    },
    createdAt:{
        position:"relative",
        left:'70%'
    },
    username:{
        textDecoration: 'none'
    },
    invisibleSeparator: {
        color: '#FFEB3B'
    }
};

class Comments extends Component {
    render() {
        const { comments, classes } = this.props;
        return (
            <Grid container>
                {comments.map((comment, index) => {
                    const { commentBody, createdAt, imageUrl, username } = comment;
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={3} 
                                        container
                                        direction="column"
                                        alignItems="center"
                                        justify="center">
                                        <img
                                            src={imageUrl}
                                            alt="comment"
                                            className={classes.commentImage}
                                        /> 
                                        <Typography
                                            variant="caption"
                                            component={Link}
                                            to={`/users/${username}`}
                                            className={classes.username}
                                            color='primary'
                                        >
                                            {username}
                                        </Typography>  
                                    </Grid>
                                    <Grid item sm={9}>
                                        <div className={classes.commentData}>
                                            <Typography variabnt="body1">{commentBody}</Typography>
                                            <Typography variant="caption" color="textSecondary" className={classes.createdAt}>
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                                <hr className={classes.invisibleSeparator} />
                            </Grid>
                            
                        </Fragment>
                    );
                })}
            </Grid>
        );
    }
}

export default withStyles(styles)(Comments);