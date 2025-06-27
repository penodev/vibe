"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPCMutation } from "@/hooks/use-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [value, setValue] = useState("");

  const invoke = useTRPCMutation((trpc) =>
    trpc.invoke.mutationOptions({
      onSuccess: () => toast.success("Invoked successfully"),
      onError: () => toast.error("Failed to invoke"),
    })
  );

  return (
    <div className='p-6 flex flex-col gap-2 align-start'>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        className='w-fit'
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ value })}
      >
        Invoke
      </Button>
    </div>
  );
};

export default Page;
