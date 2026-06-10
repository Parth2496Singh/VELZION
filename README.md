
<div align="center">

# 🚀 Project Velzion
**The Open-Source BYOC Control Plane for Automated Deployments & Ephemeral Environments**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Control Plane](https://img.shields.io/badge/Control_Plane-Django_%7C_React-blue.svg)](#)
[![Orchestration Engine](https://img.shields.io/badge/Orchestrator-n8n-FF6600.svg)](#)
[![Cloud Infrastructure](https://img.shields.io/badge/Cloud-AWS_%7C_BYOC-FF9900.svg)](#)
[![GitOps](https://img.shields.io/badge/GitOps-ArgoCD_%7C_Helm-purple.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

</div>
Modern cloud development is caught in a paradox: developers crave the flawless, zero-configuration deployment experiences of modern PaaS providers, while startups face brutal pricing markups, lack of deep database isolation, and severe data privacy risks on shared platforms. 

**Velzion resolves this tension.** As an enterprise-grade, open-source Bring Your Own Cloud (BYOC) DevOps Control Plane, Velzion acts strictly as an orchestration brain—it owns zero compute. It turns a company’s private AWS infrastructure into a self-hosted, automated app platform, guaranteeing 100% data residency and zero vendor premium markups.

</div>

---

## 🛑 The Problem

Small to mid-sized engineering teams struggle with two massive operational bottlenecks:
1. **The PaaS Financial Markup Trap:** Hosted platforms charge massive premium markups over raw AWS compute costs, draining early-stage startup capital.
2. **The Persistent Staging Server Waste:** To avoid high bills, teams use a single, shared staging server. This creates massive developer friction: migration conflicts, overwritten branches, blocked QA cycles, and thousands of dollars wasted on idle compute hours.

---

## 🚂 The Solution: Dual-Engine BYOC Architecture

Velzion orchestrates infrastructure directly inside the user's secure AWS environment using a decoupled, event-driven architecture split into two execution pipelines:

* 🏗️ **Velzard (The Production Engine):** For core workloads requiring 24/7 high availability, Velzard automates infrastructure provisioning directly inside the user's AWS account. It configures dedicated EC2 On-Demand resources, Nginx reverse proxy routing, and launches the application via production-hardened configurations.
* 🌪️ **Zegion (The Ephemeral Preview Engine):** Eliminates the single staging server bottleneck entirely. Powered by **n8n** as the automation engine, Zegion listens for GitHub Pull Request events, dynamically boots ultra-cheap AWS Spot instances, compiles code using CNCF Buildpacks, posts a live wildcard preview link to the PR comments, and tears the infrastructure down the second the PR is closed.

---

## 💡 Operational Innovations & FinOps Strategy

* **Two-Tier Zero-Cost Networking:** Tier 1 Terraform provisions a custom VPC with a pure Public Subnet and Internet Gateway. Because it avoids NAT Gateways, idle networking costs exactly **$0.00**. Tier 2 dynamically drops ephemeral Spot instances into this pre-built VPC.
* **Deterministic CNCF Buildpacks:** Zegion utilizes the official CNCF `pack` CLI and `paketobuildpacks/builder-jammy-base` to automatically detect repository language and compile an optimized, OCI-compliant container image—bypassing manual Dockerfiles entirely.
* **Scale-to-Zero Preview Lifecycle:** Ephemeral environments have a strict TTL expiration. When a PR sits idle, n8n auto-destructs the Spot instance and updates its state to `SLEEPING`, guaranteeing a true zero-dollar idle cost profile.
* **ChatOps & Security by Obscurity:** PR links utilize cryptographically hashed wildcard URLs (e.g., `pr-42-x7f9a2p.velzion.dev`). To wake a sleeping PR, developers simply type `/velzion wake` in the GitHub PR comments, and a fresh instance boots automatically within 60 seconds.

---

## 🛠️ Tech Stack

Velzion integrates a diverse set of modern tooling to synthesize application orchestration, infrastructure automation, and continuous delivery into a single platform.

### Control Plane 
* **Backend:** Django, Django REST Framework (DRF), Python
* **Frontend:** React, Vite, Tailwind CSS
* **Database (State):** PostgreSQL
* **Event Broker / Workflow Engine:** n8n (Node-Based Workflow Automation)

### Infrastructure Engine 
* **Infrastructure as Code (IaC):** Terraform, AWS CloudFormation (IAM Trust Delegation)
* **Cloud Provider:** Amazon Web Services (AWS) - VPC, EC2 On-Demand, EC2 Spot Instances, S3 (State Backend)
* **Compute Provisioning:** AWS STS (AssumeRole Credentials), Bash (`user_data.sh`)
* **Compilation:** CNCF Buildpacks (`pack` CLI)

### DevOps & Platform Engineering 
* **Containerization:** Docker, Docker Compose
* **Orchestration:** Kubernetes (Amazon EKS)
* **CI/CD Pipeline:** Jenkins (CI), ArgoCD (GitOps CD), Helm
* **Security & Observability:** Trivy (Vulnerability Scanning), SonarQube (Static Analysis), AWS CloudWatch

### The 1-Click Trust Model (Security)
Velzion **never asks users to input raw AWS Access Keys**. 
For deployment access, the React frontend redirects users to launch a pre-configured CloudFormation stack in their AWS console (with the required IAM policies securely hosted in an S3 bucket). This stack creates an IAM Role that explicitly trusts the central Velzion AWS account. When n8n executes Terraform, it calls AWS STS to assume the role, generating short-lived cryptographic tokens valid only for the deployment duration.


## 🏛️ System Architecture

### Backend Structure & Modular Boundaries
Velzion enforces strict domain boundaries using a **Modular Monolith** architecture built on Django, exposing strict RESTful endpoints.
* `backend/users/`: Handles GitHub OAuth and JWT issuance.
* `backend/velzard/`: Manages the persistent BYOC deployments and IAM state.
* `backend/zegion/`: The ingestion point for GitHub webhooks and TTL logic.

### Database Strategy
Django acts as the central State Machine backed by a single **PostgreSQL** database. Multi-tenancy isolation is enforced logically via tenant foreign keys, tracking repository metadata, VPC IDs, and AWS Role ARNs.

### The 1-Click Trust Model (Security)
Velzion **never asks users to input raw AWS Access Keys**. 
For deployment access, the React frontend redirects users to launch a pre-configured CloudFormation stack in their AWS console. This stack creates an IAM Role that explicitly trusts the central Velzion AWS account. When n8n executes Terraform, it calls AWS STS to assume the role, generating short-lived cryptographic tokens valid only for the deployment duration.

---

## 🐙 Zegion Orchestration Lifecycle

1. Developer opens a PR ➔ GitHub fires a webhook to the Django API.
2. Django writes `PROVISIONING` state to PostgreSQL and forwards the payload to n8n.
3. n8n executes Tier 2 Terraform using STS temporary credentials to boot an AWS EC2 Spot Instance.
4. The instance boots via `user_data.sh`, installs Docker/Git/pack CLI, clones the PR branch, and executes CNCF Buildpack compilation.
5. n8n queries the instance IP, maps the wildcard DNS proxy, and posts the live URL back to the PR comments.

---

## 📁 Repository Structure

Velzion is split across two primary repositories to enforce strict GitOps separation of concerns between Application Code and Infrastructure State.

### 1. Infrastructure Configuration [VELZION](https://github.com/Parth2496Singh/VELZION.git)
```text
velzion/
├── frontend/               # React SPA (Vite, Tailwind)
│   ├── src/pages/          # Velzard & Zegion Dashboards, FinOps, Auth
│   └── nginx.conf          # Reverse proxy configuration
├── backend/                # Django Control Plane
│   ├── core/               # Django Settings & DRF Configuration
│   ├── users/              # GitHub OAuth & User Profiles
│   ├── velzard/            # Production BYOC Engine & API
│   ├── zegion/             # Ephemeral Preview Engine & Webhooks
│   └── terraform/          # IaC configurations (main.tf, velzard_main.tf)
├── workflows/              # Exported n8n JSON pipelines (Zegion & Velzard)
├── docker-compose.yml      # Local development cluster orchestration
└── Jenkinsfile             # CI/CD Pipeline definition
```
### 2. Continuous Delivery [VELZION-GITOPS](https://github.com/Parth2496Singh/VELZION-GITOPS)
```text
velzion-gitops/
├── Chart.yaml              # Helm chart metadata and dependencies
├── gitops/                 # Continuous Delivery Configurations
│   ├── applicationset-velzion.yaml  # ArgoCD ApplicationSet definition
│   └── argocd-notifications-cm.yaml # Slack/Email deployment alerts
├── templates/              # Kubernetes Manifests (Helm Templates)
│   ├── backend-deployment.yaml      # Django control plane pods
│   ├── db-statefulset.yaml          # PostgreSQL persistent volume claims
│   ├── frontend-deployment.yaml     # React frontend pods
│   ├── ingress.yaml                 # Nginx ingress routing rules
│   ├── n8n-deployment.yaml          # n8n automation engine pods
│   └── services.yaml                # Internal cluster networking
└── values.yaml             # Environment-specific variable overrides
```
## ☸️ Control Plane Infrastructure & CI/CD
The core Velzion Control Plane operates as a cloud-native application deployed to Amazon EKS. Local development utilizes Docker Compose to orchestrate the monolith seamlessly.

**Continuous Integration**: Jenkins (Jenkinsfile) drives the DevSecOps pipeline, running SonarQube for static analysis and Trivy for container vulnerability scanning.

**Continuous Delivery**: Executed via ArgoCD monitoring the velzion-gitops repository. It pulls Helm manifested configurations directly into the EKS cluster via a strict GitOps model.

**State Management**: Terraform execution states are securely bound to an AWS S3 remote backend to protect against pod restarts.

**Observability**: System logs and container metrics are piped to AWS CloudWatch.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
