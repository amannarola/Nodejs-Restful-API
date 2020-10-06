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
      res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,errors:'',success:'' });
  });
  
router.post('/', checkLoginUser, [check('passwordCategory','Enter Password Category Name').isLength({ min: 1 })],function(req, res, next) {
    var loginUser = req.session.userName;
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      res.render('addNewCategory', { title: 'Password Management System', loginUser:loginUser,errors:errors.mapped(),success:'' });
    }
    else{
      var passcatname=req.body.passwordCategory;
      var passcatDetails=new passcatModule({
          password_category: passcatname
      });
      passcatDetails.save(function(err,doc){
        if(err) throw err;
  
        res.render('addNewCategory', { title: 'Password Management System', loginUser:loginUser,errors:'',success:'Password Category Inserted Successfully' });
      });
    }
  });

module.exports = router;