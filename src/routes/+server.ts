import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const tmpCode = new Map<string,string>()
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
    const k = url.searchParams.get("k")
    if (k){
        let code = tmpCode.get(k)
        if (code){
            return json({code})
        }
        code = generateRandomString(8) 
        tmpCode.set(k,code)
        return json({code}) 
    }
    error(404)
};