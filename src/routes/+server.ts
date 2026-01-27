import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
//import { API_SECRET_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
//import * as crypto  from 'crypto';
async function sha256(message:string) {
  // 1. 将字符串编码为 Uint8Array (UTF-8)
  const msgBuffer = new TextEncoder().encode(message);
  
  // 2. 使用 Web Crypto API 计算哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // 3. 将 ArrayBuffer 结果转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
//function sha256(data:string) {
  
//  return crypto.createHash('sha256').update(data).digest('hex');
//}
 
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  return result;
}
export const POST:RequestHandler=async (e) => {
    console.log(e)
    await e.platform?.env.KV.put("test","1231")
    return json({msg:"true"}) 

};
export const GET: RequestHandler =async ({url, request, platform }) => {
    ///await platform?.env.KV.put("test","1231")
    const code = url.searchParams.get("code")
    const key = url.searchParams.get("key")
    if (code){
      return json({ key:await sha256(env.API_SECRET_KEY+code + parseInt((Date.now()/100000).toString()))}) 
    }
    error(404)
};