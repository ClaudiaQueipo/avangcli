    def _generate_test_files(self, context: dict) -> None:
        """Generate basic test files."""
        test_main_content = '''"""Tests for main application."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


def test_root():
    """Test root endpoint."""
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health():
    """Test health endpoint."""
    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
'''
        self._write_file(self.project_dir / "tests" / "test_main.py", test_main_content)