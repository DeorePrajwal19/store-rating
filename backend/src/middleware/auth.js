const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';
module.exports.authenticate = (req,res,next)=>{
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error:'Missing token' });
  const token = h.split(' ')[1];
  try{
    const data = jwt.verify(token, SECRET);
    req.user = data;
    return next();
  }catch(e){
    return res.status(401).json({ error:'Invalid token' });
  }
};
module.exports.authorizeRole = (roles=[])=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)) return res.status(403).json({ error:'Forbidden' });
    next();
  }
}
