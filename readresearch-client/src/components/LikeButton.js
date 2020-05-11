import React, { Component } from 'react';
import MyButton from '../util/MyButton';
import { Link } from 'react-router-dom';

// Icons
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
// REdux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../redux/actions/dataActions';

export class LikeButton extends Component {
    likedPost = () => {
        if (
            this.props.user.likes &&
            this.props.user.likes.find(
                (like) => like.postId === this.props.postId
            )
        )
            return true;
        else return false;
    };
    likePost = () => {
        this.props.likePost(this.props.postId);
    };
    unlikePost = () => {
        this.props.unlikePost(this.props.postId);
    };
    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <MyButton tip="Recommend">
                <Link to="/login">
                    <StarBorder />
                </Link>
            </MyButton>
        ) : (
                this.likedPost() ? (
                    <MyButton tip="Undo recommend" onClick={this.unlikePost}>
                        <Star color="primary" />
                    </MyButton>
                ) : 
                (
                    <MyButton tip="Recommend" onClick={this.likePost}>
                        <StarBorder />
                    </MyButton>
                )
            )
        return likeButton;
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
)(LikeButton);