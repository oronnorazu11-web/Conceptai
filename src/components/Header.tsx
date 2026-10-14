import React, { useState } from 'react';
import { ConceptAILogo } from './ConceptAILogo';
import { Bell, Sparkles, User, Check, X, Search, Moon, ExternalLink, Shield } from 'lucide-react';
import { NotificationItem, UserProfile } from '../types';

interface HeaderProps {
  notifications: NotificationItem[];
  profile: UserProfile;
  onOpenAIDecompose: () => void;
  onMarkNotificationRead: (id: string) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onSelectSpecTab: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  profile,
  onOpenAIDecompose,
  onMarkNotificationRead,
  onUpdateProfile,
  onSelectSpecTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const mockProfiles: UserProfile[] = [
    {
      id: 'usr_001',
      name: 'Alex Mercer',
      email: 'alex.mercer@conceptai.app',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'AI Systems Architect & Scholar',
      streakDays: 14,
      productivityScore: 94,
      tasksCompleted: 48,
      focusMinutesToday: 135,
    },
    {
      id: 'usr_002',
      name: 'Elena Rostova',
      email: 'elena.rostova@university.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Graduate Student & Researcher',
      streakDays: 8,
      productivityScore: 88,
      tasksCompleted: 32,
      focusMinutesToday: 90,
    },
    {
      id: 'usr_003',
      name: 'David Kim',
      email: 'david.kim@startup.io',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'SaaS Founder & High Performer',
      streakDays: 21,
      productivityScore: 97,
      tasksCompleted: 64,
      focusMinutesToday: 180,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-xl bg-[#040816]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo Lockup */}
        <div className="flex items-center gap-3">
          <ConceptAILogo size="md" animate={true} />
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick AI Trigger */}
          <button
            onClick={onOpenAIDecompose}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            AI Breakdown
          </button>

          {/* Architecture Spec Shortcut */}
          <button
            onClick={onSelectSpecTab}
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-900/60 text-cyan-300 text-xs font-semibold hover:border-cyan-400/50 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            System Blueprint
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
              title="Notifications & Reminders"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Modal */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 space-y-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-900/40">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Neural Reminders & Alerts
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          notif.read
                            ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                            : 'bg-cyan-950/40 border-cyan-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-cyan-300">{notif.title}</span>
                          <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] mt-1 text-slate-300 leading-relaxed">
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <button
                            onClick={() => onMarkNotificationRead(notif.id)}
                            className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                          >
                            <Check className="w-3 h-3" /> Mark as acknowledged
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/40 transition-all"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-7 h-7 rounded-lg object-cover border border-cyan-400/40"
              />
              <span className="text-xs font-semibold text-slate-200 hidden md:block max-w-[100px] truncate">
                {profile.name}
              </span>
            </button>

            {/* Profile Switcher Popover */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 space-y-3 z-50">
                <div className="pb-3 border-b border-cyan-900/40">
                  <div className="text-sm font-bold text-white">{profile.name}</div>
                  <div className="text-xs text-cyan-400">{profile.email}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{profile.role}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Switch Test Persona
                  </label>
                  {mockProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onUpdateProfile(p);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left text-xs flex items-center gap-2.5 transition-all ${
                        profile.id === p.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
