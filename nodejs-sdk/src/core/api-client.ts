import axios, { AxiosInstance } from 'axios';

export class APIClient {
  private instance: AxiosInstance;

  constructor(config: { baseURL: string; apiKey: string }) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async get<T>(endpoint: string, params?: object): Promise<T> {
    const response = await this.instance.get<T>(endpoint, { params });
    return response.data;
  }
}
