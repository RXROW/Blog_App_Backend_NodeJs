const jwt = require('jsonwebtoken');
// Vrify Token 
function verifyToken(req,res,next){
    const authToken=req.headers.authorization ;
    if(authToken){
        const Token = authToken.split(" ")[1]
        try {
            const decodedPayload=jwt.verify(Token,process.env.JWT_SECRET_KEY)
            req.user=decodedPayload;
            next();
        } catch (error) {
            return res.status(401).json({massage:"invald token ! "})
        }

    }else{
        return res.status(401).json({massage:" No Token Provided ! "})
    }

    

}

// Virefy Token And Admin
function  virefyTokenAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({massage:"Not Allowed , onlay Admin !"})
        }
    })

}

// Virefy Token And Onlay User Himself
function  virefyTokenOnlayUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id){
            next();
        }else{
            return res.status(403).json({massage:"Not Allowed , onlay User himself !"})
        }
    })

}

// Virefy Token And Authorization
function  virefyTokenAndAuthorization(req,res,next){
  verifyToken(req,res,()=>{
      if(req.user.id===req.params.id || req.user.isAdmin){
          next();
      }else{
          return res.status(403).json({massage:"Not Allowed , onlay User himself  or Admin !"})
      }
  })

}




module.exports={
verifyToken,
virefyTokenAdmin,
virefyTokenOnlayUser,
virefyTokenAndAuthorization
}