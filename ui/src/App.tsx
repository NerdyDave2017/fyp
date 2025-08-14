"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/button";
import { Mic, MicOff, HandIcon, ArrowRight } from "lucide-react";
import avatar from "@/assets/Avatar.png";

export default function SignLanguageTranslator() {
  const [isRecording, setIsRecording] = useState(false);
  const [speechHistory, setSpeechHistory] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [audioLevels, setAudioLevels] = useState<number[]>(
    new Array(40).fill(0)
  );
  const [translationSpeed, setTranslationSpeed] = useState("Normal");
  const [avatarStyle, setAvatarStyle] = useState("Realistic");
  const [voiceSensitivity, setVoiceSensitivity] = useState(50);
  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevels = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const newLevels = Array.from(dataArray.slice(0, 40)).map(
            (value) => value / 255
          );
          setAudioLevels(newLevels);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
        }
      };
      updateAudioLevels();

      setIsRecording(true);

      // Simulate speech recognition
      setTimeout(() => {
        setCurrentText("Hello, how are you today?");
      }, 2000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (currentText) {
      setSpeechHistory((prev) => [...prev, currentText]);
      setCurrentText("");
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setAudioLevels(new Array(40).fill(0));
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#dad4eb" }}
    >
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#3B2B53" }}
              >
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <h1 className="text-xl font-bold" style={{ color: "#3B2B53" }}>
                SignBridge
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Language Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-center">
          <div
            className="flex items-center gap-3 p-3 rounded-2xl shadow-lg"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="px-3 py-1.5 rounded-xl font-medium flex items-center gap-2 text-sm md:px-4 md:py-2 md:text-base"
              style={{ backgroundColor: "#CFFB67", color: "#3B2B53" }}
            >
              <span className="block md:hidden">
                <Mic size={16} />
              </span>
              <span className="hidden md:block">
                <Mic size={20} />
              </span>
              <span className="">English</span>
            </div>
            <span className="block md:hidden">
              <ArrowRight size={16} style={{ color: "#3B2B53" }} />
            </span>
            <span className="hidden md:block">
              <ArrowRight size={20} style={{ color: "#3B2B53" }} />
            </span>
            <div
              className="px-3 py-1.5 rounded-xl font-medium flex items-center gap-2 text-sm md:px-4 md:py-2 md:text-base"
              style={{ backgroundColor: "#FAB489", color: "#3B2B53" }}
            >
              <span className="block md:hidden">
                <HandIcon size={16} />
              </span>
              <span className="hidden md:block">
                <HandIcon size={20} />
              </span>
              <span className="">NSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full pb-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Sign Language Display */}
            <div className="space-y-6 flex flex-col">
              <div
                className="p-4 sm:p-6 rounded-3xl shadow-xl flex-1 flex flex-col"
                style={{ backgroundColor: "#3B2B53" }}
              >
                {/* Avatar Container */}
                <div className="relative flex-1 flex flex-col">
                  <div
                    className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg mb-4"
                    style={{ backgroundColor: "#3B2B53" }}
                  >
                    <img
                      src={avatar}
                      alt="Sign Language Avatar"
                      className="w-full h-full object-cover"
                    />
                    {isRecording && (
                      <div
                        className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: "#CFFB67" }}
                      />
                    )}
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <p className="font-medium" style={{ color: "#3B2B53" }}>
                      {isRecording ? "Listening..." : "Ready to translate"}
                    </p>
                    {currentText && (
                      <div
                        className="mt-4 p-3 rounded-xl"
                        style={{ backgroundColor: "#C9AEFE", color: "#3B2B53" }}
                      >
                        <p className="font-medium">{currentText}</p>
                      </div>
                    )}
                  </div>

                  {/* Audio Control */}
                  <div
                    className="flex items-center justify-center gap-2 md:gap-4 mt-6 p-2 md:p-4 rounded-2xl"
                    style={{ backgroundColor: "#dad4eb" }}
                  >
                    <Button
                      onClick={toggleRecording}
                      size="sm"
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                        isRecording ? "animate-pulse" : "hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: isRecording ? "#FAB489" : "#3B2B53",
                        color: "#FFFFFF",
                      }}
                    >
                      {isRecording ? (
                        <>
                          <span className="block md:hidden">
                            <MicOff size={14} />
                          </span>
                          <span className="hidden md:block">
                            <MicOff size={18} />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="block md:hidden">
                            <Mic size={14} />
                          </span>
                          <span className="hidden md:block">
                            <Mic size={18} />
                          </span>
                        </>
                      )}
                    </Button>

                    {/* Compact Waveform */}
                    <div className="flex items-center gap-1 md:px-4">
                      {audioLevels.map((level, index) => (
                        <div
                          key={index}
                          className="transition-all duration-100 ease-out rounded-full"
                          style={{
                            width: "3px",
                            height: `${Math.max(4, level * 40)}px`,
                            backgroundColor: isRecording
                              ? `rgba(207, 251, 103, ${0.3 + level * 0.7})`
                              : "#C9AEFE",
                            opacity: isRecording ? 1 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-6 flex flex-col">
              {/* Speech Input */}
              <div
                className="p-4 sm:p-6 rounded-3xl shadow-xl"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#3B2B53" }}
                >
                  Speech Input
                </h3>
                <div className="text-center py-8">
                  <p
                    className="text-sm opacity-70 mb-2"
                    style={{ color: "#3B2B53" }}
                  >
                    Ready
                  </p>
                  <p className="font-medium" style={{ color: "#3B2B53" }}>
                    Click the microphone to start
                  </p>
                </div>
              </div>

              {/* Settings */}
              <div
                className="p-4 sm:p-6 rounded-3xl shadow-xl"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#3B2B53" }}
                >
                  Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#3B2B53" }}
                    >
                      Translation Speed
                    </span>
                    <select
                      value={translationSpeed}
                      onChange={(e) => setTranslationSpeed(e.target.value)}
                      className="px-3 py-3 rounded-lg border-0 text-sm font-medium"
                      style={{ backgroundColor: "#dad4eb", color: "#3B2B53" }}
                    >
                      <option>Slow</option>
                      <option>Normal</option>
                      <option>Fast</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#3B2B53" }}
                    >
                      Avatar Style
                    </span>
                    <select
                      value={avatarStyle}
                      onChange={(e) => setAvatarStyle(e.target.value)}
                      className="px-3 py-3 rounded-lg border-0 text-sm font-medium"
                      style={{ backgroundColor: "#dad4eb", color: "#3B2B53" }}
                    >
                      <option>Realistic</option>
                      <option>Cartoon</option>
                      <option>Minimal</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#3B2B53" }}
                    >
                      Voice Sensitivity
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={voiceSensitivity}
                        onChange={(e) =>
                          setVoiceSensitivity(Number(e.target.value))
                        }
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          backgroundColor: "#dad4eb",
                          background: `linear-gradient(to right, #C9AEFE 0%, #C9AEFE ${voiceSensitivity}%, #dad4eb ${voiceSensitivity}%, #dad4eb 100%)`,
                        }}
                      />
                      <span
                        className="text-sm font-medium w-8"
                        style={{ color: "#3B2B53" }}
                      >
                        {voiceSensitivity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Translation History */}
              <div
                className="p-4 sm:p-6 rounded-3xl shadow-xl flex flex-col "
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#3B2B53" }}
                >
                  Translation History
                </h3>
                <div className="space-y-3 min-h-0">
                  {speechHistory.length > 0 ? (
                    speechHistory.slice(-3).map((text, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl text-sm"
                        style={{ backgroundColor: "#dad4eb", color: "#3B2B53" }}
                      >
                        {text}
                      </div>
                    ))
                  ) : (
                    <p
                      className="text-center py-8 text-sm opacity-70"
                      style={{ color: "#3B2B53" }}
                    >
                      No translations yet. Start speaking to see your history.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
