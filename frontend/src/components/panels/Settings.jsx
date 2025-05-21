import React, { useState } from "react";
import { useThemeStore } from "../../store/themeStore.js";
import { themes } from "../../constants/themes.js";
import { useNavigate } from "react-router-dom";
import { Send, LogOut } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, name: "You", content: "Hi Priya, did you finish the project update?", isSent: true },
  { id: 2, name: "Priya", content: "Hey Rahul! Yes, I sent it this morning.", isSent: false },
  { id: 3, name: "You", content: "Awesome, thanks! Will check it out.", isSent: true },
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const [previewTheme, setPreviewTheme] = useState(theme);

  const handleLogout = () => navigate("/logout");
  const handleReset = () => setPreviewTheme("cupcake");
  const handleApplyTheme = () => setTheme(previewTheme);

  return (
    <div className="min-h-screen w-full bg-base-200 px-4 pt-4">
      <div className="w-full relative">
        {/* Logout Button */}
        <div className="absolute top-4 right-4">
          <button className="btn btn-sm btn-error gap-1" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 md:p-10 shadow-xl space-y-10 border border-base-300 w-full">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-base-content/70">Personalize your chat experience</p>
          </div>

          {/* Theme Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-semibold">Choose Theme</h2>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline" onClick={handleReset}>Reset Theme</button>
                <button className="btn btn-sm btn-primary" onClick={handleApplyTheme}>Set Theme</button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {themes.map((t) => (
                <button
                  key={t}
                  className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all border ${
                    previewTheme === t
                      ? "bg-base-200 border-primary ring ring-primary"
                      : "hover:bg-base-200/50 border-base-300"
                  }`}
                  onClick={() => setPreviewTheme(t)}
                >
                  <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium truncate w-full text-center capitalize">
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Preview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div
              className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg"
              data-theme={previewTheme}
            >
              <div className="p-4">
                <div className="max-w-full">
                  <div className="bg-base-100 rounded-xl overflow-hidden">
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b border-base-300">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                          P
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Priya</h3>
                          <p className="text-xs text-base-content/70">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto">
                      {PREVIEW_MESSAGES.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div className="flex items-start gap-2 max-w-[80%]">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              message.isSent ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"
                            }`}>
                              {message.name[0]}
                            </div>
                            <div
                              className={`rounded-xl p-3 shadow-sm ${
                                message.isSent
                                  ? "bg-primary text-primary-content"
                                  : "bg-base-200"
                              }`}
                            >
                              <p className="text-xs font-semibold mb-1">{message.name}</p>
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-[10px] mt-1.5 ${
                                  message.isSent
                                    ? "text-primary-content/70"
                                    : "text-base-content/70"
                                }`}
                              >
                                12:00 PM
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-base-300">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1 text-sm h-10"
                          placeholder="Type a message..."
                          value="This is a preview"
                          readOnly
                        />
                        <button className="btn btn-primary h-10 min-h-0">
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
