import { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, Mic, X, StopCircle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import useChatStore from "../../store/chatStore";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const cancelRecordingRef = useRef(false);

  const { selectedChat, sendMessage, sendAttachments, sendVoiceMessage } = useChatStore();

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(selectedChat._id, selectedChat.members, message);
      setMessage("");
    }
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("chatId", selectedChat._id);
      sendAttachments(formData);
      setSelectedFiles([]);
    }
    if (audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "voiceMessage.webm");
      formData.append("chatId", selectedChat._id);
      sendVoiceMessage(formData);
      setAudioBlob(null);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  const handleAttachClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    e.target.value = null;
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [message]);

  const startRecording = async () => {
    try {
      cancelRecordingRef.current = false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (!cancelRecordingRef.current && chunks.length > 0) {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setAudioBlob(blob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      cancelRecordingRef.current = false;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    cancelRecordingRef.current = true;
    stopRecording();
    setRecordingTime(0);
  };

  return (
    <div className="absolute  bottom-0 left-0 w-full p-3 border-t bg-base-100 z-10">
      {selectedFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative w-28 min-h-20 bg-base-200 border rounded overflow-hidden flex items-center justify-center text-xs text-center p-1"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                />
              ) : (
                <div
                  className="px-1 text-xs break-words w-full text-center text-base-content cursor-pointer"
                  onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                >
                  {file.name}
                </div>
              )}
              <button
                onClick={() => removeSelectedFile(index)}
                className="absolute top-0 right-0 bg-base-100 rounded-bl text-error"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {audioBlob && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-base-200 rounded">
          <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
          <button
            onClick={() => setAudioBlob(null)}
            className="text-error hover:text-error-content"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center justify-between mb-2 p-2 bg-error/10 rounded text-sm">
          <span className="text-error">
            Recording: {recordingTime}s...
          </span>
          <button
            onClick={cancelRecording}
            className="text-error hover:text-error-content flex items-center gap-1"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 rounded-2xl border px-4 py-2 bg-base-200">
        <button
          onClick={toggleEmojiPicker}
          className="text-base-content/70 hover:text-base-content"
        >
          <Smile size={20} />
        </button>

        <button
          onClick={handleAttachClick}
          className="text-base-content/70 hover:text-base-content"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <textarea
          ref={textareaRef}
          className="flex-1 resize-none overflow-hidden bg-transparent outline-none text-sm text-base-content placeholder:text-base-content/60 max-h-40"
          rows={1}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {(message.trim() || selectedFiles.length > 0 || audioBlob) ? (
          <button
            onClick={handleSend}
            className="text-primary hover:text-primary-content"
          >
            <Send size={20} />
          </button>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="text-error hover:text-error-content"
          >
            <StopCircle size={24} />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="text-base-content/70 hover:text-base-content"
          >
            <Mic size={20} />
          </button>
        )}
      </div>

      {showEmojiPicker && (
        <div className="w-full mt-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
