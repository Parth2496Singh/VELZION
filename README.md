# 🚀 Velzion

**Cloud-native orchestration for ephemeral preview environments.**

### 🌐 Frontend
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)

### ⚙️ Backend & Orchestration
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white)](https://n8n.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### ☁️ Infrastructure & Cloud Engine
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white)](https://aws.amazon.com/ec2/)
[![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=flat-square&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Paketo Buildpacks](https://img.shields.io/badge/Paketo%20Buildpacks-0052CC?style=flat-square&logo=cncf&logoColor=white)](https://paketo.io/)

### 🛡️ Governance & Philosophy
[![FinOps](https://img.shields.io/badge/FinOps-Cost%20Optimization-4A37A0?style=flat-square)](https://www.finops.org/)
[![DevOps](https://img.shields.io/badge/DevOps-Automation-3F51B5?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

Velzion is a Zero-CI control plane that dynamically provisions isolated, ephemeral preview environments for pull requests. Built on Terraform and Paketo Buildpacks, it automatically negotiates AWS Spot compute and compiles OCI-compliant containers directly from source code. 

**Latest Upgrade:** Velzion now features a multi-page React SPA architecture, including an interactive FinOps ROI Calculator that proves the financial impact of eliminating 24/7 "zombie" staging servers.


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

Velzion bypasses traditional CI/CD pipelines and eliminates the need for `Dockerfile`s. It utilizes a fully decoupled microservice architecture:

1. **The SPA Control Plane:** A React Router frontend that manages live environment state and predictive FinOps telemetry.
2. **The Orchestrator:** n8n dynamically generates isolated Terraform workspaces to prevent state-file collisions.
3. **The Infrastructure:** Terraform requests ephemeral AWS EC2 Spot Instances (e.g., `t3.micro`).
4. **The Zero-CI Engine:** The instance auto-installs Docker and the CNCF `pack` CLI, clones the PR code, and utilizes **Paketo Buildpacks** to auto-detect the language and compile a live container natively.
5. **The Telemetry:** Django tracks exact uptime down to the second, calculating real-time cost savings against modern AWS On-Demand pricing tables.

---

## ✨ Key Features

* **Zero-CI Deployments:** No Dockerfiles, no YAML pipelines. Just paste a repo URL and PR number.
* **Radical FinOps (~58.7% Base Savings):** Leverages AWS Spot Instances for ephemeral workloads, automatically terminating them to guarantee zero idle waste.
* **Interactive ROI Calculator:** Built-in predictive modeling to compare traditional 24/7 "zombie" staging server costs against Velzion's ephemeral lifecycle, frequently demonstrating 99%+ total compute reductions.
* **Dynamic Workspace Isolation:** Safely handles concurrent deployment requests via n8n directory orchestration.
* **Instant Teardown:** 1-click destruction wipes the infrastructure from existence, leaving no unpatched preview apps exposed to the internet.

---

## 📋 Prerequisites

Before running Velzion locally, ensure you have the following installed:

* **Node.js** (v20+)
* **Python** (v3.12+)
* **Docker & Docker Compose**
* **Terraform CLI** * **AWS CLI** (Configured with an IAM user possessing EC2 provisioning permissions)
* **Git**

---

## 🛠 Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/Parth2496Singh/VELZION.git](https://github.com/Parth2496Singh/VELZION.git)
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
VITE_API_BASE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

### 3. Start the Orchestration Layer (n8n & Postgres)
This step uses the provided `docker-compose.yml` and the custom `n8n.Dockerfile` to compile the n8n engine with native Terraform and Docker execution permissions.
```bash
cd backend
docker-compose up --build -d
```

### 4. Boot the Django Control Plane
Ensure you install all required packages via the `requirements.txt` file.
```bash
# Still in the backend/ directory
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 5. Launch the React Control Plane
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The Velzion Control Plane will now be accessible at `http://localhost:5173`.

---

## 💻 Usage

### The Deployment Engine (`/`)
1. Open the Velzion Dashboard.
2. Input a target **GitHub Repository URL** and **Pull Request Number**.
3. Click **Execute Buildpack Pipeline**.
4. Monitor the status shift to `RUNNING` and click the generated **Live URL** to view the deployed preview environment.
5. Observe the **Live FinOps Telemetry** tracking exact fractions of a cent saved.
6. Click **Terminate Instance** to trigger the Terraform destroy sequence and halt billing.

### The FinOps Calculator (`/finopscalculator`)
1. Click the green "Open FinOps ROI Calculator" button in the top right.
2. Adjust the sliders to mirror your team's current staging server footprint.
3. View the projected Monthly Savings generated by adopting Velzion's ephemeral architecture.

---

## 🗺 Roadmap & Future Vision

The current MVP demonstrates the core Zero-CI orchestration engine. The next iteration of Velzion will evolve into a fully managed enterprise SaaS platform:

- [ ] **Velzard AI Integration:** Implementation of "Velzard", an intelligent routing and debugging layer that analyzes Paketo build logs to automatically suggest fixes for failed PR compilations.
- [ ] **Enterprise AWS Onboarding (1-Click CloudFormation):** Transitioning away from hardcoded IAM keys. Enterprise customers will use a 1-click AWS CloudFormation template to securely grant Velzion an `AssumeRole` ARN.
- [ ] **Official GitHub OAuth App:** Moving from manual URL inputs to a fully integrated GitHub App. Velzion will listen to native PR webhook events, automatically deploying environments and commenting the Live URL directly onto the GitHub PR timeline.
- [ ] **Fully Managed Cloud Control Plane:** Migrating the Velzion control plane (Django/React/n8n) from local execution to a highly available AWS EKS (Kubernetes) architecture for global scale.

---

### License
This project is licensed under the MIT License. See the `LICENSE` file for details.
