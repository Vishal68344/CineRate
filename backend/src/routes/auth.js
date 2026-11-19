import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {query} from '../db.js';
import {auth} from '../middleware/auth.js';
import {wrap} from '../middleware/errorHandler.js';
const router=Router();
const emailOK=s=>typeof s==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length<=255;
const publicUser=u=>({id:u.id,name:u.name,email:u.email});
const tokenFor=u=>jwt.sign({id:u.id},process.env.JWT_SECRET,{expiresIn:'7d'});
router.post('/register',wrap(async(req,res)=>{
 const {name,email,password}=req.body;
 if(typeof name!=='string'||!name.trim()||name.trim().length>100||!emailOK(email)||typeof password!=='string'||password.length<8||password.length>72) return res.status(400).json({error:'Enter a name, valid email and password (8–72 characters)'});
 const hash=await bcrypt.hash(password,10);
 const {rows}=await query('INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email',[name.trim(),email.trim().toLowerCase(),hash]);
 res.status(201).json({user:publicUser(rows[0]),token:tokenFor(rows[0])});
}));
router.post('/login',wrap(async(req,res)=>{
 const {email,password}=req.body;
 if(!emailOK(email)||typeof password!=='string') return res.status(400).json({error:'Valid email and password required'});
 const {rows}=await query('SELECT * FROM users WHERE email=$1',[email.trim().toLowerCase()]);
 if(!rows[0]||!(await bcrypt.compare(password,rows[0].password_hash))) return res.status(401).json({error:'Invalid credentials'});
 res.json({user:publicUser(rows[0]),token:tokenFor(rows[0])});
}));
router.get('/me',auth,wrap(async(req,res)=>{
 const {rows}=await query('SELECT id,name,email FROM users WHERE id=$1',[req.user.id]);
 if(!rows[0]) return res.status(401).json({error:'Account not found'});
 res.json({user:rows[0]});
}));
export default router;
