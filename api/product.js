var express = require('express');
const productscontroller = require('./controller/products');

var checkAuth=require('./middleware/auth');

// for upload image
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

var upload = multer({
    storage:storage,
    limit:{
        fileSize: 1024*1024 +5
    },
    fileFilter:fileFilter
});

const mongoose = require('mongoose');
var router = express.Router();
var productModel = require('../modules/products');

// image path
// limit: 5mb
// filter: png,jpeg,jpg

router.get("/getAllProducts",checkAuth,productscontroller.getAllProducts);

router.post("/add",upload.single('productImage'),checkAuth,productscontroller.addProduct);

module.exports=router;
