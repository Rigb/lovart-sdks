import requests

class APIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def get(self, endpoint: str, params=None):
        url = f"{self.base_url}/{endpoint}"
        response = requests.get(
            url,
            headers=self.headers,
            params=params,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
