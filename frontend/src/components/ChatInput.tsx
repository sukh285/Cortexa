import { useChatStore } from "@/store/chat.store";
import { useState } from "react";
import { Button } from "./Button";

const ChatInput = () => {
  const [value, setValue] = useState("");
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleSend = async () => {
    if (!value.trim()) return;

    await sendMessage(value.trim());
    setValue("");
  };

  return (
    <div className="border-t p-4 flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        placeholder="Type a message..."
        disabled={isSendingMessage}
        className="
        flex-1 rounded-md px-3 py-2 text-base
        bg-muted text-foreground
        border border-input
        placeholder:text-muted-foreground
        disabled:opacity-50
      "
      />
      <Button
        onClick={handleSend}
        loading={isSendingMessage}
        disabled={!value.trim()}
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
