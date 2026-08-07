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
```bash
# 1. Clone & install
git clone https://github.com/petsan/earthranger-qa-demo.git/ && cd earthranger-qa-demo
npm install

# 2. Run locally
npm start
Open http://localhost:3000

# 3. Run QA suite
npm test

## 🐳 Docker Deployment
Run the application in a fully containerized environment with a single command. Includes health checks, auto-restart policies, and isolated networking.

# Prerequisites
- Docker installed
- Docker Compose (v2+ recommended)

# Docker Quick Start
```bash
# 1. Build and start the container in the background
docker compose up -d

# 2. View container logs in real-time
docker compose logs -f

# 3. Open in browser
open http://localhost:3000

## Running Tests Against the Container
```bash
# 1. Run full test suite
npm test

# 2. Run with HTML report generation
npm test -- --reporter=html

# 3. Run specific test file
npm test -- tests/earthranger_tracker.spec.ts

## Cleanup & Management
```bash
# 1. Stop and remove containers + networks
docker compose down

# 2. Stop containers but keep data/volumes
docker compose stop
