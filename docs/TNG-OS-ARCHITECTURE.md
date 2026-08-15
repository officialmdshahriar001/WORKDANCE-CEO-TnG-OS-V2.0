# TNG OS Control Plane

## Mission
TNG OS coordinates specialist AI workers without turning every task into a multi-model committee.

## Execution rule
TASK -> CLASSIFY -> ONE OWNER -> EXECUTE -> VALIDATE WHEN REQUIRED -> EVIDENCE -> APPROVAL -> DEPLOY.

## Specialist registry
- OpenAI: orchestration, routing, policy and state decisions.
- DeepSeek: engineering implementation.
- Claude: architecture and security review.
- Gemini: runtime and environment inspection.
- Perplexity: independent research and verification.
- Grok: stress and adversarial analysis.
- Kimi: long-context documentation analysis.

## Environments
1. LAB: model/prompt evaluation with synthetic data and zero production authority.
2. DEVELOPMENT: GitHub + Codespaces/Cloud Shell, isolated Supabase and Redis, feature branches and tests.
3. STAGING: production-like integration environment with isolated credentials and external-service sandboxes.
4. PRODUCTION: real TNG business systems, least-privilege tools, audit trail, CI/CD and human approval for production changes.

## Core infrastructure
- OpenAI Agents SDK: AI control plane.
- Supabase/Postgres: durable state, tasks, agents, evidence and approvals.
- Redis/BullMQ: asynchronous jobs, retries, locks and rate limits.
- GitHub: source control, branches, pull requests and CI/CD authority.
- n8n: business automation adapter for WhatsApp, CRM, orders, invoices and webhooks.
- Vercel/Netlify/Hostinger: deployment targets according to application responsibility.

## Security rules
- Never commit API keys or provider secrets.
- No agent receives unrestricted production SSH/root access.
- Production-changing operations are exposed through controlled tools.
- Production deployments require an auditable task, validation evidence and approval state.
