class APIClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.api_key = api_key

class APIError(Exception):
    def __init__(self, status_code, message=None):
        self.status_code = status_code
        self.message = message
        super().__init__(f"API Error {status_code}: {message}")

class NetworkError(Exception):
    pass
