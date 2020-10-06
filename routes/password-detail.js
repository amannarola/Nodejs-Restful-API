var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passcatModule = require('../modules/password_category');
var passModule = require('../modules/add_password');
var getpasscat = passcatModule.find({});
var getpass = passModule.find({});
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');


var jwt = require('jsonwebtoken');
if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next){
  var userToken = localStorage.getItem('userToken');
  try {
    if(req.session.userName){
    var decoded = jwt.verify(userToken, 'loginToken');
    }else{
      res.redirect('/');
    }
  } catch(err) {
    res.redirect('/');
  }
  next();
};


// Middleware for check duplicate email //
function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
      if(err) throw err;
      if(data){
        return res.render('signup', { title: 'Password Management System', msg:'Email Already Exists' });
      }
      next();
  });
}


router.get('/', checkLoginUser, function(req, res, next) {
    res.redirect('dashboard');
  });
  
router.get('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var id=req.params.id;
    var getpassdetails=passModule.findById({_id:id});
    getpassdetails.exec(function(err,data){
        if(err) throw err;
        getpasscat.exec(function(err,data1){
        res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data1,record:data,success:'' });
        });
      });
  });
  
router.post('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var id=req.params.id;
    var pass_cat=req.body.pass_cat;
    var project_name=req.body.project_name;
    var pass_details=req.body.pass_details;
  
    passModule.findByIdAndUpdate(id,{password_category:pass_cat,project_name:project_name,password_detail:pass_details}).exec(function(err){
      if(err) throw err;
    var getpassdetails=passModule.findById({_id:id});
    getpassdetails.exec(function(err,data){
        if(err) throw err;
        getpasscat.exec(function(err,data1){
        res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data1,record:data,success:'Password Updated Successfully' });
          });
        });
      });
  });
  
router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var id=req.params.id;
    var passdelete=passModule.findByIdAndDelete(id);
  
    passdelete.exec(function(err){
      if(err) throw err;
    res.redirect('/view-all-password/');
    });
  });
  

module.exports = router;