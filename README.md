# 🚀 Velzion

**Cloud-native orchestration for ephemeral preview environments.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CNCF Paketo](https://img.shields.io/badge/Powered%20By-Paketo%20Buildpacks-blueviolet)](https://paketo.io/)
[![Infrastructure](https://img.shields.io/badge/IaC-Terraform-623CE4)](https://www.terraform.io/)
[![Cloud](https://img.shields.io/badge/Cloud-AWS_Spot-FF9900)](https://aws.amazon.com/)

Velzion is a Zero-CI control plane that dynamically provisions isolated, ephemeral preview environments for pull requests. Built on Terraform and Paketo Buildpacks, it automatically negotiates AWS Spot compute and compiles OCI-compliant containers directly from source code, delivering instant deployments and real-time FinOps telemetry natively.

---

## 📖 Table of Contents
- [Architecture & Overview](#-architecture--overview)
- [Key Features](#-key-features)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [Roadmap & Future Vision](#-roadmap--future-vision)

---

## 🏗 Architecture & Overview

Velzion bypasses traditional CI/CD pipelines (like GitHub Actions or Jenkins) and eliminates the need for developers to write `Dockerfile`s. 

1. **The Request:** The React control plane sends target repository data via webhooks.
2. **The Orchestrator:** n8n dynamically generates isolated Terraform workspaces.
3. **The Infrastructure:** Terraform requests deeply discounted AWS EC2 Spot Instances.
4. **The Zero-CI Engine:** The instance auto-installs Docker and the CNCF `pack` CLI, clones the source code, and utilizes **Paketo Buildpacks** to auto-detect the language and compile a production-ready container from scratch.
5. **The Telemetry:** Django tracks total uptime and calculates real-time cost savings versus standard on-demand cloud pricing.

---

## ✨ Key Features

* **Zero-CI Deployments:** No Dockerfiles, no YAML pipelines. Just paste a repo URL and PR number.
* **Radical FinOps (70%+ Savings):** Leverages AWS Spot Instances for ephemeral workloads, automatically terminating them when destroyed to guarantee zero idle waste.
* **Dynamic Workspace Isolation:** Safely handles concurrent deployment requests without state-file collisions.
* **Instant Teardown:** 1-click destruction wipes the infrastructure from existence, leaving no zombie servers or unpatched preview apps exposed.

---

## 📋 Prerequisites

Before running Velzion locally, ensure you have the following installed:

* **Node.js** (v20+)
* **Python** (v3.12+)
* **Docker & Docker Compose** (For PostgreSQL & n8n orchestration)
* **Terraform CLI** * **AWS CLI** (Configured with an IAM user that has EC2 provisioning permissions)
* **Git**

---

## 🛠 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Parth2496Singh/VELZION.git
cd VELZION
```

### 2. Configure Environment Variables
You must set up your local secrets. These files are ignored by `.gitignore` for security.

**Backend / AWS Secrets (`backend/.env`):**
Create a `.env` file in the `backend/` directory:
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_DEFAULT_REGION=us-east-1
```

**Frontend Secrets (`frontend/.env.local`):**
Create a `.env.local` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

### 3. Start the Orchestration Layer (n8n & Postgres)
```bash
cd backend
docker-compose up -d
```

### 4. Boot the Django Control Plane
```bash
# Still in the backend/ directory
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 5. Launch the React Dashboard
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The Velzion Dashboard will now be accessible at `http://localhost:5173`.

---

## 💻 Usage

1. Open the Velzion Dashboard.
2. Input a target **GitHub Repository URL** and the **Pull Request Number**.
3. Click **Execute**.
4. Monitor the status as it shifts from `PROVISIONING` to `RUNNING`.
5. Once live, click the generated **Live URL** to view the deployed preview environment.
6. Observe the **FinOps Telemetry** tracking your exact cost savings in real-time.
7. Click **Terminate** to trigger the Terraform destroy sequence and halt billing.

---

## 🗺 Roadmap & Future Vision

The current MVP demonstrates the core Zero-CI orchestration engine. The next iteration of Velzion will evolve into a fully managed, enterprise SaaS platform:

- [ ] **Velzard AI Integration:** Implementation of "Velzard", an intelligent routing and debugging layer that analyzes Paketo build logs to automatically suggest fixes for failed PR compilations.
- [ ] **Enterprise AWS Onboarding (1-Click CloudFormation):** Transitioning away from hardcoded IAM keys. Enterprise customers will use a 1-click AWS CloudFormation template to securely grant Velzion an `AssumeRole` ARN, ensuring zero-trust cross-account deployment.
- [ ] **Official GitHub OAuth App:** Moving from manual URL inputs to a fully integrated GitHub App. Velzion will listen to native PR webhook events, automatically deploying environments when a PR is opened and commenting the Live URL directly onto the GitHub PR timeline.
- [ ] **Fully Managed Cloud Control Plane:** Migrating the Velzion control plane (Django/React/n8n) from local execution to a highly available AWS EKS (Kubernetes) or ECS architecture for global scale.

---

### License
This project is licensed under the MIT License. See the `LICENSE` file for details.
