import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const VoiceInput = ({ onVoiceInput, onVoiceOutput, message }) => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Use browser's built-in speech synthesis
  const speak = (text, options = {}) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.voice = options.voice || window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(utterance);
      return utterance;
    }
    return null;
  };

  const cancel = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (transcript && transcript.trim()) {
      onVoiceInput(transcript);
      resetTranscript();
    }
  }, [transcript, onVoiceInput, resetTranscript]);

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Track speaking state manually since we're using browser API
  const [speaking, setSpeaking] = useState(false);

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    
    try {
      // This will be handled by the SpeechRecognition hook
      setIsListening(true);
      toast.success('Listening... Speak now');
    } catch (error) {
      toast.error('Error starting voice input');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    resetTranscript();
  };

  const speakMessage = (text) => {
    if (!text) return;
    
    try {
      const utterance = speak(text, {
        rate: 0.8,
        pitch: 1,
        voice: window.speechSynthesis.getVoices().find(voice => 
          voice.lang.startsWith('en') || voice.lang.startsWith('hi') || 
          voice.lang.startsWith('te') || voice.lang.startsWith('ta')
        ) || window.speechSynthesis.getVoices()[0]
      });
      
      if (utterance) {
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
      }
      
      toast.success('Speaking...');
    } catch (error) {
      toast.error('Error with voice output');
    }
  };

  const stopSpeaking = () => {
    cancel();
    setSpeaking(false);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <MicOff className="w-4 h-4" />
        <span>Voice input not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Voice Input */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        disabled={isSpeaking}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4" />
            <span>{t('voiceInput')} (Stop)</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>{t('voiceInput')}</span>
          </>
        )}
      </button>

      {/* Voice Output */}
      {message && (
        <button
          onClick={isSpeaking ? stopSpeaking : () => speakMessage(message)}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isSpeaking 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          disabled={isListening}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t('voiceOutput')} (Stop)</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{t('voiceOutput')}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default VoiceInput;
