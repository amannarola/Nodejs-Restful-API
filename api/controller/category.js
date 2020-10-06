const mongoose = require('mongoose');
var passcatModule = require('../../modules/password_category');
var passModule = require('../../modules/add_password');
var getpasscat = passcatModule.find({},{'password_category':1});
var getpass = passModule.find({});

exports.getCategory=function(req,res,next){
    /* getpasscat.exec(function(err,data){
         if(err) throw err;
     //res.send(data);
 
         res.status(200).json({
             message:"Success",
             results:data
         });
     }); */
 
     getpasscat.exec()
     .then(data=>{
         res.status(200).json({
             message:"Success",
             results:data
         });
     })
     .catch(err=>{
         res.json(err);
     });
 }

 exports.addCategory=function(req,res,next){
    
    var passCategory = req.body.pass_cat;
    var passCatDetails = new passcatModule({password_category:passCategory});
   /* passCatDetails.save(function(err,doc){
        if(err) throw err;
        //res.send("Success .. Nodejs Restful API POST Methos working");
        res.status(201).json({
            message:"Category Inserted Successfully",
            results:doc
        });
    }); 
    */
   passCatDetails.save()
   .then(doc=>{
        res.status(201).json({
        message:"Category Inserted Successfully",
        results:doc
    });
   })
   .catch(err=>{
       res.json(err);
   });
}

exports.addUpdateCategory=function(req,res,next){
    
    var id = req.params.id;
    var passCategory = req.body.pass_cat;
    passcatModule.findById(id,function(err,data){

        data.password_category=passCategory?passCategory:data.password_category;
      /*  data.save(function(err,doc){
            if(err) throw err;
            //res.send("Data Updated successfully Nodejs Restful API PUT Methos working");
            res.status(201).json({
                message:"Category Updated Successfully",
                results:doc
            });
        }); */
        data.save()
        .then(doc=>{
            res.status(201).json({
                message:"Category Updated Successfully",
                results:doc
            });
        })
        .catch(err=>{
            res.json(err);
        });
    });
}

exports.updateCategory=function(req,res,next){
    
    var id = req.body._id;
    var passCategory = req.body.pass_cat;
    passcatModule.findById(id,function(err,data){

        data.password_category=passCategory?passCategory:data.password_category;
      /* data.save(function(err){
            if(err) throw err;
            res.send("Data Updated successfully Nodejs Restful API PATCH Methos working");
        }); */
        data.save()
        .then(doc=>{
            res.status(201).json({
                message:"Category Updated Successfully",
                results:doc
            });
        })
        .catch(err=>{
            res.json(err);
        });
    });
}

exports.deleteCategory=function(req,res,next){
    
    var cat_id=req.body.cat_id;
   /* passcatModule.findByIdAndRemove(cat_id,function(err){
        if(err) throw err;
        res.send("Data Deleted successfully Nodejs Restful API PATCH Methos working");
    }); */
    passcatModule.findByIdAndRemove(cat_id)
    .then(doc=>{
        res.status(201).json({
            message:"Category Deleted Successfully",
            results:doc
        });
    })
    .catch(err=>{
        res.json(err);
    });
}