# ThreatTrace

**AI-assisted cyberattack analysis and reconstruction platform for SOC
investigations.**

ThreatTrace helps security analysts analyze uploaded logs, identify
suspicious activity, explore possible attack paths, map events to MITRE
ATT&CK, manage incidents, and generate investigation reports.

## Features

-   **Security dashboard** --- overview of incidents, severity, and
    suspicious activity.
-   **Log ingestion** --- upload and parse supported security log files.
-   **Anomaly analysis** --- score unusual events using an Isolation
    Forest-based pipeline.
-   **Attack graph** --- visualize relationships between hosts and other
    entities.
-   **Lateral movement investigation** --- explore possible movement
    between systems.
-   **MITRE ATT&CK mapping** --- view technique associations for
    investigation.
-   **Incident management** --- review incident details and
    investigation status.
-   **PDF reports** --- generate downloadable incident reports.
-   **REST API** --- FastAPI backend with interactive API documentation.

> **Note:** This repository is a prototype. Some dashboard values and
> attack scenarios may use demonstration data. Detection results and
> potential next-target assessments should be validated before use in a
> real environment.

## Tech Stack

-   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Recharts,
    Cytoscape
-   **Backend:** Python, FastAPI, Pydantic, scikit-learn, NumPy, Pandas,
    NetworkX, ReportLab
-   **Services:** Docker Compose, PostgreSQL service configuration

## Project Structure

``` text
ThreatTrace/
├── frontend/          # Next.js user interface
├── backend/           # FastAPI service and analysis pipeline
├── docker-compose.yml # Local multi-service setup
└── INTEGRATION.md     # Frontend/backend API integration notes
```

The supplied project may also contain root-level frontend files. Use the
directory containing `docker-compose.yml` as the project root for the
Docker instructions below.

## Getting Started

### Option 1: Docker Compose

**Requirements:** Docker Desktop or Docker Engine with the Docker
Compose plugin.

1.  Clone the repository and enter the project directory:

    ``` bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  Review `docker-compose.yml` and configure environment variables for
    your local environment. Do not use demo secrets in a public or
    production deployment.

3.  Build and start the services:

    ``` bash
    docker compose up --build
    ```

4.  Open the application:

    -   Frontend: http://localhost:3000
    -   Backend API docs: http://localhost:8000/docs
    -   Backend health endpoint: http://localhost:8000/api/v1/health

Stop the services with:

``` bash
docker compose down
```

### Option 2: Run the Frontend Separately

**Requirements:** Node.js and npm.

1.  Install frontend dependencies:

    ``` bash
    npm install
    ```

2.  Configure the frontend environment. If using the separate
    `frontend/` directory, copy `.env.example` to `.env.local` and set
    the backend URL:

    ``` env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    NEXT_PUBLIC_DEMO=false
    ```

3.  Start the development server:

    ``` bash
    npm run dev
    ```

4.  Visit http://localhost:3000.

Run the backend separately using the instructions and dependencies in
`backend/`.

## API

The FastAPI service exposes versioned endpoints under `/api/v1`. Open
the interactive Swagger documentation at `http://localhost:8000/docs`
while the backend is running.

## Security Notes

-   **Never commit `.env.local`, API keys, passwords, JWT secrets, or
    other credentials.**
-   Replace demo credentials and secrets before running outside a local
    development environment.
-   Restrict access to uploaded logs because they may contain sensitive
    information.
-   Treat anomaly scores, ATT&CK mappings, and predicted attack paths as
    investigation aids---not definitive proof of compromise.
-   Do not connect this prototype to production systems without security
    review, authentication hardening, and testing.

## Current Limitations

-   Some screens or metrics may use synthetic demonstration data.
-   Detection quality depends on log format, available fields, and
    analysis logic.
-   Real-time endpoint monitoring and production SIEM integration are
    not guaranteed by the current prototype.
-   Database persistence and end-to-end workflow behavior should be
    tested in the target environment.

## Contributing

Issues and pull requests are welcome. Please include steps to reproduce
bugs and avoid sharing real credentials or sensitive log data.

## License

No license is specified yet. Add a `LICENSE` file before distributing or
reusing this project publicly.
