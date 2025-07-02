"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPCMutation } from "@/hooks/use-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const createProject = useTRPCMutation((trpc) =>
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center'>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          className='w-fit'
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value })}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Page;
