import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types'; 
//import { env } from '$env/dynamic/private';
import {MyDurableObject} from '$lib/durable-objects'
export const GET: RequestHandler =async ({url, request, platform }) => {
    ///await platform?.env.KV.put("test","1231")
    const stub = platform?.env.MY_DURABLE_OBJECT.getByName("foo") as DurableObjectStub<MyDurableObject>|undefined; 
    const rpcResponse = await stub?.sayHello();
    return new Response(rpcResponse);
     
};