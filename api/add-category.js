var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var passcatModule = require('../modules/password_category');
var passModule = require('../modules/add_password');
var getpasscat = passcatModule.find({},{'password_category':1});
var getpass = passModule.find({});

const categorycontroller = require('./controller/category');

var checkAuth=require('./middleware/auth');

// get all category route

router.get("/getCategory",checkAuth,categorycontroller.getCategory);

// add new category route

router.post("/add-Category",checkAuth,categorycontroller.addCategory);

// add or update category route

router.put("/add-update-category/:id",checkAuth,categorycontroller.addUpdateCategory);

// update record route

router.patch("/update-category",checkAuth,categorycontroller.updateCategory);

router.delete("/delete-category",checkAuth,categorycontroller.deleteCategory);

router.post("/add-new-password/",checkAuth,function(req,res,next){
    
    var passCategory = req.body.pass_cat;
    var projectName = req.body.project_name;
    var passwordDetails = req.body.password_detail;

    var passDetails=new passModule({
        _id:mongoose.Types.ObjectId(),
        password_category:passCategory,
        project_name:projectName,
        password_detail:passwordDetails
    });
   
   passDetails.save()
   .then(doc=>{
        res.status(201).json({
        message:"Password Inserted Successfully",
        results:doc
    });
   })
   .catch(err=>{
       res.json(err);
   });
});

router.get("/getAllpassword",checkAuth,function(req,res,next){
 
     getpass
     .find()
     .select("_id password_category project_name password_detail")
     .populate("password_category","password_category")
     .exec()
     .then(data=>{
         res.status(200).json({
             message:"Success",
             results:data
         });
     })
     .catch(err=>{
         res.json(err);
     });
});

router.get("/getpasswordById/:id",checkAuth,function(req,res,next){
 
    var id = req.params.id;
    passModule.findById(id)
    .select("_id password_category project_name password_detail")
    .populate("password_category","password_category")
    .exec()
    .then(data=>{
        res.status(200).json({
            message:"Success",
            results:data
        });
    })
    .catch(err=>{
        res.json(err);
    });
});

router.delete("/delete-password",checkAuth,function(req,res,next){
    
    var pass_id=req.body.pass_id;
   
    passModule.findByIdAndRemove(pass_id)
    .then(doc=>{
        res.status(201).json({
            message:"Password Deleted Successfully",
            results:doc
        });
    })
    .catch(err=>{
        res.json(err);
    });
});

module.exports=router;