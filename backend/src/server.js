import 'dotenv/config';
import {app} from './app.js';
import {pool} from './db.js';
if(!process.env.DATABASE_URL||!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('Set DATABASE_URL and JWT_SECRET (32+ characters)');process.exit(1);}
const server=app.listen(Number(process.env.PORT)||4000,'0.0.0.0',()=>console.log('CineRate API listening'));
async function stop(){server.close(async()=>{await pool.end();process.exit(0)});}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
