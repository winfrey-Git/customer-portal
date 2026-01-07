declare module 'axios-ntlm' {
  import { AxiosRequestConfig, AxiosResponse } from 'axios';

  interface NtlmCredentials {
    username: string;
    password: string;
    domain?: string;
    workstation?: string;
  }

  interface AxiosNtlmConfig extends AxiosRequestConfig, NtlmCredentials {}

  const axiosNtlm: {
    get: (url: string, config?: AxiosNtlmConfig) => Promise<AxiosResponse>;
    post: (url: string, data?: any, config?: AxiosNtlmConfig) => Promise<AxiosResponse>;
    put: (url: string, data?: any, config?: AxiosNtlmConfig) => Promise<AxiosResponse>;
    delete: (url: string, config?: AxiosNtlmConfig) => Promise<AxiosResponse>;
    patch: (url: string, data?: any, config?: AxiosNtlmConfig) => Promise<AxiosResponse>;
  };

  export = axiosNtlm;
}
