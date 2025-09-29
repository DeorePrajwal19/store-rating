const express = require('express');
const router = express.Router();
const { Store, Rating, User, sequelize } = require('../models');
const { authorizeRole } = require('../middleware/auth');
// List all stores (any authenticated user)
router.get('/', async (req,res)=>{
  try{
    const stores = await Store.findAll();
    const out = [];
    for(const s of stores){
      const ratings = await s.getRatings();
      const avg = ratings.length? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length):0;
      let userRating = null;
      if(req.user){
        const r = await Rating.findOne({ where:{ storeId:s.id, userId:req.user.id }});
        if(r) userRating = r.score;
      }
      out.push({ id:s.id, name:s.name, address:s.address, rating: Number(avg.toFixed(2)), userRating });
    }
    res.json(out);
  }catch(e){ res.status(500).json({ error:e.message }); }
});
// Submit or update rating (normal users)
router.post('/:id/rate', async (req,res)=>{
  try{
    const storeId = req.params.id;
    const { score } = req.body;
    if(!score || score<1 || score>5) return res.status(400).json({ error:'Score must be 1-5' });
    const existing = await Rating.findOne({ where:{ storeId, userId:req.user.id }});
    if(existing){
      existing.score = score;
      await existing.save();
      return res.json(existing);
    }else{
      const r = await Rating.create({ score, storeId, userId:req.user.id });
      return res.json(r);
    }
  }catch(e){ res.status(500).json({ error:e.message }); }
});
// Owner dashboard: list users who rated their stores
router.get('/owner/dashboard', authorizeRole(['owner']), async (req,res)=>{
  try{
    const stores = await Store.findAll({ where:{ ownerId: req.user.id }});
    const out = [];
    for(const s of stores){
      const ratings = await s.getRatings({ include:[{ model: User, attributes:['id','name','email'] }]});
      const avg = ratings.length? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length):0;
      out.push({ store:{ id:s.id, name:s.name }, average: Number(avg.toFixed(2)), ratings: ratings.map(r=>({ user:r.User, score:r.score })) });
    }
    res.json(out);
  }catch(e){ res.status(500).json({ error:e.message }); }
});
module.exports = router;
