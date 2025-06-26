"use client";

import { useTRPCQuery } from "@/hooks/use-query";

const Page = () => {
  const { data } = useTRPCQuery((trpc) =>
    trpc.createAI.queryOptions({ text: "poo" })
  );

  return <div className='text-red-500 font-bold'>{data?.greeting}</div>;
};

export default Page;
