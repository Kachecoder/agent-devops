import { JiraClient } from 'jira.js';

export async function createJiraTask(issue: { summary: string, description: string }) {
  const client = new JiraClient({
    host: process.env.JIRA_HOST!,
    authentication: {
      username: process.env.JIRA_USER!,
      password: process.env.JIRA_API_KEY!,
    },
  });

  await client.issues.createIssue({
    fields: {
      project: { key: 'KACHE' },
      issuetype: { name: 'Task' },
      summary: issue.summary,
      description: issue.description,
    },
  });
}