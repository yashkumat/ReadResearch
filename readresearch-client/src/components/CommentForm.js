import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// Redux stuff
import { connect } from 'react-redux';
import { submitComment } from '../redux/actions/dataActions';

const styles = {
    button:{
        margin:'10px',
        postition:"relative",
        left:"85%"
    }
};

class CommentForm extends Component {
    state = {
        commentBody: '',
        errors: {}
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ commentBody: '' });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.postId, { commentBody: this.state.commentBody });
    };

    render() {
        const { classes, authenticated } = this.props;
        const errors = this.state.errors;

        const commentFormMarkup = authenticated ? (

            <form onSubmit={this.handleSubmit}>
                <TextField
                    name="commentBody"
                    type="text"
                    label="You Comment Here..."
                    error={errors.comment ? true : false}
                    helperText={errors.comment}
                    value={this.state.commentBody}
                    onChange={this.handleChange}
                    fullWidth
                    className={classes.textField}
                    color="primary"
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="secondary"
                    className={classes.button}
                >
                    Submit
                        </Button>
            </form>

        ) : null;
        return commentFormMarkup;
    }
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

export default connect(
    mapStateToProps,
    { submitComment }
)(withStyles(styles)(CommentForm));