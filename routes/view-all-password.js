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
  
    var options = {
      offset:   1,
      limit:    2
    };
  
        passModule.paginate({},options).then(function(result){
  
          res.render('view-all-password', { title: 'Password Management System',
          loginUser:loginUser, 
          records: result.docs,
          current: result.offset,
          pages: Math.ceil(result.total / result.limit)
        });
      });
    });
  
router.get('/:page', checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var perPage = 2;
    var page = req.params.page || 1;
  
    getpass.skip((perPage * page) - perPage)
          .limit(perPage).exec(function(err,data){
        if(err) throw err;
  
        passModule.countDocuments({}).exec((err,count)=>{  
            res.render('view-all-password', { title: 'Password Management System',
            loginUser:loginUser, 
            records: data,
            current: page,
            pages: Math.ceil(count / perPage)
          });
      });
    });
  });

module.exports = router;