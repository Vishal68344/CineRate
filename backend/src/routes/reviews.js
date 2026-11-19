import {Router} from 'express';
import {query} from '../db.js';
import {auth} from '../middleware/auth.js';
import {wrap} from '../middleware/errorHandler.js';
const router=Router();
router.use(auth);
const valid=(rating,comment)=>Number.isInteger(rating)&&rating>=1&&rating<=5&&typeof comment==='string'&&comment.trim().length>=1&&comment.trim().length<=2000;
router.post('/movies/:id/reviews',wrap(async(req,res)=>{
 const movieId=Number(req.params.id);
 if(!Number.isSafeInteger(movieId)||movieId<=0||!valid(req.body.rating,req.body.comment)) return res.status(400).json({error:'Movie ID, rating (1–5) and review (1–2000 characters) required'});
 const {rows}=await query('INSERT INTO reviews(user_id,movie_id,rating,comment) VALUES($1,$2,$3,$4) RETURNING *',[req.user.id,movieId,req.body.rating,req.body.comment.trim()]);
 res.status(201).json({review:rows[0]});
}));
router.put('/reviews/:id',wrap(async(req,res)=>{
 const id=Number(req.params.id);
 if(!Number.isSafeInteger(id)||id<=0||!valid(req.body.rating,req.body.comment)) return res.status(400).json({error:'Valid rating and review required'});
 const {rows}=await query('UPDATE reviews SET rating=$1,comment=$2,updated_at=NOW() WHERE id=$3 AND user_id=$4 RETURNING *',[req.body.rating,req.body.comment.trim(),id,req.user.id]);
 if(!rows[0]) return res.status(404).json({error:'Review not found or not owned by you'});
 res.json({review:rows[0]});
}));
router.delete('/reviews/:id',wrap(async(req,res)=>{
 const id=Number(req.params.id);
 if(!Number.isSafeInteger(id)||id<=0) return res.status(400).json({error:'Invalid review ID'});
 const {rowCount}=await query('DELETE FROM reviews WHERE id=$1 AND user_id=$2',[id,req.user.id]);
 if(!rowCount) return res.status(404).json({error:'Review not found or not owned by you'});
 res.status(204).end();
}));
router.get('/users/me/reviews',wrap(async(req,res)=>{
 const {rows}=await query('SELECT * FROM reviews WHERE user_id=$1 ORDER BY created_at DESC',[req.user.id]);
 res.json({reviews:rows});
}));
export default router;
