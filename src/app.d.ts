// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';
declare global {
	namespace App {
        interface Platform {
            env: {
                KV: KVNamespace;
            }
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export {};