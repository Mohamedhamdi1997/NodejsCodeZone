
const express = require('express');
const router = express.Router();
const multer = require('multer');
const diskStorage = multer.diskStorage({
    destination: function(req,file, cb) {
        console.log("FILE", file);
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const extension = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${extension}`;
        cb(null, fileName);
    }
})

     const fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        if(imageType == 'image'){
            return cb(null, true)
        } else {
            cb(new Error('File must be an image'));
        }
     }
const upload = multer({ storage: diskStorage, fileFilter})

const userController = require('../controllers/users.controller')
const verifyToken =  require('../middelware/verifyToken');


// get all users
// register
// login

router.route('/')
             .get(verifyToken,userController.getAllUsers)

router.route('/register')
             .post(upload.single('avatar'),userController.register)

router.route('/login')
             .post(userController.login)


module.exports= router;