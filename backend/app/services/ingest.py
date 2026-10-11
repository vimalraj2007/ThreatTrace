import csv
import json
import uuid
from typing import List, Dict, Any, Tuple

def parse_telemetry_file(content_bytes: bytes, filename: str, kind: str) -> Tuple[List[Dict[str, Any]], int, int, List[str]]:
    valid_records = []
    invalid_count = 0
    errors = []

    text = content_bytes.decode("utf-8", errors="ignore")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    total_count = len(lines)

    if filename.endswith(".csv"):
        try:
            reader = csv.DictReader(lines)
            for idx, row in enumerate(reader):
                if any(row.values()):
                    valid_records.append({"kind": kind, "filename": filename, **row})
                else:
                    invalid_count += 1
                    errors.append(f"{filename}: Row {idx+1} is empty or malformed")
        except Exception as e:
            errors.append(f"{filename}: Failed to parse CSV - {str(e)}")
            invalid_count = total_count
    elif filename.endswith(".json"):
        try:
            data = json.loads(text)
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        valid_records.append({"kind": kind, "filename": filename, **item})
                    else:
                        invalid_count += 1
            elif isinstance(data, dict):
                valid_records.append({"kind": kind, "filename": filename, **data})
        except Exception as e:
            errors.append(f"{filename}: Failed to parse JSON - {str(e)}")
            invalid_count = total_count
    elif filename.endswith(".ndjson"):
        for idx, line in enumerate(lines):
            try:
                item = json.loads(line)
                if isinstance(item, dict):
                    valid_records.append({"kind": kind, "filename": filename, **item})
                else:
                    invalid_count += 1
            except Exception:
                invalid_count += 1
                errors.append(f"{filename}: Line {idx+1} is invalid JSON")
    else:
        # Fallback generic line reader
        for idx, line in enumerate(lines):
            valid_records.append({"kind": kind, "filename": filename, "raw": line})

    return valid_records, total_count, invalid_count, errors
