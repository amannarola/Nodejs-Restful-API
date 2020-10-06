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

router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    getpasscat.exec(function(err,data){
      if(err) throw err;
    res.render('password_category', { title: 'Password Management System' ,loginUser:loginUser,records:data});
    });
  });
  
router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var passcat_id = req.params.id;
    var passdelete=passcatModule.findByIdAndDelete(passcat_id);
  
    passdelete.exec(function(err){
      if(err) throw err;
    res.redirect('/passwordCategory');
    });
  });
  
router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var passcat_id = req.params.id;
    var getpasscategory=passcatModule.findById(passcat_id);
  
    getpasscategory.exec(function(err,data){
      if(err) throw err;
      res.render('edit_pass_category', { title: 'Password Management System' ,loginUser:loginUser,errors:'',success:'',records:data,id:passcat_id});
    });
  });
  
router.post('/edit/',checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var passcat_id = req.body.id;
    var passwordCategory = req.body.passwordCategory;
    var update_passcat = passcatModule.findByIdAndUpdate(passcat_id,{password_category:passwordCategory});
  
    update_passcat.exec(function(err,doc){
      if(err) throw err;
      res.redirect('/passwordCategory');
    });
  });

module.exports = router;