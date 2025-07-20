import { Fragment } from "@/generated/prisma";
import { useTRPCQuerySuspense } from "@/hooks/use-query";
import { MessageCard } from "@/modules/projects/ui/components/message-card";
import { MessageForm } from "@/modules/projects/ui/components/message-form";
import { MessageLoading } from "@/modules/projects/ui/components/message-loading";
import { useEffect, useRef } from "react";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);

  const { data: messages } = useTRPCQuerySuspense((trpc) =>
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        // TODO: temporary line message update
        refetchInterval: 5000,
      }
    )
  );

  // TODO: this is causing problem
  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );
    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage?.id !== lastAssistantMessageIdRef.current
    ) {
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
      setActiveFragment(lastAssistantMessage.fragment);
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

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
            isActiveFragment={message.fragment?.id === activeFragment?.id}
            onFragmentClick={() => setActiveFragment(message.fragment)}
            type={message.type}
          />
        ))}
        {isLastMessageUser && <MessageLoading />}
        <div ref={buttonRef} />
      </div>
      <div className='relative p-3 pt-1'>
        <div className='absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none' />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
