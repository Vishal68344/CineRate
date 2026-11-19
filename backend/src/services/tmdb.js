const BASE='https://api.themoviedb.org/3';
export async function tmdb(path,params={}){
 if(!process.env.TMDB_API_KEY){const e=new Error('TMDB_API_KEY is not configured');e.status=503;throw e;}
 const url=new URL(BASE+path);
 url.searchParams.set('api_key',process.env.TMDB_API_KEY);
 for(const [k,v] of Object.entries(params)) url.searchParams.set(k,String(v));
 const response=await fetch(url,{signal:AbortSignal.timeout(10000)});
 if(!response.ok){const e=new Error(response.status===404?'Movie not found':'Movie service unavailable');e.status=response.status===404?404:502;throw e;}
 return response.json();
}
