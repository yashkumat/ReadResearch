const { db } = require('../util/admin');
const { validatePostData } = require('../util/validators');

exports.getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((post) => {
        posts.push({
          postId: post.id,
          username: post.data().username,
          title: post.data().title,
          description: post.data().description,
          url: post.data().url,
          postCategory: post.data().postCategory,
          createdAt: post.data().createdAt,
          imageUrl: post.data().imageUrl,
          likeCount: post.data().likeCount,
          commentCount: post.data().commentCount,
        });
      });
      return res.json(posts);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ general: "Something went wrong!" });
    });
};

exports.createOnePost = (req, res) => {
  const newPost = {
    username: req.user.username,
    imageUrl: req.user.imageUrl,
    title: req.body.title,
    url: req.body.url,
    postCategory: req.body.postCategory,
    description: req.body.description,
    createdAt: new Date().toISOString(),
    likeCount:0,
    commentCount:0
  };

  const { errors, valid } = validatePostData(newPost);

  if (!valid) return res.status(400).json(errors); 

  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      const resPost = newPost;
      resPost.postId = doc.id;
      res.json(newPost);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ general: "Something went wrong!" });
    });
};

exports.getPost = (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`).get()
    .then((doc)=>{
      if(!doc.exists){
        return res.status(500).json({general:"Somthing went wrong!"});
      }
      postData = doc.data();
      postData.postId = doc.id;
      return db.collection('comments').orderBy('createdAt','desc').where('postId','==', req.params.postId).get();
    })
    .then((data)=>{
      postData.comments = [];
      data.forEach((doc)=>{
        postData.comments.push(doc.data());
      })
      return res.json(postData);
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({general:"Someting went wrong!"});
    });
};

exports.commentOnPost = (req, res) => {

  if (req.body.commentBody.trim() === '') return res.status(400).json({comment:"Must not be empty!"});

  const newComment = {
    commentBody: req.body.commentBody,
    postId: req.params.postId,
    username: req.user.username,
    imageUrl: req.user.imageUrl,
    createdAt: new Date().toISOString()
  }

  db.doc(`/posts/${req.params.postId}`).get()
    .then((doc)=>{
      if (!doc.exists) return res.status(400).json({general:"Something went wrong!"});
      return doc.ref.update({commentCount: doc.data().commentCount+1});
    })
    .then(()=>{
      return db.collection('comments').add(newComment);
    })
    .then(()=>{
      return res.status(200).json({message: `Comment created!`});
    })
    .catch((err)=>{
      console.log(err);
      return res.status(500).json({general:"Something went wrong!"});
    });
};

exports.likePost = (req,res) => {
  
  const likeDocument = db.collection('likes').where('username','==',req.user.username).where('postId','==',req.params.postId).limit(1);

  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocument.get()
    .then((doc)=>{
      if(doc.exists){
        postData = doc.data();
        postData.postId = doc.id; 
        return likeDocument.get()
      }else{
        return res.status(400).json({general:"Something went worng!"});
      }
    })
    .then((data)=>{
      if(data.empty){
        return db.collection('likes').add({
          postId: req.params.postId,
          username: req.user.username
        })
        .then(()=>{
          postData.likeCount++
          return postDocument.update({likeCount:postData.likeCount})
        })
        .then(()=>{
          return res.json(postData);
        })
        .catch((err)=>{
          console.log(err);
          return res.status(500).json({general:"Something went wrong!"});
        })
      }else{
        return res.status(400).json({ like: "Post already liked!" });
      }
    })
    .catch((err)=>{
      console.log(err);
      return res.status(400).json({general:"Something went wrong!"});
    })
}

exports.unlikePost = (req,res)=>{
  const likeDocument = db.collection('likes').where('username', '==', req.user.username).where('postId', '==', req.params.postId).limit(1);

  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocument.get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get()
      } else {
        return res.status(400).json({ general: "Something went worng!" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ unlike: "Post not liked!" });
      } else {
        return db.doc(`/likes/${data.docs[0].id}`).delete()
          .then(() => {
            postData.likeCount--
            return postDocument.update({ likeCount: postData.likeCount })
          })
          .then(() => {
            return res.json(postData);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ general: "Something went wrong!" });
          })
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ general: "Something went wrong!" });
    }) 
}

exports.deletePost = (req,res) => {
  const postToBeDeleted = db.doc(`/posts/${req.params.postId}`);
  
  postToBeDeleted.get()
    .then((doc)=>{
      if(!doc.exists){
        return res.json({deleteError:"Post not exists"});
      }
      if(doc.data().username !== req.user.username){
        return res.status(400).json({ access: "Unauthorized access!" });
      }
      else{
        return postToBeDeleted.delete();
      }
    })
    .then(()=>{
      return res.status(201).json({message:"Post deleted!"})
    })
    .catch((err)=>{
      console.log(err);
      return res.status(500).json({general: "Something went worng!"});
    })
}