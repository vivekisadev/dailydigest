export const DEVOPS_TRACKS = [
  {
    "id": 0,
    "label": "Core Foundations",
    "sublabel": "Linux, Git, Docker, CI/CD",
    "color": "#A78BFA",
    "bg": "rgba(167,139,250,0.13)",
    "icon": "🏗️"
  },
  {
    "id": 1,
    "label": "Modern Trends",
    "sublabel": "GitOps, DevSecOps, AI, Platform",
    "color": "#6EE7B7",
    "bg": "rgba(110,231,183,0.13)",
    "icon": "🚀"
  },
  {
    "id": 2,
    "label": "Advanced Cloud & Orchestration",
    "sublabel": "K8s, IaC, Observability",
    "color": "#60A5FA",
    "bg": "rgba(96,165,250,0.13)",
    "icon": "☁️"
  }
];

export const DEVOPS_RESOURCES = {
  "Linux Fundamentals": ["https://linuxcommand.org/tlcl.php", "https://man7.org/linux/man-pages/"],
  "Bash Scripting": ["https://www.gnu.org/software/bash/manual/", "https://www.shellcheck.net/"],
  "Networking Basics": ["https://www.cloudflare.com/learning/network-layer/what-is-a-computer-network/"],
  "Git Deep Dive": ["https://git-scm.com/book/en/v2", "https://learngitbranching.js.org/"],
  "GitOps Principles": ["https://opengitops.dev/", "https://argo-cd.readthedocs.io/"],
  "Secrets Management": ["https://developer.hashicorp.com/vault/docs", "https://gitleaks.io/"],
  "Docker Core": ["https://docs.docker.com/get-started/", "https://docs.docker.com/compose/"],
  "Container Security": ["https://aquasecurity.github.io/trivy/", "https://docs.sigstore.dev/"],
  "Container Registries": ["https://docs.docker.com/docker-hub/", "https://docs.aws.amazon.com/ecr/"],
  "GitHub Actions": ["https://docs.github.com/en/actions"],
  "Jenkins / GitLab CI": ["https://www.jenkins.io/doc/", "https://docs.gitlab.com/ee/ci/"],
  "Testing in CI": ["https://docs.sonarqube.org/"],
  "Kubernetes Fundamentals": ["https://kubernetes.io/docs/home/", "https://killercoda.com/playgrounds/scenario/kubernetes"],
  "Helm & Package Management": ["https://helm.sh/docs/", "https://artifacthub.io/"],
  "Kubernetes Security (RBAC)": ["https://kubernetes.io/docs/concepts/security/", "https://kyverno.io/docs/"],
  "Terraform": ["https://developer.hashicorp.com/terraform/docs", "https://registry.terraform.io/"],
  "Ansible": ["https://docs.ansible.com/", "https://galaxy.ansible.com/"],
  "OpenTofu & IaC Trends": ["https://opentofu.org/docs/", "https://www.pulumi.com/docs/"],
  "Prometheus & Grafana": ["https://prometheus.io/docs/", "https://grafana.com/docs/grafana/latest/"],
  "OpenTelemetry": ["https://opentelemetry.io/docs/", "https://grafana.com/docs/loki/latest/"],
  "Cloud Fundamentals (AWS)": ["https://docs.aws.amazon.com/", "https://aws.amazon.com/getting-started/"],
  "Platform Engineering & IDPs": ["https://backstage.io/docs/", "https://platformengineering.org/"],
  "AI-Assisted DevOps": ["https://docs.github.com/en/copilot", "https://www.datadoghq.com/product/aiops/"],
  "DevSecOps & Supply Chain": ["https://slsa.dev/", "https://anchore.com/syft/"],
  "eBPF & Advanced Networking": ["https://docs.cilium.io/", "https://ebpf.io/what-is-ebpf/"],
  "Service Mesh (Istio/Linkerd)": ["https://istio.io/latest/docs/", "https://linkerd.io/2.16/overview/"],
  "Chaos Engineering": ["https://chaos-mesh.org/docs/", "https://litmuschaos.io/"]
};

