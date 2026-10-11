import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_contract():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "timestamp" in data

def test_auth_login_contract():
    res = client.post(
        "/api/v1/auth/login",
        data={"username": "analyst.connor@threattrace.soc", "password": "password123"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data

def test_dashboard_contract():
    res = client.get("/api/v1/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "stats" in data
    assert "events" in data["stats"]
    assert "incidents" in data["stats"]
    assert "suspicious_hosts" in data["stats"]
    assert "lateral" in data["stats"]
    assert "risky_users" in data["stats"]
    assert "next_targets" in data["stats"]
    assert isinstance(data["recent"], list)

def test_incidents_contract():
    res = client.get("/api/v1/incidents")
    assert res.status_code == 200
    incidents = res.json()
    assert isinstance(incidents, list)
    assert len(incidents) > 0
    inc = incidents[0]
    assert "id" in inc
    assert "title" in inc
    assert "severity" in inc
    assert "status" in inc
    assert "confidence" in inc
    assert "initial_host" in inc
    assert "affected_hosts" in inc

def test_incident_timeline_contract():
    res = client.get("/api/v1/incidents/INC-001/timeline?page=1&pageSize=10")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "page" in data
    assert "pageSize" in data or "page_size" in data
    assert "total" in data

def test_incident_graph_contract():
    res = client.get("/api/v1/incidents/INC-001/graph")
    assert res.status_code == 200
    graph = res.json()
    assert "nodes" in graph
    assert "edges" in graph
    if len(graph["nodes"]) > 0:
        node = graph["nodes"][0]
        assert "id" in node
        assert "type" in node
        assert "on_path" in node

def test_events_contract():
    res = client.get("/api/v1/events?page=1&pageSize=10&q=PC-03")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data

def test_reports_contract():
    res = client.get("/api/v1/reports/INC-001")
    assert res.status_code == 200
    report = res.json()
    assert "id" in report
    assert "summary" in report
    assert "actions" in report
