const { admin, db } = require('../util/admin');

const firebaseConfig = require('../util/firebaseConfig');

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateSigninData, reduceUserDetails } = require('../util/validators');

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };

  const noImage = 'no-image.png'

  let token, userId;
  
  const { errors, valid } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ username: "username taken!" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        userId: userId,
        email: newUser.email,
        username: newUser.username,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`,
        createdAt: new Date().toISOString(),
      };

      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ general: "Something went wrong!" });
    });
};

exports.signin = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const {errors, valid} = validateSigninData(user);

  if(!valid) return res.status(400).json(errors); 

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ general: "Something went wrong!" });
    });
};

exports.uploadImage = (req,res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({headers: req.headers});

  let imageName;
  let imageToBeUploaded = {};
  busboy.on('file', (feildname, file, filename, encoding, mimetype)=>{

    if(mimetype!=='image/png' && mimetype !== 'image/jpg' && mimetype !== 'image/jpeg'){
      return res.json({ fileError: "Worng file type!"});
    }
    const imageExtention = filename.split('.')[filename.split('.').length-1];
    imageName = `${Math.round(Math.random()*1000000)}.${imageExtention}`;
    const filepath = path.join(os.tmpdir(),imageName);
    imageToBeUploaded = { filepath, mimetype};
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on('finish',()=>{
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable:false,
      metadata:{
        metadata:{
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(()=>{
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageName}?alt=media`;
      return db.doc(`/users/${req.user.username}`).update({imageUrl});
    })
    .then(()=>{
      return res.status(201).json({message:"Image uploaded successfully!"});
    })
    .catch((err)=>{
      console.log(err);
      return res.status(500).json({ general:"Something went wrong!"});
    })
  });

  busboy.end(req.rawBody);
}

exports.addUserDetails = (req,res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.username}`).update(userDetails)
    .then(()=>{
      return res.status(201).json({message:"Details added!"});
    })
    .catch((err)=>{
      console.log(err);
      return res.json(err);
    });
};

exports.getAuthenticatedUser = (req,res) => {
  let resData = {};
  db.doc(`/users/${req.user.username}`).get()
  .then((doc)=>{
    if(doc.exists){
      resData.userData = doc.data();
      return db.collection('likes').where('username','==',req.user.username).get();
    }
  })
  .then((data)=>{
    resData.likes = [];
    data.forEach((doc)=>{
      resData.likes.push(doc.data());
    });
    return db.collection('notifications').where('recipient','==',req.user.username).orderBy('createdAt','desc').get()
  })
  .then((data)=>{
    resData.notifications = [];
    data.forEach((doc)=>{
      resData.notifications.push({
        createdAt: doc.data().createdAt,
        recipient: doc.data().recipient,
        sender: doc.data().sender,
        read: doc.data().read,
        type: doc.data().type,
        postId: doc.data().postId,
        notificationId: doc.id,
      })
    });
    return res.json(resData);
  })
  .catch((err)=>{
    console.log(err);
    return res.status(500).json({ general:"Something went wrong!"});
  })
}

exports.getUserDetails = (req,res) => {
  let resData = {};
  db.doc(`/users/${req.params.username}`).get()
    .then((doc)=>{
      if(doc.exists){
        resData.userDeatils = doc.data()
        return db.collection('posts').where('username','==',req.params.username).orderBy('createdAt','desc').get()
      }else{
        return res.status(400).json({ general:"User not found!"})
      }
    })
    .then((data)=>{
      resData.posts = [];
      data.forEach((doc)=>{
        resData.posts.push({
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
          title: doc.data().title,
          url: doc.data().url,
          postCategory: doc.data().postCategory,
          username: doc.data().username,
          postId: doc.id,
        })
      })
      return res.json(resData);
    })
    .catch((err)=>{
      console.log(err);
      return res.status(500).json({ general: "Something went wrong!"});
    })
}

exports.markNotificationsRead = (req,res) => {
  let batch = db.batch();
  req.body.forEach((notificationId)=>{
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read:true});
  })
  batch.commit()
    .then(()=>{
      return res.status(201).json({message:"Marked all read!"});
    })
    .catch((err)=>{
      console.log(err);
      return res.status(500).json({ general:"Something went wrong!"});
    })
}