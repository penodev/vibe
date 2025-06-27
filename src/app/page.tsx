"use client";

import { Button } from "@/components/ui/button";
import { useTRPCMutation } from "@/hooks/use-query";
import { toast } from "sonner";

const Page = () => {
  const invoke = useTRPCMutation((trpc) =>
    trpc.invoke.mutationOptions({
      onSuccess: () => toast.success("Invoked successfully"),
      onError: () => toast.error("Failed to invoke"),
    })
  );

  return (
    <div className='text-red-500 font-bold'>
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ text: "John" })}
      >
        Invoke
      </Button>
    </div>
  );
};

export default Page;
