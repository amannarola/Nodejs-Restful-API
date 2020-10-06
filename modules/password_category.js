const mongoose = require('mongoose');
require('dotenv').config()
var dburl=process.env.MONGO_DB_URL;
mongoose.connect(dburl, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
var conn=mongoose.Collection;

var passcatSchema=new mongoose.Schema({
    password_category: {type:String,
        required: true,
        index: {
            unique: true,
        }},
        
    date: {
        type: Date,
        default: Date.now 
        }
});

var passcatModel = mongoose.model('password_categories',passcatSchema);
module.exports=passcatModel;