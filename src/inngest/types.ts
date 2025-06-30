export type AgentState = {
  summary: string;
  files: { [path: string]: string };
};
