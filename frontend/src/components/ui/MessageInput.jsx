import { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send,Mic,X,StopCircle} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

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
  const cancelRecordingRef= useRef(false);
  const handleSend = () => {
    if (message.trim()) {
      console.log("Text message:", message);
      setMessage("");
    }
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) =>
        console.log("Attached file:", file.name)
      );
      setSelectedFiles([]);
    }
    if (audioBlob) {
      console.log("Audio message:", audioBlob);
      setAudioBlob(null);
    }
  };

  const handleEomojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }
  const toggleEomojiPciker=()=>{
    setShowEmojiPicker(!showEmojiPicker);
  }

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    e.target.value = null;
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [message]);

const startRecording = async() => {
  try{
    cancelRecordingRef.current = false;
    const stream=await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
  
    const chunks=[];
    mediaRecorder.ondataavailable = (e) => {
      if(e.data.size>0)chunks.push(e.data);
    }

    mediaRecorder.onstop=()=>{
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
    },1000);
  }catch(error){
    console.error("Error starting recording:", error);
  }
}

const stopRecording=()=>{
  if(mediaRecorderRef.current){
    cancelRecordingRef.current = false;
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    clearInterval(recordingTimerRef.current);
  }
}


const cancelRecording = () => {
  stopRecording();
  setRecordingTime(0);
};

  return (
    <div className="absolutefixed bottom-0 left-0 w-full p-3 border-t bg-white ">
    {selectedFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative w-28 min-h-20 bg-gray-100 border rounded overflow-hidden flex items-center justify-center text-xs text-center p-1"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                />
              ) : (
                <div
                  className="px-1 text-xs break-words w-full text-center text-gray-700 dark:text-gray-200 cursor-pointer"
                  onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                >
                  {file.name}
                </div>
              )}
              <button
                onClick={() => removeSelectedFile(index)}
                className="absolute top-0 right-0 bg-white rounded-bl text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
  {audioBlob && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded">
          <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
          <button
            onClick={() => setAudioBlob(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
        </div>
      )}
{isRecording && (
        <div className="flex items-center justify-between mb-2 p-2 bg-red-100 rounded text-sm">
          <span className="text-red-500">
            Recording: {recordingTime}s...
          </span>
          <button 
            onClick={cancelRecording}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 rounded-2xl border px-4 py-2 bg-gray-100 ">
        <button 
        onClick={toggleEomojiPciker}
        className="text-gray-500 hover:text-gray-700 ="
        >
          <Smile size={20} />
        </button>

        <button 
        onClick={handleAttachClick}
        className="text-gray-500 hover:text-gray-700 "
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
          className="flex-1 resize-none overflow-hidden bg-transparent outline-none text-sm text-gray-800  placeholder:text-gray-400 max-h-40"
          rows={1}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
       {(message.trim() || selectedFiles.length > 0 || audioBlob)? (
          <button
            onClick={handleSend}
            className="text-blue-500 hover:text-blue-700 "
          >
            <Send size={20} />
          </button>
        ) : isRecording ? (
          <button 
            onClick={stopRecording} 
            className="text-red-500 hover:text-red-700"
          >
            <StopCircle size={24} />
          </button>
        ) : (
          <button 
            onClick={startRecording} 
            className="text-gray-500 hover:text-gray-700"
          >
            <Mic size={20} />
          </button>
        )}
      </div>
      {
        showEmojiPicker  && (
          <div className="w-full mt-2">
            <EmojiPicker onEmojiClick={handleEomojiClick}
            width="100%" />
          </div>
        )
      }
    </div>
  );
};

export default MessageInput;
