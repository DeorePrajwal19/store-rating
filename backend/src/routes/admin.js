const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Store, Rating, sequelize } = require('../models');
const { authorizeRole } = require('../middleware/auth');
// Only admins
router.use(authorizeRole(['admin']));
// Add user (admin can add admin, normal user, owner)
router.post('/users', async (req,res)=>{
  try{
    const { name, email, address, password, role } = req.body;
    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({ name, email, address, password:hashed, role });
    res.json({ id:user.id, email:user.email, role:user.role });
  }catch(e){ res.status(500).json({ error:e.message }); }
});
// Add store
router.post('/stores', async (req,res)=>{
  try{
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name,email,address,ownerId });
    res.json(store);
  }catch(e){ res.status(500).json({ error:e.message }); }
});
// Dashboard counts
router.get('/dashboard', async (req,res)=>{
  try{
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  }catch(e){ res.status(500).json({ error:e.message }); }
});
// List users with filters (name,email,address,role)
router.get('/users', async (req,res)=>{
  try{
    const { q, role, sortBy='name', order='ASC', limit=50, offset=0 } = req.query;
    const where = {};
    if(role) where.role = role;
    const Op = sequelize.Op;
    if(q){
      where[Op.or] = [
        { name: { [Op.iLike]:`%${q}%` } },
        { email: { [Op.iLike]:`%${q}%` } },
        { address: { [Op.iLike]:`%${q}%` } },
      ];
    }
    const users = await User.findAll({ where, order:[[sortBy, order]], limit: +limit, offset:+offset, attributes:['id','name','email','address','role']});
    res.json(users);
  }catch(e){ res.status(500).json({ error:e.message }); }
});
// List stores with rating
router.get('/stores', async (req,res)=>{
  try{
    const { q, sortBy='name', order='ASC', limit=50, offset=0 } = req.query;
    const Op = sequelize.Op;
    const where = {};
    if(q) where[Op.or]=[
      { name:{ [Op.iLike]: `%${q}%` } },
      { address:{ [Op.iLike]: `%${q}%` } }
    ];
    const stores = await Store.findAll({ where, order:[[sortBy,order]], limit:+limit, offset:+offset });
    // attach ratings
    const result = [];
    for(const s of stores){
      const avg = await s.getRatings({ attributes:[[sequelize.fn('avg', sequelize.col('score')), 'avg']] });
      const ratings = await s.getRatings();
      const avgVal = ratings.length? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length) : 0;
      result.push({ id:s.id, name:s.name, email:s.email, address:s.address, rating: Number(avgVal.toFixed(2)) });
    }
    res.json(result);
  }catch(e){ res.status(500).json({ error:e.message }); }
});
module.exports = router;
