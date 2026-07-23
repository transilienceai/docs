# Apps catalog

A reference to every [app](apps.md) you can run: what each one does, what it looks at, what you get back, and which compliance frameworks it covers.

## How apps work (at a glance)

Every app runs on the Transilience platform. It reads from the data sources you've connected — most often your AWS account, read-only — and writes its results to that [session's](sessions.md) [outputs](outputs.md): a mix of interactive **dashboards**, human-readable **reports** (markdown, PDF, Word, or Excel), and downloadable **data files** (JSON or CSV). You read them on the session's **Summary** and **Files** tabs, ask questions about them in a [thread](threads.md), [save](../workflows/save-an-artifact.md) them as artifacts, or [schedule](scheduling.md) the app to run again.

You don't build or configure apps yourself — Transilience maintains the catalog and it updates automatically. See [apps](apps.md) for how to browse and run them.

---

## Application index

| App | Category | One-liner |
|-----|----------|-----------|
| [pci-compliance-analysis](#pci-compliance-analysis) | Compliance | PCI-DSS v4.0 posture across all 12 requirement categories |
| [pci-dss-evidence-analyzer](#pci-dss-evidence-analyzer) | Compliance | Auditor-grade PCI v4.0.1 evidence collection + gap assessment |
| [soc2-readiness](#soc2-readiness) | Compliance | SOC 2 Type II readiness scoring of 55 controls |
| [evidence-reviewer](#evidence-reviewer) | Compliance | Bulk evidence ingestion mapped to any control matrix |
| [encryption-audit](#encryption-audit) | Compliance | Encryption-at-rest/in-transit audit across AWS services |
| [cloud-misconfig-scanner](#cloud-misconfig-scanner) | Compliance | S3/RDS/Lambda misconfiguration detection |
| [policy-engine](#policy-engine) | Governance | Branded policy authoring + multi-framework gap analysis |
| [iam-role-rightsize](#iam-role-rightsize) | IAM | Least-privilege recommendations from actual usage |
| [user-access-review](#user-access-review) | IAM | PCI-compliant periodic IAM access review (Word) |
| [siem-cloudtrail-analyzer](#siem-cloudtrail-analyzer) | SIEM | CloudTrail API audit-log threat detection |
| [siem-cloudwatch-analyzer](#siem-cloudwatch-analyzer) | SIEM | CloudWatch + VPC Flow anomaly detection |
| [siem-guardduty-analyzer](#siem-guardduty-analyzer) | SIEM | GuardDuty finding analysis + IOC extraction |
| [siem-event-correlator](#siem-event-correlator) | SIEM | Cross-source correlation + incident detection |
| [siem-soc-analyzer](#siem-soc-analyzer) | SIEM | Tiered L1/L2/L3 SOC analyst pipeline |
| [aws-monitor-guardduty](#aws-monitor-guardduty) | SIEM | Lightweight GuardDuty root-cause + risk scoring |
| [aws-log-analyzer](#aws-log-analyzer) | SIEM | Multi-source log aggregation + correlation |
| [pentest](#pentest) | Offensive | Multi-agent pentest framework, 50+ attack types |
| [cloud-attack-path-analysis](#cloud-attack-path-analysis) | Offensive | Attack-graph discovery with chokepoint analysis |
| [aws-vulnerability-prioritizer](#aws-vulnerability-prioritizer) | Offensive | ECR/Inspector CVE prioritization + impact simulation |
| [threat-radar-generation](#threat-radar-generation) | Offensive | Passive OSINT tech-stack threat radar |
| [network-diagram-curator](#network-diagram-curator) | Network | Topology diagrams, asset inventory, PCI scoping |
| [network-ruleset-review](#network-ruleset-review) | Network | PCI annual firewall/SG/NACL review (Word) |
| [devops-security-remediation](#devops-security-remediation) | Network | Find 0.0.0.0/0 rules + generate remediation scripts |
| [cloud-cost-monitor](#cloud-cost-monitor) | FinOps | Right-sizing, RI/SP optimization, anomaly detection |
| [devops-simulation-training](#devops-simulation-training) | Training | Gamified incident-response simulations |
| [tabletop-exercise](#tabletop-exercise) | Training | AI DR tabletop scenarios from real inventory |
| [phishing-simulator](#phishing-simulator) | Training | Gamified phishing-awareness academy |
| [security-dashboard-hub](#security-dashboard-hub) | Hub | Role-based aggregation of all app outputs |
| [custom-task](#custom-task) | Framework | Generic ad-hoc task + dashboard generator |

---

## Compliance & evidence

### pci-compliance-analysis

*A turnkey PCI-DSS assessment engine that converts a live AWS account into a scored compliance picture. It closes the gap between raw cloud configuration and the auditor's 12-requirement checklist, letting teams see exactly where they stand — and what to remediate — well before a QSA arrives.*

**What it does** — Analyzes your AWS infrastructure for PCI-DSS v4.0 compliance across all 12 requirement categories and produces an interactive scored dashboard.
**What it looks at** — EC2, RDS, S3, IAM, CloudTrail, AWS Config, KMS, GuardDuty, and Security Hub.
**What you get** — An interactive dashboard (compliance gauge, category breakdown, findings table), severity-classified findings with remediation, and a PCI compliance report.
**Frameworks** — PCI-DSS v4.0 (all 12 requirements).

### pci-dss-evidence-analyzer

*An auditor-facing workbench that automates the most laborious part of a PCI engagement: gathering evidence and reconciling it against 133 requirements. Scoping questions and asset uploads keep the assessment honest about what is genuinely in scope, while streamed AI verdicts and an evidence-grounded chat let reviewers interrogate every conclusion.*

**What it does** — Auditor-grade PCI-DSS v4.0.1 evidence collection, mapping, and gap assessment across a guided 5-phase workflow.
**What it looks at** — 20+ AWS services; an 11-question scoping questionnaire; optional asset inventory (CSV/XLSX) and auditor sample-set uploads.
**How it flows** — Start → collect AWS evidence (with scoping and asset uploads alongside) → map to requirements with in-scope vs. auto-not-applicable tallies → AI reviews each in-scope requirement → results across Overview, All Requirements, Raw Evidence, and an evidence-grounded Auditor Chat.
**What you get** — A 7-sheet Excel report, raw evidence organized by category, and snapshot history.
**Frameworks** — PCI-DSS v4.0.1 (133 requirements, Defined Approach matrix).

### soc2-readiness

*A pre-audit readiness check that scores an organization against all 55 SOC 2 Trust Service Criteria using evidence pulled directly from AWS. Built for the run-up to a Type II audit, it surfaces gaps early and produces an audit-ready workbook with full evidence traceability.*

**What it does** — SOC 2 Type II readiness assessment with evidence collection, control scoring, and audit-grade reporting with raw-evidence visibility.
**What it looks at** — AWS across 41 resource categories (IAM, KMS, S3, EC2 networking, logging, security services, backup, certificates); your organization name and assessment type; optional policy docs or screenshots.
**What you get** — An interactive readiness dashboard (scorecard, controls, evidence browser, auditor chat, missing-evidence requests), a 6-sheet Excel workbook, a markdown report, and raw evidence.
**Frameworks** — SOC 2 Type II (55 Trust Service Criteria controls).

### evidence-reviewer

*A framework-agnostic triage tool for compliance teams buried in screenshots, PDFs, and configuration dumps. It ingests hundreds of artifacts in the browser, fuzzy-matches them to whatever control matrix you upload, and renders a defensible per-control verdict.*

**What it does** — Ingests bulk compliance evidence (200–300+ files), maps it to your control matrix, and reviews each control against a chosen framework.
**What it looks at** — Drag-and-drop evidence (PDF, image, text, Excel, Word) and a CSV/JSON control matrix, with flexible field mapping.
**What you get** — A compliance dashboard with filtering, per-control verdicts and observations, a gap analysis, and CSV/JSON + markdown exports.
**Frameworks** — PCI-DSS v4.0.1, SOC 2 Type II, ISO 27001:2022, HIPAA, NIST 800-53 Rev 5, and custom.

### encryption-audit

*A focused sweep for unprotected data across the AWS estate, answering one high-stakes question — "is anything sensitive left unencrypted?" — across EBS, RDS, S3, DynamoDB, and KMS, at rest and in transit.*

**What it does** — Audits encryption status across AWS resources and surfaces anything unencrypted.
**What it looks at** — EBS volumes and snapshots, RDS instances, S3 buckets, DynamoDB tables, and KMS keys.
**What you get** — A dashboard highlighting unencrypted resources by service, plus audit and remediation reports.
**Frameworks** — PCI-DSS 3.4 / 4.1, HIPAA encryption, SOC 2.

### cloud-misconfig-scanner

*A targeted scanner for the misconfigurations behind most cloud breaches: public buckets, unlogged databases, over-exposed functions. It inspects S3, RDS, and Lambda and returns severity-ranked findings paired with concrete fixes.*

**What it does** — Identifies security misconfigurations across S3, RDS, and Lambda and generates remediation guidance.
**What it looks at** — S3 bucket policies/ACLs/encryption/public access, RDS logging/encryption/networking, and Lambda environment/roles/VPC/secrets.
**What you get** — Severity-ranked findings for each service, interactive dashboards, and remediation reports.
**Frameworks** — PCI-DSS 3.4 / 7.1 / 10.2; CIS AWS Foundations 2.1.x.

### policy-engine

*A document factory and reviewer for information-security policies. It authors brand-aligned policy sets from a 473-point control library and, in reverse, audits existing policies for framework-coverage gaps.*

**What it does** — Creates framework-aligned, branded policies and reviews existing policies for multi-framework gaps.
**What it looks at** — Your framework selection and organization details (name, logo for co-branding); for review mode, an existing policy PDF or Word doc.
**What you get** — **Create**: branded, multi-section PDF policies. **Review**: a gap-analysis workbook plus a PDF summary scoring missing controls by severity.
**Frameworks** — PCI-DSS v4.0.1 (203 sub-reqs), ISO 27001/27002:2022 (93 controls), SOC 2 TSC 2017 (90 criteria), HIPAA (49 specs).

---

## IAM & access

### iam-role-rightsize

*A least-privilege engine that confronts permission sprawl in AWS IAM. By contrasting what roles are allowed to do against what they actually use, it recommends precise reductions and flags roles safe to retire.*

**What it does** — Analyzes IAM roles and policies to find over-permissive access and produce right-sized recommendations and removal candidates.
**What it looks at** — Your IAM role inventory, Access Analyzer findings (unused permissions, external access), and CloudTrail usage patterns.
**What you get** — A risk heatmap dashboard, prioritized reduce/consolidate/remove recommendations with before/after policy comparison, and a compliance-mapped report.
**Frameworks** — PCI-DSS 7.1–7.2, CIS AWS 1.16/1.22, SOC 2 CC6.1/CC6.3, NIST AC-6.

### user-access-review

*An automation of the recurring access-recertification chore auditors demand. It compiles IAM identities, scrutinizes privilege breadth and MFA hygiene, and produces a sign-off-ready Word report.*

**What it does** — Runs a PCI-DSS v4.0 compliant periodic user access review and produces an audit-grade Word report.
**What it looks at** — Your IAM inventory (users, roles, policies, access keys, MFA); optional historical access data; the customer name and review period.
**What you get** — A 16-section Word report with color-coded risk tables, scoring, and remediation; an optional filterable dashboard; and JSON analysis files.
**Frameworks** — PCI-DSS v4.0 7.1/7.2, 8.1/8.2/8.3.

---

## SIEM & threat detection

The three source analyzers (CloudTrail, CloudWatch, GuardDuty) each normalize events to the industry-standard **Common Event Format (CEF)**; the **event-correlator** then combines all three for cross-source incident detection. The **soc-analyzer** is an independent tiered L1/L2/L3 pipeline.

### siem-cloudtrail-analyzer

*The control-plane sensor of the SIEM suite, mining CloudTrail for who-did-what across the account. It turns API audit logs into threat detections and a normalized event feed for downstream correlation.*

**What it does** — Collects, normalizes, and analyzes CloudTrail API audit logs with AI threat detection, IAM analysis, MITRE mapping, and 365-day retention.
**What it looks at** — CloudTrail API events and historical S3-stored logs, with IAM and Config for context.
**What you get** — A normalized event feed, IAM and authentication activity data, threat/IAM/compliance reports, and interactive dashboards.
**Frameworks** — PCI-DSS 10.x, NIST IA-2/AC-6, SOC 2 CC6.1.

### siem-cloudwatch-analyzer

*The network- and application-layer sensor of the SIEM suite. It mines CloudWatch and VPC Flow Logs for the anomalies signature tools miss — port scans, data exfiltration, command-and-control beacons.*

**What it does** — Collects and analyzes CloudWatch logs (VPC Flow, application, Lambda, ECS/EKS) with statistical anomaly detection and network threat analysis.
**What it looks at** — CloudWatch Logs, VPC Flow Logs, alarms and metrics, Lambda logs, container logs, and API Gateway access logs.
**What you get** — Network and anomaly analysis data, a normalized event feed for correlation, reports, and dashboards.
**Frameworks** — PCI-DSS 10.x / 11.4, NIST SI-4, SOC 2 CC6.1/CC7.2.

### siem-guardduty-analyzer

*A force-multiplier on top of GuardDuty that adds root-cause analysis, IOC extraction, and risk context to raw findings, transforming isolated alerts into prioritized, framework-mapped intelligence.*

**What it does** — Collects and analyzes GuardDuty findings with AI threat detection, root-cause analysis, IOC extraction, and risk scoring.
**What it looks at** — GuardDuty findings across regions, with CloudTrail for root cause and EC2/IAM/S3 for context.
**What you get** — Findings, extracted indicators of compromise (IPs, domains, hashes), risk scores, executive/threat/IOC/compliance reports, and dashboards.
**Frameworks** — PCI-DSS 10.6/11.4/12.10, SOC 2 CC6.6, NIST SI-4, CIS AWS 3.10/3.11.

### siem-event-correlator

*The brain of the SIEM suite, fusing all three sensor feeds into multi-stage attack narratives. Single-source alerts that look benign in isolation become recognizable kill chains — credential theft, lateral movement, ransomware.*

**What it does** — Aggregates the GuardDuty, CloudWatch, and CloudTrail event feeds for cross-source incident detection and SOC dashboards.
**What it looks at** — The normalized CEF event feeds from the three source analyzers (90/365-day retention).
**How it works** — Deduplicates and links events, applies time-window/entity/sequence/threshold rules, and runs 10 cross-source detections (credential-compromise chains, exfiltration, lateral movement, privilege escalation, crypto-mining, defense evasion, insider threat, account takeover, supply chain, ransomware), classifying incidents P0–P3.
**What you get** — Correlated incidents and attack chains, a threat-landscape and SOC-metrics view, correlation/incident/SOC reports, containment and remediation playbooks, and multiple dashboard views.
**Frameworks** — PCI-DSS 10.6/11.4/12.10, SOC 2 CC6.6/CC7.2/CC7.3, NIST SI-4/IR-4/IR-5, ISO 27001 A.16.1.

### siem-soc-analyzer

*A virtual SOC that mirrors how a real one is staffed, escalating events through L1, L2, and L3 analyst tiers. It triages noise, investigates what matters, and hunts confirmed incidents to closure — generating detection rules along the way.*

**What it does** — Runs a tiered L1/L2/L3 SOC analyst pipeline for alert triage, correlation, threat hunting, detection-rule creation, and incident response.
**What it looks at** — Raw SIEM events from CloudWatch/CloudTrail, Windows Event Logs, and Linux syslog/auditd.
**How it works** — **L1 triage** matches a 135-rule use-case library, classifies P0–P3, and filters false positives → **L2 investigation** correlates by time and entity, enriches with threat intel (VirusTotal, AbuseIPDB, OTX), maps MITRE, and determines incidents → **L3 hunting** runs forensics, generates Sigma/YARA/Suricata detection rules, maps compliance, and writes IR playbooks and executive reports with SOC KPIs (MTTD, MTTR, false-positive rate).
**What you get** — Triaged alerts, investigation findings, incident timelines, threat analysis, incident/threat reports, and an interactive SOC dashboard.
**Frameworks** — PCI-DSS 4.0 (10/11/12.x), ISO 27001 A.12/A.16, SOC 2 CC6/7/8, NIST AU/IR/SI, HIPAA §164.312/.308, CIS v8, MITRE ATT&CK v14.

### aws-monitor-guardduty

*A lightweight companion to GuardDuty for teams that want quick root-cause and risk scoring without standing up the full SIEM pipeline.*

**What it does** — Lightweight GuardDuty analysis: root cause, probable cause, impact, and probability-weighted risk scores.
**What it looks at** — GuardDuty findings, with CloudTrail for correlation.
**What you get** — Findings, analysis, and risk-score data; an executive summary with remediation; a markdown report; and a dashboard.
**Frameworks** — PCI-DSS, CIS AWS Foundations, SOC 2, NIST.

### aws-log-analyzer

*A cross-source log-forensics tool that stitches six AWS log streams into a single timeline. It is built for the investigator's core question: what actually happened, and when?*

**What it does** — Aggregates and analyzes logs from five-plus AWS sources to detect anomalies, support forensics, and monitor PCI logging compliance.
**What it looks at** — CloudTrail, CloudWatch, VPC Flow Logs, S3 Access Logs, GuardDuty, and WAF.
**What you get** — Cross-correlated findings, anomaly detection, reconstructed incident timelines with user-activity and privilege-escalation tracking, markdown reports, and multiple dashboard views.
**Frameworks** — PCI-DSS 10.1–10.7.

---

## Offensive security & risk

### pentest

*An autonomous offensive-security platform that orchestrates a fleet of specialized attack agents the way a red-team lead directs operators. Reconnaissance, exploitation, and evidence validation run in parallel, and every finding is adversarially re-checked before it reaches the report.*

**What it does** — A multi-agent penetration-testing framework running parallel recon, vulnerability testing, and evidence validation across 50+ attack types and 11 domains.
**What it looks at** — Your defined target scope and explicit authorization; optional Shodan/DNS intelligence; your AWS account.
**How it works** — Parses scope → parallel reconnaissance → plans attack vectors by surface → parallel vulnerability testing → aggregation and validation (five checks: CVSS consistency, evidence, proof-of-concept, claims-vs-raw, log corroboration) before any finding is reported.
**What you get** — Validated findings (CVSS/CWE/OWASP/MITRE), an interactive report dashboard, a branded PDF, and a remediation roadmap.
**Frameworks** — OWASP Top 10 / WSTG / LLM Top 10, MITRE ATT&CK, PTES, CWE, CVSS v3.1, NIST SP 800-115.

### cloud-attack-path-analysis

*A graph-based way to think like an attacker about your own cloud. It chains misconfigurations, vulnerabilities, and access into ranked attack paths, then pinpoints the single fixes — chokepoints — that collapse the most routes at once.*

**What it does** — Discovers and visualizes attack paths through your cloud infrastructure, scores them by probability, and identifies chokepoint remediations.
**What it looks at** — EC2, IAM, S3, RDS, VPC, Security Hub, GuardDuty, Inspector, CloudTrail, and Access Analyzer.
**How it works** — Profiles infrastructure, maps IAM privilege-escalation paths, correlates vulnerabilities (CVSS/EPSS/KEV), analyzes network reachability, builds an attack graph, scores each path, and finds chokepoints that break many paths at once.
**What you get** — Ranked attack paths, a chokepoint analysis, MITRE-mapped reports, and an interactive attack-graph dashboard.
**Frameworks** — PCI-DSS 6.1/11.3, CIS AWS 1–4.x, NIST RA-5/CA-8, MITRE ATT&CK.

### aws-vulnerability-prioritizer

*A triage layer over ECR and Inspector that answers the only question that matters in vulnerability management — what do we fix first? It weighs exploitability against business context, then projects how much risk each remediation actually removes.*

**What it does** — Analyzes ECR/Inspector vulnerabilities, traces root packages, enriches with asset context, prioritizes by risk, and simulates remediation impact.
**What it looks at** — ECR scan findings, Inspector findings, resource tags, and image metadata.
**What you get** — Prioritized findings with root-package tracing, a remediation plan, a before/after impact simulation, reports, and a dashboard.
**Frameworks** — PCI-DSS 6.2/6.3, CIS AWS 5.1, SOC 2 CC7.1, NIST RA-5.

### threat-radar-generation

*A passive reconnaissance pipeline that fingerprints an organization's technology stack from public signals alone, then renders a tailored threat radar. No credentials, no active scanning — pure OSINT inference.*

**What it does** — Passive OSINT that infers an organization's technology stack, then renders a personalized threat radar.
**What it looks at** — A company name (and optional domain); passive public sources only — DNS, HTTP headers, TLS certs, page content, GitHub, job posts, web archives, certificate-transparency logs.
**What you get** — A technology-stack report (with confidence and evidence), a customer profile, and an interactive threat-radar dashboard.
**Frameworks** — None (pure OSINT discovery).

---

## Network & infrastructure

### network-diagram-curator

*An always-current map of the cloud network, generated from the live account rather than stale Visio files. It produces interactive topology, a searchable asset inventory with end-of-life tracking, and PCI scope visualizations.*

**What it does** — Collects your AWS infrastructure and generates interactive topology diagrams, an asset inventory with end-of-life tracking, and PCI scoping visualizations.
**What it looks at** — EC2, RDS, Lambda, CloudTrail, CloudWatch, API Gateway, S3, ElastiCache, WAF; VPCs, subnets, security groups, route tables, NACLs, peering, transit gateways; and OS/engine versions for EOL.
**What you get** — Three interactive views (a network topology diagram with SVG/JSON export, a searchable asset inventory with vendor/firmware/EOL, and a PCI scoping diagram), an infrastructure data export, and EOL markdown plus PNG/SVG diagrams.
**Frameworks** — PCI DSS (CDE scoping), AWS Well-Architected.

### network-ruleset-review

*An automation of the annual firewall review that PCI mandates and most teams dread. It normalizes AWS and appliance rulesets alike, AI-annotates each rule's risk, and emits a formal Word report.*

**What it does** — A PCI-DSS v4.0 annual network ruleset review merging NACL, Security Group, VPC architecture, and firewall-export analysis into a Word report.
**What it looks at** — Network ACLs, security groups, VPCs and route tables; firewall exports (Palo Alto, Fortinet, Cisco ASA in CSV/JSON/text); and your rule justifications.
**How it works** — Collects and normalizes rules with a baseline risk assessment → you pick a review mode (NACL, firewall + SG, or combined) and the browser adds PCI commentary and a score → the app generates a 14-section branded Word report.
**What you get** — Normalized ruleset analysis, an interactive dashboard, and a 14-section Word report with PCI mapping and sign-off.
**Frameworks** — PCI-DSS v4.0 1.1.7 / 1.2 / 1.3 / 1.4.

### devops-security-remediation

*A fast-acting fix for the most common critical cloud misconfiguration — security groups open to the entire internet. It finds them, ranks them by exposure, and writes both the remediation and the rollback scripts.*

**What it does** — Identifies security groups with 0.0.0.0/0 ingress and generates remediation and rollback scripts.
**What it looks at** — EC2 security groups, network interfaces, and running instances.
**What you get** — Severity-classified findings with affected-resource impact, ready-to-run remediation and rollback scripts, and a dashboard with action buttons.
**Frameworks** — SOC 2.

---

## FinOps

### cloud-cost-monitor

*A FinOps assistant that treats wasted spend as a first-class finding. It combines right-sizing, commitment optimization, and anomaly detection to recover budget and catch cost-driven abuse such as cryptomining.*

**What it does** — Monitors AWS cost, recommends right-sizing, optimizes RI/Savings Plan commitments, and detects cost anomalies.
**What it looks at** — Cost Explorer, Compute Optimizer, CloudWatch metrics, Budgets, and Trusted Advisor.
**What you get** — Cost, right-sizing, commitment, anomaly, and budget data; savings-prioritized remediation; reports; and five dashboard views (cost, right-sizing, savings plans, anomaly detection, budget tracker).
**Frameworks** — FinOps Foundation, AWS Well-Architected COST, ISO 27001 A.12.1, SOC 2 CC6.1.

---

## Training & simulation

### devops-simulation-training

*A flight simulator for cloud-operations teams, letting engineers rehearse incidents in a modeled environment without production risk. Scenarios escalate dynamically and scoring measures genuine response skill.*

**What it does** — Gamified cloud-infrastructure simulations to practice incident response, capacity planning, DDoS mitigation, and compliance scenarios.
**What it looks at** — A library of 10+ scenarios, your difficulty/mode selections, and optional AWS context.
**What you get** — Scenario, results, progress, and skill-assessment data; training reports; and gamified simulation dashboards with dynamic scoring and feedback.
**Frameworks** — None (custom training).

### tabletop-exercise

*A generator for disaster-recovery tabletop drills that feel real because they reference your actual infrastructure. It runs role-specific injects, scores participant responses, and maps readiness back to compliance obligations.*

**What it does** — An AI-powered DR tabletop exercise generator producing role-specific scenarios grounded in your real AWS inventory.
**What it looks at** — Your organization's inventory, your scenario type/roles/objectives, and participant responses.
**How it works** — Analyzes inventory for critical assets and single points of failure → generates a scenario (ransomware, breach, failure, DDoS, insider, supply-chain, disaster) referencing real infrastructure → runs role-specific questions with escalating injects → evaluates responses across five dimensions and maps gaps to compliance.
**What you get** — An interactive exercise dashboard with detail views, scenario/question/response/evaluation data, and a markdown gap report.
**Frameworks** — PCI-DSS v4.0.1 12.4, NIST SP 800-61, ISO 22301, SOC 2 CC7.x.

### phishing-simulator

*A gamified awareness academy that teaches phishing and AI-era attack recognition through play rather than lecture. Streaks, lives, and rank badges turn a compliance checkbox into something people actually finish.*

**What it does** — A gamified phishing-awareness academy: eight chapters on email detection, header forensics, AI attack vectors, URL classification, perimeter security, and prompt injection.
**What it looks at** — A built-in curriculum (8 chapters, 18 challenges) and the learner's quiz and drag-and-drop interactions.
**What you get** — An interactive academy dashboard with a scoring engine (points, streaks, a three-lives system), a final rank badge, and a completion certificate.
**Frameworks** — None formal (maps loosely to SOC 2 CC7.x security awareness).

---

## Hub & framework

### security-dashboard-hub

*The single pane of glass over the entire suite, aggregating every app's output into a role-aware posture view. Executives, managers, and analysts each see the slice they need, backed by a natural-language query box.*

**What it does** — A role-based aggregation hub that visualizes security posture from all your apps, with a natural-language query box for custom analysis.
**What it looks at** — Aggregated outputs from your other apps, your AWS environment, and your selected role (CISO, InfoSec Manager, Analyst, Developer).
**What you get** — Role-aware dashboards with a posture score, KPI cards, 30-day trends, compliance heatmaps, a remediation roadmap, and an AI assistant panel for posture questions.
**Frameworks** — PCI-DSS, ISO 27001, SOC 2, HIPAA (aggregated from the underlying apps).

### custom-task

*A general-purpose scaffold for one-off requests that don't warrant a dedicated app. It classifies the user's intent and spins up a matching dashboard on the fly.*

**What it does** — A flexible framework for ad-hoc queries that dynamically generates a matching dashboard.
**What it looks at** — Your task intent and query parameters, plus any data sources the task needs.
**What you get** — A generated dashboard and a results data export tailored to the task.
**Frameworks** — None (general-purpose).
