import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';

// Redux stuff
import { connect } from 'react-redux';
import { postPost, clearErrors } from '../redux/actions/dataActions';

const categories = [
    {
        value: 'Social Science',
        label: 'Social Science',
    },
    {
        value: 'Physics',
        label: 'Physics',
    },
    {
        value: 'Mathematics',
        label: 'Mathematics',
    },
    {
        value: 'Chemistry',
        label: 'Chemistry',
    },
    {
        value: 'Biology',
        label: 'Biology',
    },
    {
        value: 'Litrature',
        label: 'Litrature',
    },
    {
        value: 'Politics',
        label: 'Politics',
    },
];

const styles = {
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    },
    textField:{
        margin:"10px",
      
    }
};

class PostPost extends Component {
    state = {
        open: false,
        title: '',
        description:'',
        url:'',
        postCategory:'',
        errors: {}
    };
    
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                title: '', description: '',
                url: '', open: false, errors: {} });
        }
    }
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open: false, errors: {} });
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postPost({ title: this.state.title, description: this.state.description, url: this.state.url, postCategory: this.state.postCategory });
    };
    
    
    render() {
        const { errors } = this.state;
        const {
            classes,
            UI: { loading }
        } = this.props;

        
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Write a Post!">
                    <AddIcon color="secondary"/>
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
                    <DialogTitle>Create a new Post</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="title"
                                type="text"
                                label="Title"
                                error={errors.title ? true : false}
                                helperText={errors.title}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="description"
                                type="text"
                                label="Description"
                                multiline
                                rows={2}
                                error={errors.description ? true : false}
                                helperText={errors.description}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                id="postCategory"
                                name="postCategory"
                                select
                                label="Category"
                                className={classes.textField}
                                fullWidth
                                onChange={this.handleChange}
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                name="url"
                                type="text"
                                label="Orignal article Url"
                                error={errors.url ? true : false}
                                helperText={errors.url}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                className={classes.submitButton}
                                disabled={loading}
                            >
                                Submit
                {loading && (
                                    <CircularProgress
                                        size={30}
                                        className={classes.progressSpinner}
                                    />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(
    mapStateToProps,
    { postPost, clearErrors }
)(withStyles(styles)(PostPost));