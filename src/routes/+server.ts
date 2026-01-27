import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_SECRET_KEY } from '$env/static/private';
import * as crypto  from 'crypto';
function sha256(data:string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
 
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
      return json({ key:sha256(API_SECRET_KEY+code + parseInt((Date.now()/100000).toString()))}) 
    }
    error(404)
};