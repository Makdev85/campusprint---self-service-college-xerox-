# Cloud-Native Capstone Deployment & Live Demonstration Guide
## Project: Campus Xerox — Self-Service College Printing Kiosk

This guide provides the complete, step-by-step implementation for your Capstone Project based on the **Capstone Project Briefing: Cloud-Native Application Deployment, CI/CD Automation & Observability**.

---

## 1. Application & Solution Overview

- **Problem Solved**: College students waste substantial time walking to external commercial Xerox shops and waiting in long queues during exam deadlines.
- **Application Purpose**: A self-service campus Xerox kiosk web application featuring a direct 5-step linear workflow:
  `1. Select College` → `2. Select Campus Kiosk` → `3. Upload Files (Max 8)` → `4. UPI Payment` → `5. Final Xerox Output & Secure PIN Collection`.
- **Cloud-Native Value**: The application is containerized with multi-stage Docker builds, automated via GitHub Actions CI/CD, deployed on Kubernetes with Horizontal Pod Autoscaling (HPA), monitored through Prometheus, and visualized via Grafana dashboards.

---

## 2. End-to-End Architecture Diagram

```
                             +------------------------+
                             |   Developer Git Push   |
                             +-----------+------------+
                                         |
                                         v
                         +-------------------------------+
                         |   GitHub Actions CI/CD        |
                         |   - Automated Lint & Test     |
                         |   - Multi-stage Docker Build  |
                         +-------+---------------+-------+
                                 |               |
               Docker Image Push |               | Success / Failure Webhook
                                 v               v
               +-----------------------+   +---------------------------+
               |  Docker Hub Registry  |   | Slack / Discord / Teams   |
               |  (campus-xerox:latest)|   | Instant Notification      |
               +-----------+-----------+   +---------------------------+
                           |
            k8s Pull Image |
                           v
+-------------------------------------------------------------------------+
|                      KUBERNETES CLUSTER ENVIRONMENT                     |
|                                                                         |
|   +-------------------+              +-------------------------------+  |
|   |   Ingress / LB    | ------------>|  Campus Xerox Service (Port 80)|  |
|   +-------------------+              +---------------+---------------+  |
|                                                      |                  |
|                                  +-------------------+----------------+ |
|                                  |                   |                | |
|                                  v                   v                v |
|                           +-------------+     +-------------+    [...]  |
|                           |  Pod 1 (50m)|     |  Pod 2 (50m)|    (Max 6)|
|                           +------+------+     +------+------+           |
|                                  |                   |                  |
|                                  +---------+---------+                  |
|                                            | Metric Scrape              |
|                                            v                            |
|                            +-------------------------------+            |
|                            |  Kubernetes Metrics Server    |            |
|                            +---------------+---------------+            |
|                                            |                            |
|             +------------------------------+                            |
|             | CPU > 50% Threshold                                       |
|             v                                                           |
|   +-------------------+                                                 |
|   |   HPA Controller  | ===> Auto-scales Deployment Replicas (2 -> 6)   |
|   +-------------------+                                                 |
|                                                                         |
|   +-------------------+              +-------------------------------+  |
|   |    Prometheus     | <----------  | Metrics Collection (cAdvisor) |  |
|   +---------+---------+              +-------------------------------+  |
|             |                                                           |
|             v                                                           |
|   +-------------------+                                                 |
|   | Grafana Dashboard | ===> Real-time CPU, Memory & Pod Scaling Visuals|
|   +-------------------+                                                 |
+-------------------------------------------------------------------------+
```

---

## 3. Project File Structure for Deployment

Your repository contains all required deployment configurations:

```
├── Dockerfile                  # Multi-stage production build (Node.js -> Nginx)
├── nginx.conf                  # Nginx config with /healthz and SPA routing
├── .dockerignore               # Optimized Docker build context
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # Push-triggered CI/CD with Docker Hub & Slack
├── k8s/
│   ├── namespace.yaml          # Isolated "campus-xerox" namespace
│   ├── deployment.yaml         # Deployment with CPU requests (50m) for HPA
│   ├── service.yaml            # LoadBalancer / NodePort service
│   └── hpa.yaml                # HPA: min 2, max 6, target 50% CPU
├── monitoring/
│   └── grafana-dashboard.json  # Importable Grafana dashboard for live demo
└── scripts/
    └── stress-test.sh          # Load generation script for HPA demonstration
```

---

## 4. Step-by-Step Deployment Instructions

### Step 1: Initialize Git & Push to GitHub

1. Initialize git and commit all project files:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Campus Xerox application with Cloud-Native manifests"
   ```
2. Create a new repository on your GitHub account (`campus-xerox`).
3. Set your remote and push to `main`:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/campus-xerox.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Configure GitHub Repository Secrets for CI/CD

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

1. `DOCKERHUB_USERNAME`: Your Docker Hub account username (e.g., `mohammedmustafa`).
2. `DOCKERHUB_TOKEN`: Your Docker Hub Personal Access Token (created at [Docker Hub Account Settings → Security](https://hub.docker.com/settings/security)).
3. `NOTIFICATION_WEBHOOK_URL` *(Mandatory for Deliverable B)*:
   - **Slack**: Create an Incoming Webhook in your Slack workspace.
   - **Discord**: Channel Settings → Integrations → Webhooks → Copy Webhook URL (add `/slack` to the end of Discord URLs to accept Slack JSON format).
   - **Microsoft Teams**: Create a Connector Webhook in your Teams channel.

*Once added, any `git push` to `main` will trigger the pipeline, build the container image, push to Docker Hub, and send an instant notification!*

---

### Step 3: Set Up Your Kubernetes Cluster

You can use **Minikube** (local, free, reliable for live demo), **Kind**, or Cloud Kubernetes (**AWS EKS / GCP GKE / Azure AKS**):

#### If Using Minikube (Recommended for Presentations):
```bash
# 1. Start Minikube with sufficient resources for monitoring
minikube start --cpus=4 --memory=8192 --driver=docker

