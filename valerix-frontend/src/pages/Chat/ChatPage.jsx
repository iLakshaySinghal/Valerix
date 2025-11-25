import React from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../../components/Chat/ChatWindow";
import ChatList from "../../components/Chat/ChatList";

export default function ChatPage(){
  const { chatId } = useParams();
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1"><ChatList /></div>
      <div className="md:col-span-2"><ChatWindow chatId={chatId} /></div>
    </div>
  );
}
