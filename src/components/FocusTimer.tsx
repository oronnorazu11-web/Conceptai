import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, Flame, Award, Headphones } from 'lucide-react';
import { Task } from '../types';
import confetti from 'canvas-confetti';

interface FocusTimerProps {
  tasks: Task[];
  onLogFocusMinutes: (minutes: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ tasks, onLogFocusMinutes }) => {
  const [mode, setMode] = useState<'pomodoro' | 'sprint' | 'ultradian' | 'short'>('pomodoro');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'cyber_hum' | 'rain' | 'binaural'>('none');
  const [completedSessions, setCompletedSessions] = useState<number>(3);

  // Audio Context Ref for synthetic sound generation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ osc?: OscillatorNode; gain?: GainNode; filter?: BiquadFilterNode; noise?: AudioBufferSourceNode } | null>(null);

  const modeDurations = {
    short: 15 * 60,
    pomodoro: 25 * 60,
    sprint: 50 * 60,
    ultradian: 90 * 60,
  };

  const handleModeChange = (newMode: 'pomodoro' | 'sprint' | 'ultradian' | 'short') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeDurations[newMode]);
  };

  // Timer countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#38bdf8', '#2563eb', '#ffffff'],
    });
    const completedMins = Math.round(modeDurations[mode] / 60);
    onLogFocusMinutes(completedMins);
    setCompletedSessions((s) => s + 1);
    stopSyntheticSound();
  };

  // Web Audio Synthetic Ambience (Cyber Hum / Rain / Binaural)
  const startSyntheticSound = (type: 'cyber_hum' | 'rain' | 'binaural') => {
    stopSyntheticSound();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (type === 'cyber_hum') {
        // Deep warm cyber resonant hum
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(108, ctx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc2.start();
        soundNodesRef.current = { osc, gain };
      } else if (type === 'binaural') {
        // Alpha wave binaural beats (40Hz gamma / 10Hz alpha)
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();
        oscLeft.frequency.setValueAtTime(200, ctx.currentTime);
        oscRight.frequency.setValueAtTime(210, ctx.currentTime); // 10Hz beat
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);
        oscLeft.start();
        oscRight.start();
        soundNodesRef.current = { osc: oscLeft, gain };
      } else if (type === 'rain') {
        // Soft pink noise rain simulation
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.11;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start();
        soundNodesRef.current = { gain, filter, noise: whiteNoise };
      }
    } catch (e) {
      console.warn('Audio synthesis initialized with error or disabled', e);
    }
  };

  const stopSyntheticSound = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    soundNodesRef.current = null;
  };

  const toggleSound = (type: 'none' | 'cyber_hum' | 'rain' | 'binaural') => {
    if (ambientSound === type || type === 'none') {
      stopSyntheticSound();
      setAmbientSound('none');
    } else {
      setAmbientSound(type);
      startSyntheticSound(type);
    }
  };

  useEffect(() => {
    return () => {
      stopSyntheticSound();
    };
  }, []);

  const totalDuration = modeDurations[mode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Timer Container Card */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'short', label: '15m Quick Focus' },
            { id: 'pomodoro', label: '25m Pomodoro' },
            { id: 'sprint', label: '50m Deep Sprint' },
            { id: 'ultradian', label: '90m Ultradian Rhythm' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleModeChange(item.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                mode === item.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Circular Radial Timer Visual */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="rgba(15, 23, 42, 0.8)"
                strokeWidth="12"
              />
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>

            {/* Centered Digital Display */}
            <div className="absolute flex flex-col items-center text-center">
              <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                {formattedTime}
              </span>
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mt-2">
                {isRunning ? 'Flow State Active' : 'Session Paused'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                {Math.round(progressPercent)}% elapsed
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(modeDurations[mode]);
              }}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  PAUSE FOCUS
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  ENTER FLOW STATE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Linked Task Selector */}
        <div className="mt-8 pt-6 border-t border-cyan-900/40 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">
              Focus Target Task
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl p-3 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-medium"
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.priority.toUpperCase()}] {t.title}
                </option>
              ))}
            </select>
            {currentTask && (
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                {currentTask.description}
              </p>
            )}
          </div>

          {/* Synthetic Sound Generator */}
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                Synthetic Neuro-Acoustics
              </span>
              <span className="text-[10px] text-cyan-400 lowercase font-mono">Web Audio API</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cyber_hum', label: 'Cyber Hum' },
                { id: 'binaural', label: '10Hz Alpha' },
                { id: 'rain', label: 'Pink Rain' },
              ].map((sound) => {
                const active = ambientSound === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => toggleSound(sound.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-center ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {sound.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Session Stats */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Today's Sessions: <strong className="text-white">{completedSessions} cycles</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Total Flow Time: <strong className="text-white">{completedSessions * 25 + 35} minutes</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
