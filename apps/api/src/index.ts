import { createServer } from "node:http";
import { createTask, routeTask, requestValidation, markEvidence } from "./tng-orchestrator";

const port = Number(process.env.PORT ?? 3000);

const server = createServer(async (req, res) => {
  res.setHeader("content-type", "application/json");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ service: "tng-os-control-plane", status: "ok", environment: process.env.NODE_ENV ?? "development" }));
    return;
  }

  if (req.method === "POST" && req.url === "/api/tasks") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const input = JSON.parse(body || "{}");
    let task = createTask(String(input.title ?? "Untitled TNG task"), input.type ?? "business");
    task = routeTask(task);
    task = requestValidation(task);
    task = markEvidence(task, "Task classified, assigned and validation policy selected.");
    res.writeHead(200);
    res.end(JSON.stringify(task));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(port, () => console.log(`TNG OS control plane listening on ${port}`));
