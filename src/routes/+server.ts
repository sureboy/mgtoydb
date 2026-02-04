import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types'; 
import { env } from '$env/dynamic/private';
 
async function sha256(message:string|Uint8Array<ArrayBuffer>) {
  // 1. 将字符串编码为 Uint8Array (UTF-8)
  let msgBuffer
  if ( typeof message === "string"){
    msgBuffer = new TextEncoder().encode(message);
  }else{
    msgBuffer = message
  }
  
  
  // 2. 使用 Web Crypto API 计算哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // 3. 将 ArrayBuffer 结果转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
export const POST:RequestHandler=async (e) => { 
    const code = e.url.searchParams.get("code")
    const key = e.url.searchParams.get("key") 
    if (!code 
      || !key       
      || key != await sha256(env.API_SECRET_KEY+code.toLocaleLowerCase() + Date.now().toString().slice(0,8))){ 
      return json({msg :"err"}) 
    }
    const arrayBuffer = await e.request.arrayBuffer();
    if (!arrayBuffer)
      return json({msg :"not db"}) 
    //return json({msg:"ok"})
    const k = Date.now().toString(32)
    const opt:{metadata?:any,expiration?:number,expirationTtl?:number} = { }
    const metadata =  e.url.searchParams.get("metadata")
    if (metadata){
      opt.metadata = JSON.parse(metadata)
    }
    const expiration =  e.url.searchParams.get("expiration")
    if (expiration){
      opt.expiration =parseInt(expiration)
    }
    const expirationTtl =  e.url.searchParams.get("expirationttl")
    if (expirationTtl){
      opt.expirationTtl =parseInt(expirationTtl)
    } 
    await e.platform?.env.KV.put(k,arrayBuffer,opt)
    return json({msg:"ok",k})
};
export const GET: RequestHandler =async ({url, request, platform }) => {
    ///await platform?.env.KV.put("test","1231")
 
    const key = url.searchParams.get("k") 
    if (key){
      const value = await platform?.env.KV.get(key,"arrayBuffer")
      if (value){
          const blob = new Blob([value], { type: 'application/gzip' });

        return new Response(blob, {
          headers: {
            'Content-Type': 'application/gzip'
          }
        });
        //return value
      }
    }else if(url.searchParams.get("list")){
      const value = await platform?.env.KV.list({cursor:url.searchParams.get("cursor")||""})
      if (value){
        return json(value)
      }        
    }
    error(404)    
};