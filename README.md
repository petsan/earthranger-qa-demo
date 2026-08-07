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
git clone <your-repo> && cd <your-repo>
npm install

# 2. Run locally
npm start
# Open http://localhost:3000

# 3. Run QA suite
npm test
