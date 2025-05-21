import React from "react";
import { MessageCircle } from "lucide-react";

const tips = [
  "Conversations appear here when you select a chat.",
  "You can start a new chat from the chat list.",
  "Stay connected — chat in real-time with your friends!",
];

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center text-center px-4 text-base-content/80 max-w-md">
        <div className="mb-6">
          <MessageCircle size={64} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Chat Selected</h2>
        <p className="mb-6 text-sm">Select a chat to start the conversation</p>
        <ul className="space-y-2 text-sm text-base-content/60">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-primary">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoChatSelected;
