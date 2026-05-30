# 🚀 Velzion

**Keyless, Zero-CI orchestration for ephemeral preview environments.**

### 🌐 Frontend
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

### ⚙️ Backend & Orchestration
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white)](https://n8n.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### ☁️ Infrastructure & Cloud Engine
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=flat-square&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

### 🛡️ Security & FinOps
[![FinOps](https://img.shields.io/badge/FinOps-Cost%20Optimization-4A37A0?style=flat-square)](https://www.finops.org/)
[![IAM](https://img.shields.io/badge/IAM-Keyless%20AssumeRole-FF9900?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

**Velzion** is an enterprise-grade control plane that dynamically provisions isolated, ephemeral preview environments for GitHub Pull Requests. It eliminates the need for long-running staging servers by automatically negotiating AWS Spot compute, deploying infrastructure via Terraform, and tearing it down the moment a PR is closed.

> **Latest Architecture Upgrade:** Velzion is now **100% Keyless**. It utilizes an AWS Cross-Account AssumeRole architecture, meaning zero hardcoded AWS Access Keys are stored in the codebase. All deployments are seamlessly triggered via native GitHub Webhooks.

---

## 📖 Table of Contents
* [Architecture & The Velzion Workflow](#-architecture--the-velzion-workflow)
* [Key Features](#-key-features)
* [Local Deployment Setup](#%EF%B8%8F-local-deployment-setup)
* [Platform Configuration (OAuth & IAM)](#-platform-configuration-oauth--iam)
* [Usage & Automation](#-usage--automation)

---

## 🚀 Architecture & The Velzion Workflow

Velzion operates as a fully containerized Monorepo. When a developer interacts with their code on GitHub, Velzion orchestrates the cloud silently in the background.

### The Automated Lifecycle:
1. **Trigger:** A developer opens a Pull Request on a connected GitHub repository.
2. **Webhook:** GitHub fires a native webhook payload to the Velzion Engine (n8n).
3. **Authentication:** Terraform wakes up and requests temporary, least-privilege credentials from the AWS Metadata server via an EC2 Instance Profile (AssumeRole).
4. **Provisioning:** Terraform dynamically creates an isolated workspace, provisions an AWS Spot Instance, and boots the application.
5. **Telemetry:** The Django backend begins tracking real-time FinOps data (Spot vs. On-Demand cost savings) which is rendered on the React dashboard.
6. **Teardown:** When the PR is merged or closed, a webhook triggers the exact reverse process, destroying the infrastructure and halting billing instantly.

---

## ✨ Key Features

* **100% Keyless IAM Security:** Connect target AWS accounts via a 1-click CloudFormation template. No `AKIA` keys are ever stored in `.env` files or Git history.
* **GitHub OAuth Integration:** Secure, passwordless authentication for the dashboard.
* **Zero-Touch Deployments:** No manual simulators. Open a PR, and your isolated environment is live in minutes.
* **Radical FinOps Engine:** Leverages AWS Spot Instances for ephemeral workloads, consistently achieving ~60% compute cost reductions. Includes a built-in interactive ROI calculator.
* **Orchestrated Teardown:** Automated destruction wipes the infrastructure from existence upon PR closure, leaving no abandoned preview apps or zombie servers.

---

## 🛠️ Local Deployment Setup

> **Note:** Velzion is entirely containerized. You only need **Docker** installed.

### 1. Clone the Repository

    git clone https://github.com/Parth2496Singh/VELZION.git
    cd VELZION

### 2. Configure Environment Variables
Copy the provided safe environment template. Because Velzion uses IAM Roles, **you do not need AWS keys here.**

    cp backend/.env.example backend/.env

*(Open `backend/.env` and fill in your Django secret key and database configurations).*

### 3. Launch the Mothership
Boot the entire multi-container architecture (PostgreSQL, n8n, Django API, React, Nginx) with a single command:

    docker compose up --build -d

Access the platform at `http://localhost:5173` or `http://54.86.145.100/` (or your EC2 public IP).

---

## 🔐 Platform Configuration (OAuth & IAM)

To make Velzion fully autonomous, you must configure its integrations.

### Step 1: GitHub OAuth Setup (Authentication)
1. Go to your GitHub Settings -> **Developer Settings** -> **OAuth Apps**.
2. Create a new app. Set the **Homepage URL** to your Velzion domain and the **Callback URL** to `http://http://54.86.145.100/auth/github/callback`.
3. Generate a Client Secret.
4. Add the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to your `backend/.env` file and restart Docker.

### Step 2: AWS Cross-Account IAM Binding (The Keyless Engine)
1. Log into the Velzion Dashboard and navigate to the **Security & IAM** tab.
2. Click **Launch AWS CloudFormation**. This will open your AWS console and securely deploy the `VelzionExecutionRole`.
3. Copy the outputted Role ARN (e.g., `arn:aws:iam::123456789012:role/VelzionExecutionRole`).
4. In the Velzion Dashboard, paste your target GitHub Repository URL and the newly generated Role ARN. Click **Securely Save Integration**.

### Step 3: GitHub Webhook Setup (The Trigger)
1. Navigate to the GitHub repository you want to deploy PRs from.
2. Go to **Settings** -> **Webhooks** -> **Add webhook**.
3. **Payload URL:** `http://http://54.86.145.100/n8n/webhook/zegion-pr` (For creating environments).
4. **Content type:** `application/json`
5. Select **Let me select individual events** -> Check **Pull requests**.
6. Save the webhook. *(Repeat this process for the `zegion-destroy` endpoint).*

---

## 💻 Usage & Automation

Once configured, Velzion is entirely hands-off. 

1. **Deploying:** Simply create a Pull Request in your connected GitHub repository. 
2. **Monitoring:** Open the Velzion Dashboard and navigate to **Active Deployments**. You will see the pipeline state shift to `PROVISIONING`.
3. **Viewing:** Once the AWS Network Interface attaches, a Live URL will appear on the dashboard. Click it to view your fully isolated preview environment.
4. **FinOps Tracking:** Watch the live telemetry widget on the dashboard calculate your exact Spot savings in real-time against On-Demand pricing.
5. **Destroying:** Merge or close the Pull Request on GitHub. Velzion will automatically catch the event, shift the status to `DESTROYING...`, and terminate the AWS EC2 instance. *(Manual override termination is also available via the dashboard).*

---

### 📄 License
This project is licensed under the MIT License.
