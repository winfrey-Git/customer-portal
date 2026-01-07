declare module 'httpntlm' {
  interface HttpNtlmOptions {
    url: string;
    username: string;
    password: string;
    domain?: string;
    workstation?: string;
    ntlmStrictMode?: boolean;
    ntlmVersion?: number;
    rejectUnauthorized?: boolean;
    headers?: Record<string, string>;
  }

  interface HttpResponse {
    body: string;
    statusCode: number;
    headers: Record<string, string>;
  }

  function get(options: HttpNtlmOptions): Promise<HttpResponse>;
  function post(options: HttpNtlmOptions): Promise<HttpResponse>;
  function put(options: HttpNtlmOptions): Promise<HttpResponse>;
  function patch(options: HttpNtlmOptions): Promise<HttpResponse>;
  function del(options: HttpNtlmOptions): Promise<HttpResponse>;

  export {
    get,
    post,
    put,
    patch,
    del,
    get as getAsync,
    post as postAsync,
    put as putAsync,
    patch as patchAsync,
    del as delAsync,
    del as deleteAsync
  };

  export default {
    get,
    post,
    put,
    patch,
    del,
    delete: del,
    getAsync: get,
    postAsync: post,
    putAsync: put,
    patchAsync: patch,
    delAsync: del,
    deleteAsync: del
  };
}