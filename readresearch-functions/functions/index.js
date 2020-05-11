const functions = require('firebase-functions');

const express = require('express');
const app = express();

const FBAuth = require('./util/FBAuth');

const cors = require('cors');
app.use(cors());

const {db} = require('./util/admin');

const { getAllPosts, createOnePost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require('./handlers/posts');
const { signup, signin, uploadImage, addUserDetails, getAuthenticatedUser, markNotificationsRead, getUserDetails } = require('./handlers/users');

app.get('/posts', getAllPosts);
app.post('/post', FBAuth, createOnePost);
app.get('/post/:postId', getPost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.delete('/post/:postId', FBAuth, deletePost);

app.post('/signup', signup)
app.post('/signin', signin)
app.post('/user/image', FBAuth, uploadImage);
app.post('/user/details', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.post('/notifications', FBAuth, markNotificationsRead);
app.get('/user/:username', getUserDetails);

exports.api = functions.https.onRequest(app);

exports.createLikeNotification = functions.firestore.document('likes/{id}')
    .onCreate((snapshot)=>{
        return db.doc(`/posts/${snapshot.data().postId}`).get()
            .then((doc)=>{
                if(doc.exists && doc.data().username !== snapshot.data().username){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().username,
                        sender: snapshot.data().username,
                        type: 'like',
                        read: false,
                        postId: doc.id
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
                return;
            })
    });

exports.createCommentNotification = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/posts/${snapshot.data().postId}`).get()
            .then((doc) => {
                if (doc.exists && doc.data().username !== snapshot.data().username) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().username,
                        sender: snapshot.data().username,
                        type: 'comment',
                        read: false,
                        postId: doc.id
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                return;
            })
    });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot)=>{
        return db.doc(`/notifications/${snapshot.id}`).delete()
            .catch((err)=>{
                console.log(err);
                return;
            })
    });

exports.onUserImageChange = functions.firestore.document('/users/{userId}')
    .onUpdate((change)=>{
        if(change.after.data().imageUrl !== change.before.data().imageUrl){
            const batch = db.batch();
            return db.collection('posts').where('username','==',change.before.data().username).get()
                        .then((data)=>{
                            data.forEach((doc)=>{
                                const post = db.doc(`/posts/${doc.id}`);
                                batch.update(post, { imageUrl: change.after.data().imageUrl});
                            });
                            return db.collection('comments').where('username', '==', change.before.data().username).get()
                        })
                        .then((data) => {
                            data.forEach((doc) => {
                                const comment = db.doc(`/comments/${doc.id}`);
                                batch.update(comment, { imageUrl: change.after.data().imageUrl });
                            });
                            return batch.commit();
                        })
                        .catch((err)=>{
                            console.log(err);
                            return;
                        })
        }else{
            return true;
        }
    });

exports.onPostDelete = functions.firestore.document('/posts/{postId}')
    .onDelete((snapshot, context)=>{
        const postId = context.params.postId;
        const batch = db.batch();
        return db.collection('comments').where('postId','==',postId).get()
            .then((data)=>{
                data.forEach((doc)=>{
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('postId','==',postId).get()
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('postId', '==', postId).get()
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch((err)=>{
                console.log(err);
                return;
            });
    });