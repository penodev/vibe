import {
  createCommandFilesTool,
  createQueryFilesTool,
  createTerminalTool,
} from "@/inngest/tools";
import { AgentState } from "@/inngest/types";
import { lastAssistantTextMessageContent } from "@/inngest/utils";
import { prisma } from "@/lib/db";
import { PROMPT } from "@/prompt";
import {
  Agent,
  createAgent,
  createNetwork,
  NetworkRun,
} from "@inngest/agent-kit";
import { gemini } from "@inngest/agent-kit";

export const createCodeAgent = (sandboxId: string) =>
  createAgent<AgentState>({
    name: "code-agent",
    description: "An expert coding agent",
    system: PROMPT,
    model: gemini({ model: "gemini-2.5-pro" }),
    tools: [
      createTerminalTool(sandboxId),
      createCommandFilesTool(sandboxId),
      createQueryFilesTool(sandboxId),
    ],
    lifecycle: {
      onResponse: async ({ result, network }) => {
        const lastAssistantMessageText =
          lastAssistantTextMessageContent(result);

        if (lastAssistantMessageText && network) {
          if (lastAssistantMessageText.includes("<task_summary>")) {
            network.state.data.summary = lastAssistantMessageText;
          }
        }

        return result;
      },
    },
  });

export const createAgentNetwork = (codeAgent: Agent<AgentState>) =>
  createNetwork<AgentState>({
    name: "coding-agent-network",
    agents: [codeAgent],
    maxIter: 15,
    router: async ({ network }) => {
      const summary = network.state.data.summary;
      if (summary) {
        return;
      }

      return codeAgent;
    },
  });

export const createResultMessage = async (
  result: NetworkRun<AgentState>,
  sandboxUrl: string,
  projectId: string
) => {
  const isError =
    !result.state.data.summary ||
    Object.keys(result.state.data.files || {}).length === 0;

  if (isError) {
    return await prisma.message.create({
      data: {
        projectId,
        content: "Something went wrong. Please try again.",
        role: "ASSISTANT",
        type: "ERROR",
      },
    });
  }

  return await prisma.message.create({
    data: {
      projectId,
      content: result.state.data.summary,
      role: "ASSISTANT",
      type: "RESULT",
      fragment: {
        create: {
          sandboxUrl: sandboxUrl,
          title: "Fragment",
          files: result.state.data.files,
        },
      },
    },
  });
};
