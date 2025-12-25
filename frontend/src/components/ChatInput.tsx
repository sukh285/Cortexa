const ChatInput = () => {
  return (
    <div className="border-t p-4">
      <input
        disabled
        placeholder="Type a message..."
        className="
            w-full rounded-md px-3 py-2 text-base
            bg-muted text-foreground
            border border-input
            placeholder:text-muted-foreground
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
      />
    </div>
  );
};

export default ChatInput;
