import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
//import { API_SECRET_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
//import * as crypto  from 'crypto';
const base64url = {
  baseTime:1767196800000,
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  getStr:function(){
    return this.encode(Date.now() - this.baseTime);
  },
  encode: function(num:number) {
    let str = '';
    while (num > 0) {
      str = this.chars[num % 64] + str;
      num = Math.floor(num / 64);
    }
    return str;
  },
  decode: function(str:string) {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      num = num * 64 + this.chars.indexOf(str[i]);
    }
    return num;
  }
};
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
//function sha256(data:string) {
  
//  return crypto.createHash('sha256').update(data).digest('hex');
//}
 
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  return result;
}
export const POST:RequestHandler=async (e) => {
  
    //console.log(e)
    const code = e.url.searchParams.get("code")
    const key = e.url.searchParams.get("key")
    //const {code,key,db} = (await e.request.json()) as {code?:string,key?:string,db?:{k:string,v:string}}
    if (!code 
      || !key       
      || key != await sha256(env.API_SECRET_KEY+code.toLocaleLowerCase() + Date.now().toString().slice(0,8))){ 
      return json({msg :"err"}) 
    }
    const arrayBuffer = await e.request.arrayBuffer();
    if (!arrayBuffer)
      return json({msg :"not db"}) 
    //return json({msg:"ok"})
    const k =base64url.getStr() //await  sha256(new Uint8Array(arrayBuffer))
    await e.platform?.env.KV.put(k,arrayBuffer,{})
    return json({msg:"ok",k}) 

};
export const GET: RequestHandler =async ({url, request, platform }) => {
    ///await platform?.env.KV.put("test","1231")
    const code = url.searchParams.get("code")
    const key = url.searchParams.get("key") 
    if (!code 
      || !key 
      || key != await sha256(env.API_SECRET_KEY+code.toLocaleLowerCase() + Date.now().toString().slice(0,8))){ 
      return json({msg :"err"}) 
    }
    return json({msg:"ok"})
    
};