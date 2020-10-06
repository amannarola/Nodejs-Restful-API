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
    var decoded = jwt.verify(userToken, 'loginToken');
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

// Middleware for check duplicate Username //
function checkUsername(req,res,next){
  var username=req.body.uname;
  var checkexituname=userModule.findOne({username:username});
  checkexituname.exec((err,data)=>{
      if(err) throw err;
      if(data){
        return res.render('signup', { title: 'Password Management System', msg:'Username Already Exists' });
      }
      next();
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var loginUser = req.session.userName;
  if(req.session.userName)
  {
    res.redirect('./dashboard');
  }
  else{
    res.render('index', { title: 'Password Management System',msg:'' });
  }  
});

router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  
  checkUser.exec((err,data)=>{
      if(err) throw err;
      if(data){
        
        var getUserID=data._id;
        var getPassword=data.password;

        if(bcrypt.compareSync(password,getPassword)){
          var token = jwt.sign({ userID: getUserID }, 'loginToken');
          localStorage.setItem('userToken', token);
          localStorage.setItem('loginUser', username);
          req.session.userName=username;
          res.redirect('/dashboard');
      
        }else{
          res.render('index', { title: 'Password Management System',msg:"Invalid Password" });
        }
      }
      else{
        res.render('index', { title: 'Password Management System',msg:"Invalid Username" });
      }
  });
  
});



router.get('/signup', function(req, res, next) {
  var loginUser = req.session.userName;
  if(req.session.userName)
  {
    res.redirect('./dashboard');
  }
  else{
    res.render('signup', { title: 'Password Management System', msg:'' });
  } 
});

router.post('/signup',checkEmail,checkUsername, function(req, res, next) {

  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;

  if(password !=confpassword){
    res.render('signup', { title: 'Password Management System', msg:'Password not matched' });
  }
  else{
      password = bcrypt.hashSync(req.body.password,10);

      var userDetails = new userModule({
          username:username,
          email:email,
          password:password,
      });

      userDetails.save((err,doc)=>{
          if(err) throw err;
          res.render('signup', { title: 'Password Management System', msg:'User Register Successfully' });
      });
  }
});



/*
router.get('/view-all-password', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
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

router.get('/view-all-password/:page', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
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
*/

router.get('/logout', function(req, res, next) {

  req.session.destroy(function(err){
      if(err){
        res.redirect('/');
      }
  });

  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;
