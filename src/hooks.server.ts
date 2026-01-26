export async function handle({ event, resolve }) {
  // 指定允许的域名列表
  const allowedOrigins = [
    'https://solidjscad.com',
    'https://www.solidjscad.com',
    'https://solidjscad.cn',
    'https://www.solidjscad.cn',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = event.request.headers.get('origin')||"";
  
  // 处理预检请求（OPTIONS）
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      }
    });
  }
  
  // 处理正常请求
  const response = await resolve(event);
  
  // 添加 CORS 头部
  if (allowedOrigins.includes(origin)) {
    response.headers.append('Access-Control-Allow-Origin', origin);
    response.headers.append('Access-Control-Allow-Credentials', 'true');
    response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.append('Access-Control-Expose-Headers', '*');
  }
  
  return response;
}