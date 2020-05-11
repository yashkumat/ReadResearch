import {
    SET_POSTS,
    LOADING_DATA,
    LIKE_POST,
    UNLIKE_POST,
    DELETE_POST,
    SET_ERRORS,
    POST_POST,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_POST,
    STOP_LOADING_UI,
    SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

export const getPosts = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get('/posts')
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};
export const getPost = (postId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .get(`/post/${postId}`)
        .then((res) => {
            dispatch({
                type: SET_POST,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch((err) => console.log(err));
};

export const postPost = (newPost) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/post', newPost)
        .then((res) => {
            dispatch({
                type: POST_POST,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};
// Like a scream
export const likePost = (postId) => (dispatch) => {
    axios
        .get(`/post/${postId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_POST,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
};
// Unlike a scream
export const unlikePost = (postId) => (dispatch) => {
    axios
        .get(`/post/${postId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_POST,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
};
// Submit a comment
export const submitComment = (postId, commentBody) => (dispatch) => {
    axios
        .post(`/post/${postId}/comment`, commentBody)
        .then((res) => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};
export const deletePost = (postId) => (dispatch) => {
    axios
        .delete(`/post/${postId}`)
        .then(() => {
            dispatch({ type: DELETE_POST, payload: postId });
        })
        .catch((err) => console.log(err));
};

export const getUserData = (username) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get(`/user/${username}`)
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data.posts
            });
        })
        .catch(() => {
            dispatch({
                type: SET_POSTS,
                payload: null
            });
        });
};

export const getUser = (username) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get(`/user/${username}`)
        .then((res) => {
            dispatch({
                payload: res.data
            });
        })
        .catch((err)=>console.log(err));
};

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};