// [week, day, track_id, title, subtitle, duration, difficulty, priority, description_html, problems, resources]
export const DEVOPS_RAW = [
  // WEEK 1
  [1, 0, 0, "Linux Fundamentals", "Linux & Shell", 2, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🐧 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Master the Linux filesystem hierarchy, file permissions (chmod/chown), process management (ps, kill, systemctl), user management, and the /etc, /var, /proc directories. Focus on Ubuntu/Debian and RHEL/CentOS variants since both are widely used in DevOps environments.</p>
    </div>`, [], []],
  [1, 1, 0, "Bash Scripting", "Linux & Shell", 2, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">⚡ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Write automation scripts: variables, loops, conditionals, functions, stdin/stdout/stderr, pipes, and error handling. Learn to write idempotent scripts that are safe to run multiple times. Automate tasks like backups, log rotation, and health checks.</p>
    </div>`, [], []],
  [1, 2, 0, "Networking Basics", "Linux & Shell", 2, "Hard", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🌐 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Understand TCP/IP, DNS, HTTP/HTTPS, ports, subnets, CIDR notation, firewalls, and NAT. Practice with tools: curl, netstat, ss, nmap, traceroute, dig. This underpins every cloud and container networking concept you'll encounter.</p>
    </div>`, [], []],

  // WEEK 2
  [2, 0, 0, "Git Deep Dive", "Git & Version Control", 2, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🔀 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Go beyond basic commits. Learn branching strategies (Git Flow, trunk-based), interactive rebase, cherry-pick, stash, bisect for debugging, hooks (pre-commit, pre-push), and signing commits with GPG. Essential for any team environment.</p>
    </div>`, [], []],
  [2, 1, 1, "GitOps Principles", "Git & Version Control", 2, "Medium", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🔐 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">GitOps uses Git as the single source of truth for infrastructure and application deployments. Understand declarative configs, pull-based vs push-based deployments, and reconciliation loops. Tools like ArgoCD and Flux implement this pattern.</p>
    </div>`, [], []],
  [2, 2, 1, "Secrets Management", "Git & Version Control", 2, "Hard", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🛡️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Never commit secrets. Learn to use .gitignore properly, detect leaked secrets with tools like Gitleaks/TruffleHog, and understand secret backends (HashiCorp Vault, AWS Secrets Manager, GitHub Secrets). This is now a compliance requirement in most orgs.</p>
    </div>`, [], []],

  // WEEK 3
  [3, 0, 0, "Docker Core", "Docker & Containers", 3, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🐳 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Learn the container lifecycle: images, containers, volumes, networks. Write production-quality Dockerfiles using multi-stage builds to reduce image size. Understand layer caching, best practices for security (non-root users, minimal base images), and Docker Compose for local dev.</p>
    </div>`, [], []],
  [3, 1, 1, "Container Security", "Docker & Containers", 2, "Hard", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🔍 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Scan images for vulnerabilities using Trivy or Snyk. Understand AppArmor, seccomp profiles, and read-only file systems. Learn image signing with Cosign (part of Sigstore). The 'shift left security' movement makes this essential from day one, not an afterthought.</p>
    </div>`, [], []],
  [3, 2, 0, "Container Registries", "Docker & Containers", 1, "Easy", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🗄️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Understand Docker Hub, GitHub Container Registry (ghcr.io), AWS ECR, and Google Artifact Registry. Learn tagging strategies (semantic versioning, SHA-based), image promotion workflows across environments (dev → staging → prod), and registry authentication.</p>
    </div>`, [], []],

  // WEEK 4
  [4, 0, 0, "GitHub Actions", "CI/CD Pipelines", 2, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">⚙️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Build end-to-end pipelines: triggers (push, PR, schedule), jobs, steps, runners, matrix builds for multi-OS testing. Learn to write reusable workflows, use the Actions Marketplace, cache dependencies, and publish artifacts. The industry standard for most teams today.</p>
    </div>`, [], []],
  [4, 1, 0, "Jenkins / GitLab CI", "CI/CD Pipelines", 2, "Medium", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🚀 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Jenkins remains dominant in enterprises. Learn Jenkinsfile (declarative syntax), shared libraries, plugin ecosystem, and agent configuration. GitLab CI is widely used in self-hosted orgs — understand .gitlab-ci.yml, stages, artifacts, and environments.</p>
    </div>`, [], []],
  [4, 2, 0, "Testing in CI", "CI/CD Pipelines", 1, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🧪 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Integrate unit, integration, and end-to-end tests into pipelines. Understand test parallelisation, flaky test management, code coverage gates, and quality gates with SonarQube. Learn to fail fast: tests should block deployments when they fail.</p>
    </div>`, [], []],

  // WEEK 5
  [5, 0, 2, "Kubernetes Fundamentals", "Kubernetes", 4, "Hard", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">☸️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Understand pods, deployments, services, configmaps, secrets, namespaces, and the control plane (API server, etcd, scheduler, controller manager). Practice with minikube or kind locally. Learn kubectl deeply — this is your primary interface to any cluster.</p>
    </div>`, [], []],
  [5, 1, 2, "Helm & Package Management", "Kubernetes", 2, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">⚖️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Helm is Kubernetes' package manager. Learn to install, upgrade, and rollback releases. Write your own chart for a simple app: Chart.yaml, values.yaml, templates with Go templating. Understand Helmfile for managing multiple charts declaratively.</p>
    </div>`, [], []],
  [5, 2, 1, "Kubernetes Security (RBAC)", "Kubernetes", 2, "Hard", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🔒 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Role-Based Access Control, network policies, pod security standards (replacing deprecated PSPs), service accounts, OPA/Kyverno for policy enforcement. CIS Kubernetes Benchmark is the industry standard security checklist — read through it to understand what 'secure by default' means.</p>
    </div>`, [], []],

  // WEEK 6
  [6, 0, 2, "Terraform", "Infrastructure as Code", 3, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🏗️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Provision cloud infrastructure with code. Learn HCL syntax, providers (AWS/GCP/Azure), state management (remote state in S3/GCS), modules for reusability, workspaces for environments, and terraform plan/apply/destroy workflow. Terraform Cloud for team collaboration.</p>
    </div>`, [], []],
  [6, 1, 2, "Ansible", "Infrastructure as Code", 2, "Medium", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🔧 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Configuration management for servers. Learn inventory, playbooks, roles, handlers, templates (Jinja2), and idempotency. Ansible is agentless — it uses SSH, making it easy to start with. Use it for OS hardening, package installation, and application configuration.</p>
    </div>`, [], []],
  [6, 2, 1, "OpenTofu & IaC Trends", "Infrastructure as Code", 1, "Easy", "Low", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🌿 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">OpenTofu is the open-source fork of Terraform (post BSL license change) and is rapidly gaining adoption. Understand the landscape: Pulumi (IaC in real programming languages), CDK (AWS Cloud Development Kit), and Crossplane (K8s-native IaC). Know which tool fits which problem.</p>
    </div>`, [], []],

  // WEEK 7
  [7, 0, 2, "Prometheus & Grafana", "Observability & Cloud", 2, "Medium", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">📊 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">The de-facto monitoring stack. Prometheus scrapes metrics endpoints; learn PromQL for querying (rate, histogram_quantile, by/without). Grafana for dashboards and alerting. Set up the kube-prometheus-stack Helm chart — this gives you full cluster observability in minutes.</p>
    </div>`, [], []],
  [7, 1, 1, "OpenTelemetry", "Observability & Cloud", 2, "Hard", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🔭 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">The new standard for observability instrumentation — unifying logs, metrics, and traces under one framework. Learn the three pillars: traces (Jaeger/Zipkin), metrics (Prometheus), logs (Loki/ELK). OpenTelemetry is now the CNCF's most active project after Kubernetes.</p>
    </div>`, [], []],
  [7, 2, 2, "Cloud Fundamentals (AWS)", "Observability & Cloud", 4, "Hard", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">☁️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Learn the core AWS services a DevOps engineer touches daily: EC2, VPC, IAM, S3, RDS, EKS, ECR, CloudWatch, Route53, and ALB/NLB. Understand IAM roles vs users, least-privilege policies, and VPC design (public/private subnets, NAT gateways). Aim for AWS SAA level of knowledge.</p>
    </div>`, [], []],

  // WEEK 8
  [8, 0, 1, "Platform Engineering & IDPs", "Modern Trends", 2, "Medium", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🏛️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Platform Engineering is the evolution of DevOps — building Internal Developer Platforms (IDPs) so developers self-serve. Key tools: Backstage (developer portal), Port, Kratix. Learn about the DORA metrics (deploy frequency, lead time, MTTR, change failure rate) as the north star for platform teams.</p>
    </div>`, [], []],
  [8, 1, 1, "AI-Assisted DevOps", "Modern Trends", 1, "Easy", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🤖 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">The biggest shift in 2024–25: AI tools in every part of the DevOps lifecycle. GitHub Copilot for writing pipelines and IaC. AI-powered anomaly detection in observability (Datadog, Dynatrace). LLM-based runbook automation and incident response. Learn to evaluate and integrate these tools critically.</p>
    </div>`, [], []],
  [8, 2, 1, "DevSecOps & Supply Chain", "Modern Trends", 2, "Hard", "High", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🛡️ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Security integrated into every pipeline stage. Learn SAST (static analysis), DAST (dynamic analysis), dependency scanning, SBOM (Software Bill of Materials) generation with Syft, and SLSA framework for supply chain integrity. Post-SolarWinds and Log4j, this is now non-negotiable at enterprise scale.</p>
    </div>`, [], []],
  [8, 3, 1, "eBPF & Advanced Networking", "Modern Trends", 3, "Hard", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">⚡ Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">eBPF is rewriting Linux observability and networking. Cilium (eBPF-based CNI) is replacing iptables-based networking in Kubernetes. Understand what eBPF enables: zero-overhead tracing, network policy enforcement, and security without sidecars. Falco for runtime security uses it heavily.</p>
    </div>`, [], []],
  [8, 4, 1, "Service Mesh (Istio/Linkerd)", "Modern Trends", 2, "Hard", "Medium", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">📦 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Service meshes handle mTLS, traffic management, observability, and resilience (retries, circuit breakers) at the infrastructure layer. Istio is feature-rich but complex; Linkerd is lighter. With the rise of microservices, understanding the trade-offs here is a key seniority signal.</p>
    </div>`, [], []],
  [8, 5, 1, "Chaos Engineering", "Modern Trends", 1, "Medium", "Low", `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🔁 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">Deliberately inject failures to test resilience. Learn principles from Netflix's Chaos Monkey. Tools: Chaos Mesh and LitmusChaos for Kubernetes. Design controlled experiments: hypothesis → inject fault → observe → fix. This is how SRE teams build confidence in systems before incidents reveal weaknesses.</p>
    </div>`, [], []]
];
