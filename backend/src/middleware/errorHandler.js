export const wrap = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export function errorHandler(err,req,res,next){
 if(err.code==='23505') return res.status(409).json({error:'This email or review already exists'});
 console.error(err);
 res.status(err.status || 500).json({error:err.status ? err.message : 'Internal server error'});
}
