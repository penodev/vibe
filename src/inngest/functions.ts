import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "@/inngest/utils";
import {
  createAgentNetwork,
  createCodeAgent,
  createResultMessage,
} from "@/inngest/agent-functions";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-peno");
      return sandbox.sandboxId;
    });

    const codeAgent = createCodeAgent(sandboxId);

    const network = createAgentNetwork(codeAgent);

    const result = await network.run(event.data.value);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      createResultMessage(result, sandboxUrl, event.data.projectId);
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
