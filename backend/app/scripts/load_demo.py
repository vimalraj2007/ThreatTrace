import os
import csv
import random
from datetime import datetime, timedelta
from app.services.store import store
from app.services.analysis import run_analysis_pipeline

def generate_synthetic_data(data_dir: str):
    os.makedirs(data_dir, exist_ok=True)
    
    auth_csv = os.path.join(data_dir, "synthetic_auth.csv")
    dns_csv = os.path.join(data_dir, "synthetic_dns.csv")
    process_csv = os.path.join(data_dir, "synthetic_process.csv")

    base_time = datetime(2026, 9, 30, 8, 0, 0)
    hosts = [f"PC-{i:02d}" for i in range(1, 15)] + ["FILE-SERVER", "DOMAIN-CONTROLLER", "SRV-BACKUP-01"]
    users = [f"user_{i}" for i in range(1, 10)] + ["domain_user_alpha", "svc_backup", "Administrator"]

    # 1. Generate Auth Logs (1,000 records)
    with open(auth_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["EventID", "timestamp", "WorkstationName", "TargetUserName", "LogonType", "IpAddress"])
        for i in range(1000):
            ts = (base_time + timedelta(seconds=i*10)).isoformat() + "Z"
            h = random.choice(hosts)
            u = random.choice(users)
            writer.writerow([4624, ts, h, u, 3, f"192.168.1.{random.randint(2, 250)}"])

    # 2. Generate DNS Logs (1,000 records)
    with open(dns_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["EventID", "timestamp", "ClientIP", "QueryName", "QueryType"])
        normal_domains = ["google.com", "microsoft.com", "github.com", "internal-share.corp.local"]
        for i in range(1000):
            ts = (base_time + timedelta(seconds=i*10)).isoformat() + "Z"
            d = random.choice(normal_domains)
            writer.writerow([22, ts, f"192.168.1.{random.randint(2, 250)}", d, "A"])

    # 3. Generate Process Logs (500 records)
    with open(process_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["EventID", "timestamp", "ParentImage", "Image", "CommandLine"])
        for i in range(500):
            ts = (base_time + timedelta(seconds=i*20)).isoformat() + "Z"
            writer.writerow([1, ts, "explorer.exe", "chrome.exe", "chrome.exe --no-first-run"])

    print(f"Generated synthetic log files in {data_dir}")

def load_demo():
    print("Initializing ThreatTrace synthetic demo dataset...")
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    generate_synthetic_data(data_dir)
    store.reset_with_demo_data()
    res = run_analysis_pipeline()
    print(f"Demo loaded successfully: {res['incident_count']} incidents detected, {res['event_count']} events analyzed.")

if __name__ == "__main__":
    load_demo()
