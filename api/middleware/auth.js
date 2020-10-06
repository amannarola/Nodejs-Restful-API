var jwt = require('jsonwebtoken');
module.exports=(req,res,next)=>{

    try{
        var token=req.headers.authorization.split(" ")[1];
        var decode=jwt.verify(token,process.env.SECRET_KEY);
        req.userData=decode;
        //console.log(token);
        next();
    }catch(error){
        res.status(401).json({
            error:"Invalid Token"
        });
    }
}