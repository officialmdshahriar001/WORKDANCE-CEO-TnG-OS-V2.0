export type AgentId =
  | "openai-orchestrator"
  | "deepseek-engineer"
  | "claude-reviewer"
  | "gemini-ops"
  | "perplexity-verifier"
  | "grok-stress"
  | "kimi-docs";

export type TaskStatus =
  | "CREATED"
  | "CLASSIFIED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "VALIDATING"
  | "EVIDENCE_READY"
  | "APPROVAL_REQUIRED"
  | "APPROVED"
  | "EXECUTING"
  | "COMPLETED"
  | "FAILED";

export interface AgentDefinition {
  id: AgentId;
  role: string;
  capabilities: string[];
  permissions: string[];
  canApproveProduction: boolean;
}

export interface TngTask {
  id: string;
  title: string;
  type: "engineering" | "research" | "operations" | "documentation" | "business";
  status: TaskStatus;
  owner?: AgentId;
  validation?: AgentId;
  evidence: string[];
  approvalRequired: boolean;
}

export const AGENT_REGISTRY: AgentDefinition[] = [
  { id: "openai-orchestrator", role: "routing, state and policy", capabilities: ["route", "coordinate", "evaluate", "request-approval"], permissions: ["task.read", "task.write", "agent.invoke"], canApproveProduction: false },
  { id: "deepseek-engineer", role: "engineering implementation", capabilities: ["code", "tests", "refactor"], permissions: ["repo.read", "branch.write", "tests.run", "pr.create"], canApproveProduction: false },
  { id: "claude-reviewer", role: "architecture and security review", capabilities: ["review", "security", "architecture"], permissions: ["repo.read", "pr.read", "review.write"], canApproveProduction: false },
  { id: "gemini-ops", role: "runtime and environment inspection", capabilities: ["runtime", "logs", "diagnostics"], permissions: ["runtime.read", "logs.read"], canApproveProduction: false },
  { id: "perplexity-verifier", role: "independent research and verification", capabilities: ["research", "source-check"], permissions: ["web.read"], canApproveProduction: false },
  { id: "grok-stress", role: "stress and adversarial analysis", capabilities: ["edge-cases", "red-team"], permissions: ["repo.read", "test.read"], canApproveProduction: false },
  { id: "kimi-docs", role: "long-context documentation analysis", capabilities: ["documentation", "context-analysis"], permissions: ["docs.read", "docs.write"], canApproveProduction: false },
];

export function createTask(title: string, type: TngTask["type"]): TngTask {
  return {
    id: `TNG-${Date.now()}`,
    title,
    type,
    status: "CREATED",
    evidence: [],
    approvalRequired: type === "engineering" || type === "operations",
  };
}

export function routeTask(task: TngTask): TngTask {
  const owner: AgentId =
    task.type === "engineering" ? "deepseek-engineer" :
    task.type === "research" ? "perplexity-verifier" :
    task.type === "operations" ? "gemini-ops" :
    task.type === "documentation" ? "kimi-docs" :
    "openai-orchestrator";

  return { ...task, status: "ASSIGNED", owner };
}

export function requestValidation(task: TngTask): TngTask {
  if (!task.owner) return { ...task, status: "FAILED", evidence: [...task.evidence, "Validation requested without an owner"] };
  const validation: AgentId =
    task.owner === "deepseek-engineer" ? "claude-reviewer" :
    task.owner === "perplexity-verifier" ? "openai-orchestrator" :
    task.owner === "gemini-ops" ? "grok-stress" :
    "openai-orchestrator";
  return { ...task, status: "VALIDATING", validation };
}

export function markEvidence(task: TngTask, evidence: string): TngTask {
  return { ...task, status: task.approvalRequired ? "APPROVAL_REQUIRED" : "COMPLETED", evidence: [...task.evidence, evidence] };
}
