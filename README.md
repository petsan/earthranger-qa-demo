Copyright (c) 2026 Piotr Sankiewicz. All rights reserved.
Unauthorized copying, distribution, or reuse of this file, via any medium, is strictly prohibited.

# 🌲 Discovery Park Conservation Tracker & QA Demo
A lightweight, production-ready demo demonstrating real-time geospatial tracking, API validation, AI-augmented testing guardrails, and deterministic Playwright automation. Built to mirror EarthRanger's Senior QA Automation Engineer requirements.

## 🎯 Architecture & JD Alignment
| EarthRanger Requirement | Demo Implementation |
|-------------------------|---------------------|
| Real-time data ingestion | Live polling of conservation-style detection API with in-memory state simulation |
| Geospatial tracking & bounds validation | Leaflet mapping + strict lat/lng guardrails + temporal drift checks |
| Playwright E2E & API testing | Full test suite covering response structure, UI rendering, track extension, and flakiness prevention |
| AI-assisted tooling & guardrails | Explicit AI output validation test with selector/assertion rubrics & human-in-the-loop review |
| Contract-ready delivery | Zero-config setup, Dockerized deployment, CI-ready structure, deterministic execution |

## 🛠️ Quick Start
Get up and running locally in three simple steps:

```bash
# 1. Clone & install dependencies
git clone https://github.com/petsan/earthranger-qa-demo.git && cd earthranger-qa-demo
npm install

# 2. Run the application locally
npm start
# Open http://localhost:3000 in your browser

# 3. Run the full QA suite
npm test
```

## 🐳 Docker Quick Start
Get up and running with Docker:

```bash
# Build and start the container in the background
docker compose up -d

# View container logs in real-time
docker compose logs -f

# Open in browser
open http://localhost:3000

# Install npm and run the tests
npm install
npm test
```
