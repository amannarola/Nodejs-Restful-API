var express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();
var userModel = require('../modules/user');


router.post("/login",function(req,res,next){

    var username = req.body.username;
    userModel.find({username:username})
    .exec()
    .then(user=>{
        if(user.length<1){
            res.status(404).json({
                message:"Auth Failed",
            });
        }else{
            bcrypt.compare(req.body.password,user[0].password, function(err, result) {
                if(err){
                    res.status(404).json({
                        message:"Auth Failed",
                    });
                }
                if(result){

                var token=jwt.sign(
                        {
                            username:user[0].username,
                            userid:user[0]._id
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn:"24h"
                        }
                        );

                    res.status(200).json({
                        message:"User Found",
                        token:token
                    });
                }else{
                    res.status(404).json({
                        message:"Auth Failed",
                    });
                }
            });
        }
    })
    .catch(err=>{
        res.json({
            error:err
        });
    });
});


router.post("/signup",function(req,res,next){

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmpassword = req.body.confirmpassword;

    if(password!==confirmpassword){
        res.json({
            message:"Password Not Matched!",
        });
    }else{

        bcrypt.hash(password,10, function(err, hash) {
            if(err){
                return res.json({
                    message:"Something wrong try later",
                    error:err
                });
            }else{
                //console.log(hash);
                var userDetails = new userModel({
                    _id:mongoose.Types.ObjectId(),
                    username:username,
                    email:email,
                    password:hash,
                });
            
               userDetails.save()
               .then(doc=>{
                    res.status(201).json({
                    message:"User Registrated Successfully",
                    results:doc
                });
               })
               .catch(err=>{
                   res.json(err);
               });
            }
        });
    }
});

module.exports=router;