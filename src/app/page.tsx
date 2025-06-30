"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPCMutation, useTRPCQuery } from "@/hooks/use-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [value, setValue] = useState("");

  const { data: messages } = useTRPCQuery((trpc) =>
    trpc.messages.getMany.queryOptions()
  );

  const createMessage = useTRPCMutation((trpc) =>
    trpc.messages.create.mutationOptions({
      onSuccess: () => toast.success("Message created"),
      onError: () => toast.error("Failed to create message"),
    })
  );

  return (
    <div className='p-6 flex flex-col gap-2 align-start'>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        className='w-fit'
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value })}
      >
        Prompt
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default Page;