# 2. Enable Metrics Server (CRITICAL for CPU-based HPA scaling!)
minikube addons enable metrics-server

# Verify metrics server is working (takes ~60 seconds to initialize)
kubectl top nodes
```

---

### Step 4: Deploy the Application & HPA

1. Edit `k8s/deployment.yaml` and replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username.
2. Apply all Kubernetes manifests:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/hpa.yaml
   ```
3. Verify that the deployment and HPA are initialized:
   ```bash
   kubectl get pods -n campus-xerox
   kubectl get hpa -n campus-xerox
   ```
   *You should see 2 pods in `Running` state and HPA showing `cpu: 0%/50%`.*

4. Access the application in your browser:
   ```bash
   # In Minikube:
   minikube service campus-xerox-service -n campus-xerox
   ```

---

### Step 5: Install Prometheus & Grafana Monitoring

Using Helm is the industry-standard approach for the Capstone:

```bash
# 1. Add Prometheus Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# 2. Install kube-prometheus-stack (includes Prometheus, Grafana, Node Exporter, Alertmanager)
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# 3. Verify monitoring pods are running
kubectl get pods -n monitoring
```

#### Accessing Grafana:
```bash
# Get the Grafana admin password (default username is 'admin')
kubectl get secret --namespace monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo

# Port-forward Grafana to localhost:3000
kubectl port-forward --namespace monitoring svc/monitoring-grafana 3000:80
```

1. Open your browser to `http://localhost:3000`.
2. Login with `admin` and the decoded password above.
3. Go to **Dashboards** → **New** → **Import**.
4. Upload or paste the contents of `monitoring/grafana-dashboard.json`.
5. Click **Import**. You now have a real-time observability dashboard showing:
   - Active Application Pod Replicas
   - Pod CPU Utilization vs 50% HPA Threshold
   - Pod Memory Working Set
   - Inbound Network Traffic

---

## 5. Live Demonstration Execution Script (For the Evaluator)

Follow this exact sequence during your presentation:

### Step A: Demonstrate CI/CD Pipeline
1. Make a small visual edit (e.g., in `src/components/Navbar.tsx`).
2. Commit and push:
   ```bash
   git commit -am "chore: trigger CI/CD pipeline build for live demo"
   git push origin main
   ```
3. Open GitHub repository → **Actions** tab. Show the workflow running in real-time.
4. Show the Docker Hub repository updated with the new image tag.
5. Show the success notification received in Slack / Discord / Teams.

---

### Step B: Demonstrate Application Functionality
1. Open the deployed application URL.
2. Walk through the 5 steps:
   - **Step 1**: Select College (e.g. *IIT Delhi*).
   - **Step 2**: Select Campus Printer (e.g. *Central Library Kiosk #01*).
   - **Step 3**: Upload files (show upload limit enforcing up to 8 files, configure B&W/Color and Duplex).
   - **Step 4**: Payment via UPI (show dynamic QR code and 1-click test simulation).
   - **Step 5**: Final Xerox Output (show real-time printing animation, pickup PIN generation, and unlocked collection drawer).

---

### Step C: Demonstrate Horizontal Pod Autoscaling (HPA) Live Under Load
1. Open two split terminal windows side-by-side with your Grafana dashboard:
   - **Terminal 1**: Watch HPA and Pod status:
     ```bash
     kubectl get hpa,pods -n campus-xerox -w
     ```
   - **Terminal 2**: Start the stress test load generator:
     ```bash
     chmod +x scripts/stress-test.sh
     ./scripts/stress-test.sh
     ```

2. **Observe the Auto-scaling in Real-Time**:
   - Within 30–60 seconds, the load generator drives CPU utilization past the 50% target (e.g. `120%/50%`).
   - The HPA controller automatically triggers scale-out:
     ```
     campus-xerox-deployment   2 -> 4 -> 6 replicas
     ```
   - Point out the new pods transitioning from `ContainerCreating` to `Running` in Terminal 1.
   - Point out the replica count step-up graph and CPU curve jumping on your **Grafana dashboard**.

3. **Demonstrate Scale-Down**:
   - Stop the stress test:
     ```bash
     kubectl delete pod load-generator -n campus-xerox
     ```
   - Watch CPU utilization drop back down to `<5%`.
   - After the stabilization period, explain that Kubernetes safely scales replicas back down to `minReplicas: 2`.

---

## 6. Answers to Common Technical Questions

- **Q: Why does HPA require resource requests?**
  *A: Kubernetes HPA calculates target utilization percentages against `resources.requests.cpu`. If requests are omitted, HPA cannot compute percentage metrics and will display `<unknown>`.*

- **Q: What is the difference between Metrics Server and Prometheus in this architecture?**
  *A: Metrics Server is an in-memory, lightweight metric pipeline designed specifically for Kubernetes core controllers (like HPA and VPA). Prometheus is a full-featured time-series database and observability system designed for long-term historical storage, complex querying (PromQL), alerting, and dashboard visualization via Grafana.*

- **Q: How does the application handle sudden traffic spikes?**
  *A: The HPA configuration includes a custom `scaleUp` policy allowing rapid scale-out within 15 seconds, while `scaleDown` uses a stabilization window to prevent "flapping" (rapid oscillation between scaling up and down).*
