import { AgentState } from "@/inngest/types";
import { getSandbox } from "@/inngest/utils";
import { createTool, Tool } from "@inngest/agent-kit";
import { z } from "zod";

export const createTerminalTool = (sandboxId: string) =>
  createTool({
    name: "terminal",
    description: "Run a command in the terminal",
    parameters: z.object({
      command: z.string(),
    }),
    handler: async ({ command }, { step }) => {
      return await step?.run("terminal", async () => {
        const buffers = { stdout: "", stderr: "" };

        try {
          const sandbox = await getSandbox(sandboxId);
          const result = await sandbox.commands.run(command, {
            onStdout: (data) => {
              buffers.stdout += data;
            },
            onStderr: (data) => {
              buffers.stderr += data;
            },
          });

          return result.stdout;
        } catch (error) {
          const errorString = `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
          console.error(errorString);
          return errorString;
        }
      });
    },
  });

export const createCommandFilesTool = (sandboxId: string) =>
  createTool({
    name: "createOrUpdateFiles",
    description: "Create or update files in the sandbox",
    parameters: z.object({
      files: z.array(
        z.object({
          path: z.string(),
          content: z.string(),
        })
      ),
    }),
    handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
      const newFiles = await step?.run("createOrUpdateFiles", async () => {
        try {
          const updatedFiles = network.state.data.files || {};
          const sandbox = await getSandbox(sandboxId);

          for (const file of files) {
            await sandbox.files.write(file.path, file.content);
            updatedFiles[file.path] = file.content;
          }
          return updatedFiles;
        } catch (error) {
          const errorString = `Error: ${error}`;
          return errorString;
        }
      });

      if (typeof newFiles === "object") {
        network.state.data.files = newFiles;
      }
    },
  });

export const createQueryFilesTool = (sandboxId: string) =>
  createTool({
    name: "readFiles",
    description: "Read files from the sandbox",
    parameters: z.object({
      files: z.array(z.string()),
    }),
    handler: async ({ files }, { step }) => {
      return await step?.run("readFiles", async () => {
        try {
          const sandbox = await getSandbox(sandboxId);
          const contents = [];
          for (const file of files) {
            const content = await sandbox.files.read(file);
            contents.push({
              path: file,
              content,
            });
          }
          return JSON.stringify(contents);
        } catch (error) {
          const errorString = `Error: ${error}`;
          return errorString;
        }
      });
    },
  });
