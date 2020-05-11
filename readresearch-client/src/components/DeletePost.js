import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';

// MUI Stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deletePost } from '../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'relative',
        left: '90%',
        top: '5%',
        color: "#c23616"
    },
    warning: {
        color: "#c23616"
    }
};

class DeletePost extends Component {
    state = {
        open: false
    };
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    deleteScream = () => {
        this.props.deletePost(this.props.postId);
        this.setState({ open: false });
    };
    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton
                    tip="Delete Post"
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton}
                    color="warning"
                >
                    <DeleteOutline />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this post ?
          </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
            </Button>
                        <Button onClick={this.deleteScream} className={classes.warning}>
                            Delete
            </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default connect(
    null,
    { deletePost }
)(withStyles(styles)(DeletePost));