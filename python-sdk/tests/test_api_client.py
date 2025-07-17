import pytest
import json
import requests
from requests.exceptions import ConnectionError
from lovart.core.api_client import APIClient, APIError, NetworkError

@pytest.fixture
def requests_mock(monkeypatch):
    """Fixture pour mocker les requêtes HTTP"""
    class MockResponse:
        def __init__(self, status_code, json_data=None, text=None):
            self.status_code = status_code
            self.json_data = json_data
            self.text = text or (json.dumps(json_data) if json_data else None)
            self.content = self.text.encode('utf-8') if self.text else b''
        
        def json(self):
            return self.json_data
        
        def raise_for_status(self):
            if 400 <= self.status_code < 600:
                error = requests.exceptions.HTTPError()
                error.response = self
                raise error

    class MockAdapter:
        def __init__(self):
            self.registry = {}
        
        def register_uri(self, method, url, **kwargs):
            self.registry[(method, url)] = kwargs
        
        def send(self, request, **kwargs):
            key = (request.method, request.url)
            if key in self.registry:
                response_config = self.registry[key]
                
                if 'exc' in response_config:
                    raise response_config['exc']
                
                return MockResponse(
                    response_config.get('status_code', 200),
                    response_config.get('json'),
                    response_config.get('text')
                )
            raise ConnectionError(f"Unregistered request: {request.method} {request.url}")

    adapter = MockAdapter()
    
    def mocked_send(session, request, **kwargs):
        return adapter.send(request, **kwargs)
    
    monkeypatch.setattr(requests.Session, 'send', mocked_send)
    return adapter

def test_get_success(requests_mock):
    requests_mock.register_uri('GET', 'https://api.example.com/test', json={"key": "value"})
    api = APIClient("https://api.example.com", "test-key")
    assert api.get("test") == {"key": "value"}

def test_post_success(requests_mock):
    requests_mock.register_uri('POST', 'https://api.example.com/test', json={"created": True})
    api = APIClient("https://api.example.com", "test-key")
    result = api.post("test", {"name": "test"})
    assert result == {"created": True}

def test_put_success(requests_mock):
    requests_mock.register_uri('PUT', 'https://api.example.com/test', json={"updated": True})
    api = APIClient("https://api.example.com", "test-key")
    result = api.put("test", {"name": "test"})
    assert result == {"updated": True}

def test_delete_success(requests_mock):
    requests_mock.register_uri('DELETE', 'https://api.example.com/test', json={"deleted": True})
    api = APIClient("https://api.example.com", "test-key")
    result = api.delete("test")
    assert result == {"deleted": True}

def test_api_error_handling(requests_mock):
    requests_mock.register_uri('GET', 'https://api.example.com/error', 
                             status_code=404, 
                             text="Not Found")
    api = APIClient("https://api.example.com", "test-key")
    
    with pytest.raises(APIError) as excinfo:
        api.get("error")
    
    assert excinfo.value.status_code == 404
    assert "Not Found" in str(excinfo.value)

def test_network_error_handling(requests_mock):
    requests_mock.register_uri('GET', 'https://api.example.com/network-error', 
                             exc=ConnectionError("Connection failed"))
    api = APIClient("https://api.example.com", "test-key")
    
    with pytest.raises(NetworkError) as excinfo:
        api.get("network-error")
    
    assert "Connection failed" in str(excinfo.value)
