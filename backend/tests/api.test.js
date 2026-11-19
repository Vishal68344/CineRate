import {describe,it,expect} from 'vitest';
import request from 'supertest';
import {app} from '../src/app.js';
describe('API smoke tests',()=>{
 it('returns health',async()=>{const r=await request(app).get('/api/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok')});
 it('rejects invalid registration',async()=>{const r=await request(app).post('/api/auth/register').send({name:'',email:'bad',password:'123'});expect(r.status).toBe(400)});
 it('rejects invalid login',async()=>{const r=await request(app).post('/api/auth/login').send({email:'bad',password:''});expect(r.status).toBe(400)});
 it('rejects unauthenticated review',async()=>{const r=await request(app).post('/api/movies/1/reviews').send({rating:5,comment:'Great'});expect(r.status).toBe(401)});
 it('rejects invalid movie ID',async()=>{const r=await request(app).get('/api/movies/abc/reviews');expect(r.status).toBe(400)});
});
