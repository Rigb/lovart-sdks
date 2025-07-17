import axios, { AxiosError } from 'axios';
import { APIClient } from '../api-client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('APIClient', () => {
    const baseUrl = 'https://api.example.com';
    const apiKey = 'test-api-key';
    const client = new APIClient(baseUrl, apiKey);

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('get success', async () => {
        const mockData = { data: 'test' };
        mockedAxios.get.mockResolvedValue(mockData);

        const result = await client.get('test');
        expect(result).toEqual(mockData.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${baseUrl}/test`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                params: undefined,
                timeout: 10000
            }
        );
    });

    test('post success', async () => {
        const mockData = { data: 'created' };
        mockedAxios.post.mockResolvedValue(mockData);
        const payload = { key: 'value' };

        const result = await client.post('test', payload);
        expect(result).toEqual(mockData.data);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            `${baseUrl}/test`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
    });

    test('put success', async () => {
        const mockData = { data: 'updated' };
        mockedAxios.put.mockResolvedValue(mockData);
        const payload = { key: 'value' };

        const result = await client.put('test', payload);
        expect(result).toEqual(mockData.data);
        expect(mockedAxios.put).toHaveBeenCalledWith(
            `${baseUrl}/test`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
    });

    test('delete success', async () => {
        const mockData = { data: 'deleted' };
        mockedAxios.delete.mockResolvedValue(mockData);

        const result = await client.delete('test');
        expect(result).toEqual(mockData.data);
        expect(mockedAxios.delete).toHaveBeenCalledWith(
            `${baseUrl}/test`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
    });

    test('get error handling', async () => {
        const errorResponse = { 
            response: { 
                status: 404, 
                data: { message: 'Not found' } 
            } 
        } as AxiosError;
        mockedAxios.get.mockRejectedValue(errorResponse);

        await expect(client.get('test')).rejects.toThrow('API Error: 404 - {"message":"Not found"}');
    });

    test('network error handling', async () => {
        const errorResponse = { 
            request: {},
            message: 'Network error'
        } as AxiosError;
        mockedAxios.get.mockRejectedValue(errorResponse);

        await expect(client.get('test')).rejects.toThrow('Network Error: No response received - Network error');
    });

    test('configuration error handling', async () => {
        const errorResponse = new Error('Configuration error') as AxiosError;
        errorResponse.response = undefined;
        errorResponse.request = undefined;
        mockedAxios.get.mockRejectedValue(errorResponse);

        await expect(client.get('test')).rejects.toThrow('Request Error: Configuration error');
    });
});
