import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";

const Chat = () => {
  return (
    <div className="h-screen flex">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
