import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../utils/soundEffects';
import { 
  Mic, MicOff, Volume2, Sparkles, Cpu, CheckCircle2, 
  Tv, Wind, Fan, DoorClosed, Lock, ShieldAlert, Send, Bot, User 
} from 'lucide-react';

export const VoiceControl = () => {
  const { devices, toggleDevice, security, fetchSecurity } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [aiResponse, setAiResponse] = useState('ALEXUS AI Voice Assistant online. Speak or type any command to control your virtual smart home.');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hello! I am ALEXUS, your virtual home AI assistant. You can give me voice or text commands to control your lights, ceiling fan, TV, AC, and home security just like in real life!' }
  ]);
  const [lastExecutedCmd, setLastExecutedCmd] = useState('');

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      // Select an attractive, sweet, warm female voice
      const sweetVoice = voices.find(v => 
        (v.name.includes('Google UK English Female') || 
         v.name.includes('Google US English') ||
         v.name.includes('Samantha') || 
         v.name.includes('Victoria') ||
         v.name.includes('Karen') ||
         v.name.includes('Zira') ||
         v.name.includes('Natural') ||
         v.name.toLowerCase().includes('female')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (sweetVoice) {
        utterance.voice = sweetVoice;
      }

      utterance.rate = 0.96;
      utterance.pitch = 1.18; // Sweet, attractive, friendly pitch
      window.speechSynthesis.speak(utterance);
    }
  };

  const executeVoiceCommand = (rawCmd) => {
    if (!rawCmd || !rawCmd.trim()) return;
    const cmd = rawCmd.toLowerCase();
    setVoiceText(rawCmd);
    setLastExecutedCmd(rawCmd);
    let matchedResponse = '';
    let isSuccess = true;
    let isDeviceOn = true;

    // 1. Ceiling Fan Command
    if (cmd.includes('fan') || cmd.includes('ceiling fan')) {
      const fan = devices.find(d => d.name.includes('Fan'));
      if (fan) {
        const isExplicitOff = cmd.includes('off') || cmd.includes('stop') || cmd.includes('shut') || cmd.includes('close') || cmd.includes('disable') || cmd.includes('turn off');
        const turnOn = !isExplicitOff && (cmd.includes('on') || cmd.includes('start') || cmd.includes('spin') || cmd.includes('enable'));
        isDeviceOn = turnOn;
        if (fan.state !== turnOn) toggleDevice(fan._id);
        matchedResponse = `Living Room Ceiling Fan switched ${turnOn ? 'ON' : 'OFF'}.`;
      } else {
        matchedResponse = `Living Room Ceiling Fan status synchronized.`;
      }
    }
    // 2. Smart TV Command
    else if (cmd.includes('smart tv') || cmd.includes('tv') || cmd.includes('television')) {
      const tv = devices.find(d => d.name.includes('Smart TV'));
      if (tv) {
        const turnOn = cmd.includes('on') || cmd.includes('open') || cmd.includes('start') || !cmd.includes('off');
        isDeviceOn = turnOn;
        if (tv.state !== turnOn) toggleDevice(tv._id);
        matchedResponse = `Smart TV switched ${turnOn ? 'ON (Streaming Active)' : 'OFF'}.`;
      }
    }
    // 3. Air Conditioner / AC Command
    else if (cmd.includes('air conditioner') || cmd.includes('ac') || cmd.includes('cooling') || cmd.includes('cooler')) {
      const ac = devices.find(d => d.name.includes('Air Conditioner'));
      if (ac) {
        const turnOn = cmd.includes('on') || cmd.includes('start') || cmd.includes('cool') || !cmd.includes('off');
        isDeviceOn = turnOn;
        if (ac.state !== turnOn) toggleDevice(ac._id);
        matchedResponse = `Air Conditioner in Bedroom switched ${turnOn ? 'ON (Cooling Mode at 22°C)' : 'OFF'}.`;
      }
    }
    // 4. Garage Door Command
    else if (cmd.includes('garage') || cmd.includes('garage door')) {
      const gDoor = devices.find(d => d.name.includes('Garage Door'));
      if (gDoor) {
        const open = cmd.includes('open') || cmd.includes('on') || !cmd.includes('close');
        isDeviceOn = open;
        if (gDoor.state !== open) toggleDevice(gDoor._id);
        matchedResponse = `Garage Door ${open ? 'OPENED' : 'CLOSED'}.`;
      }
    }
    // 5. Entrance Door Lock Command
    else if (cmd.includes('door lock') || cmd.includes('lock door') || cmd.includes('entrance') || cmd.includes('front door')) {
      const lock = cmd.includes('lock') && !cmd.includes('unlock');
      fetch('/api/security/toggle-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinCode: '1234' })
      }).then(() => fetchSecurity());
      matchedResponse = `Main Entrance Door ${lock ? 'LOCKED & ARMED' : 'UNLOCKED'}.`;
    }
    // 6. Alarm System Command
    else if (cmd.includes('alarm') || cmd.includes('intruder alert') || cmd.includes('security alarm')) {
      fetch('/api/security/toggle-alarm', { method: 'POST' }).then(() => fetchSecurity());
      matchedResponse = 'Home Security Perimeter Alarm toggled.';
    }
    // 7. All Lights / Specific Light Commands
    else if (cmd.includes('light') || cmd.includes('lights') || cmd.includes('bulb')) {
      const turnOn = cmd.includes('on') || !cmd.includes('off');
      isDeviceOn = turnOn;

      if (cmd.includes('living')) {
        const dev = devices.find(d => d.name.includes('Living Room Light'));
        if (dev && dev.state !== turnOn) toggleDevice(dev._id);
        matchedResponse = `Living Room Light switched ${turnOn ? 'ON' : 'OFF'}.`;
      } else if (cmd.includes('bedroom')) {
        const dev = devices.find(d => d.name.includes('Bedroom Light'));
        if (dev && dev.state !== turnOn) toggleDevice(dev._id);
        matchedResponse = `Bedroom Light switched ${turnOn ? 'ON' : 'OFF'}.`;
      } else if (cmd.includes('kitchen')) {
        const dev = devices.find(d => d.name.includes('Kitchen Light'));
        if (dev && dev.state !== turnOn) toggleDevice(dev._id);
        matchedResponse = `Kitchen Light switched ${turnOn ? 'ON' : 'OFF'}.`;
      } else {
        devices.filter(d => d.category === 'Lighting').forEach(d => {
          if (d.state !== turnOn) toggleDevice(d._id);
        });
        matchedResponse = `Switched ${turnOn ? 'ON' : 'OFF'} all virtual home lighting fixtures.`;
      }
    }
    // 8. Global Master Switch Commands
    else if (cmd.includes('turn off all') || cmd.includes('switch off all') || cmd.includes('all off') || cmd.includes('goodnight')) {
      devices.forEach(d => {
        if (d.state) toggleDevice(d._id);
      });
      matchedResponse = 'Goodnight! Switched OFF all virtual home appliances.';
    } else if (cmd.includes('turn on all') || cmd.includes('switch on all') || cmd.includes('all on')) {
      devices.forEach(d => {
        if (!d.state) toggleDevice(d._id);
      });
      matchedResponse = 'Switched ON all virtual home appliances.';
    }
    // Fallback Natural Assistant Response
    else {
      matchedResponse = `ALEXUS AI Assistant processed command: "${rawCmd}". Virtual home telemetry updated.`;
    }

    // Play synthesized sound effect
    soundEffects.playSuccessSound();
    soundEffects.playToggleSound(isDeviceOn);

    setAiResponse(matchedResponse);
    speakText(matchedResponse);

    // Append to conversation chat history
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: rawCmd },
      { sender: 'ai', text: matchedResponse }
    ]);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const cmd = chatInput;
    setChatInput('');
    executeVoiceCommand(cmd);
  };

  const toggleListening = () => {
    soundEffects.playMicListenSound();

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setAiResponse('Browser speech recognition unavailable in this window. Use the voice command buttons or text chat below!');
      soundEffects.playErrorSound();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceText('Listening for your voice command...');
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      executeVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      soundEffects.playErrorSound();
      setVoiceText('Speech recognition cancelled or timed out.');
    };

    recognition.start();
  };

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="glass-panel p-6 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-extrabold text-cyan-400 flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyan-400" />
            ALEXUS AI Voice Assistant & Virtual Home HUD
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Natural voice chat AI integrated directly with 3D Virtual Home appliances & audio feedback chimes.
          </p>
        </div>
      </div>

      {/* Main HUD Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Mic Visualizer & Presets */}
        <div className="lg:col-span-1 glass-panel p-6 border border-slate-800 flex flex-col items-center justify-between space-y-6 text-center">
          <div className="hud-title text-xs font-black text-cyan-400 tracking-wider">
            {isListening ? 'VOICE RECOGNITION ACTIVE' : 'ALEXUS AI VOICE ENGINE'}
          </div>

          <div className="relative">
            <div className={`w-36 h-36 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
              isListening
                ? 'border-cyan-400 shadow-2xl shadow-cyan-400/80 scale-110 animate-pulse'
                : 'border-cyan-500/30 bg-slate-950/80 hover:border-cyan-400/60'
            }`}>
              <button
                onClick={toggleListening}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-xl transition-transform hover:scale-105"
                title="Click to Speak"
              >
                {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="text-[11px] font-bold text-slate-400">
              {isListening ? 'Speak now into microphone...' : 'Click microphone to speak or pick preset below'}
            </div>
            {lastExecutedCmd && (
              <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> "{lastExecutedCmd}"
              </div>
            )}
          </div>

          {/* Quick Voice Command Buttons */}
          <div className="w-full pt-4 border-t border-slate-800">
            <div className="text-[10px] uppercase font-black text-slate-400 hud-title mb-3">
              Instant Command Buttons
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Turn ON Fan', cmd: 'Turn on Ceiling Fan', icon: Fan },
                { label: 'Turn OFF Fan', cmd: 'Turn off Ceiling Fan', icon: Fan },
                { label: 'Turn ON Lights', cmd: 'Turn on Lights', icon: Sparkles },
                { label: 'Turn OFF Lights', cmd: 'Turn off Lights', icon: Sparkles },
                { label: 'Turn ON AC', cmd: 'Turn on Air Conditioner', icon: Wind },
                { label: 'Turn ON TV', cmd: 'Turn on Smart TV', icon: Tv },
                { label: 'Open Garage', cmd: 'Open Garage Door', icon: DoorClosed },
                { label: 'Lock Door', cmd: 'Lock Main Door', icon: Lock }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => executeVoiceCommand(item.cmd)}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-bold text-slate-200 transition-all flex items-center justify-start gap-2 shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive AI Voice Chat Trajectory Stream */}
        <div className="lg:col-span-2 glass-panel p-6 border border-slate-800 flex flex-col justify-between h-[540px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="hud-title text-xs font-black text-cyan-400 flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" /> ALEXUS AI Voice Assistant Chat Trajectory
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
              Virtual Home Sync Active
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  msg.sender === 'user' ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold rounded-tr-none'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-100 font-medium rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleChatSubmit} className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type or speak a command (e.g. 'Turn on ceiling fan', 'Turn off lights')..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
