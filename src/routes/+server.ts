import { error,json } from '@sveltejs/kit';
import type { RequestHandler } from './$types'; 
//import { env } from '$env/dynamic/private';
import {DurableObject} from 'cloudflare:workers'

//export interface Env {
//  MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
//}
export class MyDurableObject extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async sayHello(): Promise<string> {
    return "Hello, World!";
  }
} 
export const GET: RequestHandler =async ({url, request, platform }) => {
    ///await platform?.env.KV.put("test","1231")
     const stub = platform?.env.MY_DURABLE_OBJECT.getByName("foo") as DurableObjectStub<MyDurableObject>|undefined;

    // Methods on the Durable Object are invoked via the stub
    const rpcResponse = await stub?.sayHello();

    return new Response(rpcResponse);
     
};