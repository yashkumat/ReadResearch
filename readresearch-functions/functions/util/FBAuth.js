const { admin, db } = require("../util/admin");

module.exports = (req,res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else{
        console.log("No token found");
        return res.json({accessError:"unauthorized access!"})
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken)=>{
            req.user = decodedToken;
            return db.collection('users')
                    .where('userId','==',req.user.uid)
                    .limit(1)
                    .get()
        })
        .then((data)=>{
            req.user.username = data.docs[0].data().username;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch((err)=>{
            console.log(err);
            return res.json({generalError:"Something went worng!"});
        })
};