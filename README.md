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

**Velzion** is a Zero-CI control plane that dynamically provisions isolated, ephemeral preview environments for pull requests. Built on Terraform and Paketo Buildpacks, it automatically negotiates AWS Spot compute and compiles OCI-compliant containers directly from source code. 

> **Latest Upgrade:** Velzion now features a multi-page React SPA architecture, including an interactive FinOps ROI Calculator that proves the financial impact of eliminating 24/7 "zombie" staging servers.

---

## 📖 Table of Contents
* [Architecture & Stack](#-architecture--stack)
* [Key Features](#-key-features)
* [Setup & Installation](#%EF%B8%8F-setup--installation)
* [Usage](#-usage)
* [Roadmap & Future Vision](#-roadmap--future-vision)

---

## 🚀 Architecture & Stack

**Velzion MVP** is a fully containerized microservice platform:

| Layer | Technology Stack | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Served via ultra-fast Nginx |
| **Backend** | Django API (Python) | Core control plane & telemetry management |
| **Orchestrator** | n8n (Node.js) | Advanced workflow engine with elevated execution permissions |
| **Database** | PostgreSQL 15 | Persistent application state |
| **IaC** | Terraform | Dynamic auto-provisioning of AWS Spot Instances |

---

## ✨ Key Features

* **Zero-CI Deployments:** No Dockerfiles, no YAML pipelines. Just paste a repo URL and PR number.
* **Radical FinOps (~58.7% Base Savings):** Leverages AWS Spot Instances for ephemeral workloads, automatically terminating them to guarantee zero idle waste.
* **Interactive ROI Calculator:** Built-in predictive modeling to compare traditional 24/7 "zombie" staging server costs against Velzion's ephemeral lifecycle, frequently demonstrating 99%+ total compute reductions.
* **Dynamic Workspace Isolation:** Safely handles concurrent deployment requests via n8n directory orchestration.
* **Instant Teardown:** 1-click destruction wipes the infrastructure from existence, leaving no unpatched preview apps exposed to the internet.

---

## 🛠️ Setup & Installation

> **Note:** This project is completely containerized. You do not need Node, Python, or Postgres installed on your local machine—only **Docker Desktop**.

### 1. Clone the Repository
```bash
git clone https://github.com/Parth2496Singh/velzion-mvp.git
cd velzion-mvp
```

### 2. Configure AWS Credentials
Velzion requires AWS IAM credentials to automatically provision EC2 Spot instances. Copy the provided environment template:
```bash
cp backend/.env.example backend/.env
```
*Open backend/.env and replace the placeholder values with your actual AWS keys.*

### 3. Launch the Platform
Because of our custom Docker network and multi-stage builds, the entire architecture boots with a single command:
```bash
docker-compose up --build -d
```

### 4. Access the Services
Once the database healthcheck passes and the containers are live, access the platform here:

* 🖥️ **User Dashboard (React):** http://localhost:5173
* ⚙️ **API Control Plane (Django):** http://localhost:8000/api/environments/
* 🔀 **FinOps Orchestrator (n8n):** http://localhost:5678

### 5. Import the Automation Pipelines
Because n8n data is isolated locally, you need to import the orchestration workflows on your first run:
1. Open n8n at [http://localhost:5678](http://localhost:5678)
2. Click **Add Workflow**, open the top-right menu, and select **Import from File**.
3. Select `velzion-deploy-pipeline.json` from the `/workflows` directory. Save and **Publish** it.
4. Repeat the process to import `velzion-destroy-pipeline.json`. Save and **Publish** it.

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

The current MVP demonstrates the core Zero-CI orchestration engine for ephemeral preview environments. The next iteration of Velzion will evolve into a fully managed enterprise SaaS platform:

* 🧩 **Velzard (The Production Engine):** For core production workloads requiring 24/7 high availability, Velzard automates infrastructure provisioning directly inside the user's AWS account. It securely configures dedicated Amazon EC2 On-Demand resources, provisions Nginx reverse proxy routing, and launches the application via production-hardened configurations.
* ⚡ **Enterprise AWS Onboarding (1-Click CloudFormation):** Transitioning away from hardcoded IAM keys. Enterprise customers will use a 1-click AWS CloudFormation template to securely grant Velzion an `AssumeRole` ARN.
* 🤖 **Official GitHub OAuth App:** Moving from manual URL inputs to a fully integrated GitHub App. Velzion will listen to native PR webhook events, automatically deploying environments and commenting the Live URL directly onto the GitHub PR timeline.
* ☁️ **Fully Managed Cloud Control Plane:** Migrating the Velzion control plane (Django/React/n8n) from local execution to a highly available AWS EKS (Kubernetes) architecture for global scale.

---

### 📄 License
This project is licensed under the MIT License. See the `LICENSE` file for details.
