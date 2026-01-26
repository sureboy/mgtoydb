import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const POST:RequestHandler=async (e) => {
    console.log(e)
    await e.platform?.env.KV.put("test","1231")
    return json({msg:"true"}) 

};
export const GET: RequestHandler =async ({url, request, platform }) => {
    ///await platform?.env.KV.put("test","1231")
    const k = url.searchParams.get("k")
    if (k)     
        return json({msgstruct:await platform?.env.KV.get(k)}) 
    else 
        error(404)

};