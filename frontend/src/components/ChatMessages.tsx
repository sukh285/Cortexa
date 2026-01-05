import { useChatStore } from "@/store/chat.store";
import { useEffect, useRef } from "react";
import { Loader } from "@/components/Loader";

const ChatMessages = () => {
  const { messages, activeChatId, isFetchingMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // No chat selected
  if (!activeChatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Start a conversation
      </div>
    );
  }

  // Chat selected, messages loading
  if (isFetchingMessages && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader label="Loading messages" />
      </div>
    );
  }

  // Chat selected, no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        No messages yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar">
      {messages.map((msg, index) => {
        const isUser = msg.role === "USER";

        return (
          <div
            key={index}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[70%] rounded-lg px-4 py-2 text-sm leading-relaxed
                ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }
              `}
            >
              {msg.isLoading ? (
                <span className="italic opacity-70">Thinking…</span>
              ) : (
                msg.content
              )}
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
