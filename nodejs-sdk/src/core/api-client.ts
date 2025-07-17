import axios, { AxiosError } from 'axios';

export class APIClient {
    private baseUrl: string;
    private apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    private getHeaders() {
        return {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    public async get(endpoint: string, params?: any): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
                headers: this.getHeaders(),
                params,
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            this.handleError(error as AxiosError);
        }
    }

    public async post(endpoint: string, data: any): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/${endpoint}`, data, {
                headers: this.getHeaders(),
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            this.handleError(error as AxiosError);
        }
    }

    public async put(endpoint: string, data: any): Promise<any> {
        try {
            const response = await axios.put(`${this.baseUrl}/${endpoint}`, data, {
                headers: this.getHeaders(),
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            this.handleError(error as AxiosError);
        }
    }

    public async delete(endpoint: string): Promise<any> {
        try {
            const response = await axios.delete(`${this.baseUrl}/${endpoint}`, {
                headers: this.getHeaders(),
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            this.handleError(error as AxiosError);
        }
    }

    private handleError(error: AxiosError) {
        if (error.response) {
            throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            throw new Error(`Network Error: No response received - ${error.message}`);
        } else {
            throw new Error(`Request Error: ${error.message}`);
        }
    }
}
