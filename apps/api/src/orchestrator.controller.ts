import { Body, Controller, Get, Post } from '@nestjs/common';
import { AGENT_REGISTRY, createTask, markEvidence, requestValidation, routeTask } from './tng-orchestrator';

@Controller('orchestrator')
export class OrchestratorController {
  @Get('agents')
  agents() {
    return { agents: AGENT_REGISTRY };
  }

  @Post('tasks')
  create(@Body() body: { title?: string; type?: 'engineering' | 'research' | 'operations' | 'documentation' | 'business' }) {
    let task = createTask(body.title ?? 'Untitled TNG task', body.type ?? 'business');
    task = routeTask(task);
    task = requestValidation(task);
    return markEvidence(task, 'Task classified, assigned and validation policy selected.');
  }
}
