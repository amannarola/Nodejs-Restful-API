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
    var loginUser = req.session.userName;
  
    getpasscat.exec(function(err,data){
        if(err) throw err;
        res.render('add-new-password', { title: 'Password Management System',loginUser:loginUser,records:data,success:'' });
    });
  });
  
router.post('/', checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
  
    var pass_cat=req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details=req.body.pass_details;
    var password_details=new passModule({
        password_category:pass_cat,
        project_name:project_name,
        password_detail:pass_details
    });
  
      password_details.save(function(err,doc){
          getpasscat.exec(function(err,data){
        if(err) throw err;
            res.render('add-new-password', { title: 'Password Management System',loginUser:loginUser,records:data,success:"Password Details Inserted Successfully" });
        });
    });
  });

module.exports = router;