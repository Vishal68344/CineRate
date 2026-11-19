import {Router} from 'express';
import {tmdb} from '../services/tmdb.js';
import {query} from '../db.js';
import {wrap} from '../middleware/errorHandler.js';
const router=Router();
const page=req=>Math.min(500,Math.max(1,Number.parseInt(req.query.page,10)||1));
router.get('/trending',wrap(async(req,res)=>res.json(await tmdb('/trending/movie/week'))));
router.get('/popular',wrap(async(req,res)=>res.json(await tmdb('/movie/popular',{page:page(req)}))));
router.get('/search',wrap(async(req,res)=>{
 const term=String(req.query.query||'').trim();
 if(!term||term.length>100) return res.status(400).json({error:'Search query must be 1–100 characters'});
 res.json(await tmdb('/search/movie',{query:term,page:page(req)}));
}));
router.get('/:id/reviews',wrap(async(req,res)=>{
 const id=Number(req.params.id);
 if(!Number.isSafeInteger(id)||id<=0) return res.status(400).json({error:'Invalid movie ID'});
 const {rows}=await query('SELECT r.id,r.user_id,r.movie_id,r.rating,r.comment,r.created_at,r.updated_at,u.name AS author FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.movie_id=$1 ORDER BY r.created_at DESC',[id]);
 const average=rows.length?Number((rows.reduce((a,r)=>a+r.rating,0)/rows.length).toFixed(1)):null;
 res.json({reviews:rows,average,count:rows.length});
}));
router.get('/:id',wrap(async(req,res)=>{
 const id=Number(req.params.id);
 if(!Number.isSafeInteger(id)||id<=0) return res.status(400).json({error:'Invalid movie ID'});
 res.json(await tmdb('/movie/'+id));
}));
export default router;
