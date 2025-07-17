import requests
import json
from requests.exceptions import RequestException

class APIError(Exception):
    """Exception pour les erreurs API"""
    def __init__(self, status_code, message):
        self.status_code = status_code
        self.message = message
        super().__init__(f"API Error {status_code}: {message}")

class NetworkError(Exception):
    """Exception pour les erreurs réseau"""
    def __init__(self, message):
        self.message = message
        super().__init__(f"Network Error: {message}")

class APIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def _request(self, method, endpoint, **kwargs):
        url = f"{self.base_url}/{endpoint}"
        try:
            response = requests.request(
                method,
                url,
                headers=self.headers,
                **kwargs,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except RequestException as e:
            if e.response is not None:
                try:
                    error_data = e.response.json()
                except json.JSONDecodeError:
                    error_data = e.response.text
                raise APIError(e.response.status_code, error_data) from e
            else:
                raise NetworkError(str(e)) from e

    def get(self, endpoint: str, params=None):
        return self._request('GET', endpoint, params=params)

    def post(self, endpoint: str, data=None):
        return self._request('POST', endpoint, json=data)

    def put(self, endpoint: str, data=None):
        return self._request('PUT', endpoint, json=data)

    def delete(self, endpoint: str):
        return self._request('DELETE', endpoint)
