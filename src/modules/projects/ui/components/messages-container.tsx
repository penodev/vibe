import { useTRPCQuerySuspense } from "@/hooks/use-query";
import { MessageCard } from "@/modules/projects/ui/components/message-card";
import { MessageForm } from "@/modules/projects/ui/components/message-form";
import { useEffect, useRef } from "react";

interface Props {
  projectId: string;
}

export const MessagesContainer = ({ projectId }: Props) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { data: messages } = useTRPCQuerySuspense((trpc) =>
    trpc.messages.getMany.queryOptions({ projectId })
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );
    if (lastAssistantMessage) {
      // TODO SET ACTIVE FRAGMENT
    }
  }, [messages]);

  useEffect(() => {
    buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className='flex flex-col flex-1 min-h-0'>
      <div className='flex-1 min-h-0 overflow-y-auto'>
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            role={message.role}
            fragment={message.fragment}
            createdAt={message.createdAt}
            isActiveFragment={false}
            onFragmentClick={() => {}}
            type={message.type}
          />
        ))}
        <div ref={buttonRef} />
      </div>
      <div className='relative p-3 pt-1'>
        <div className='absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none' />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
