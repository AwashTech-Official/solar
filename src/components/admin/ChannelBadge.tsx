'use client';

import React from 'react';
import {
  Globe,
  MessageSquare,
  Send,
  MessageCircle,
  Mail,
  PhoneCall,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';
import { LeadSource } from '@/src/lib/supabase';

interface ChannelBadgeProps {
  source: LeadSource | string;
  size?: 'sm' | 'md';
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({ source, size = 'sm' }) => {
  const norm = (source || 'website').toLowerCase().trim();

  let label = 'Website';
  let icon = <Globe className="w-3.5 h-3.5" />;
  let colorStyles = 'text-[#f59e0b] bg-[#162238] border-[#f59e0b]/30';

  if (norm.includes('jotform')) {
    label = 'Jotform Webhook';
    icon = <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />;
    colorStyles = 'text-amber-300 bg-amber-950/40 border-amber-700/50';
  } else if (norm.includes('whatsapp')) {
    label = 'WhatsApp';
    icon = <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
    colorStyles = 'text-emerald-300 bg-emerald-950/40 border-emerald-800/50';
  } else if (norm.includes('telegram')) {
    label = 'Telegram';
    icon = <Send className="w-3.5 h-3.5 text-sky-400" />;
    colorStyles = 'text-sky-300 bg-sky-950/40 border-sky-800/50';
  } else if (norm.includes('messenger')) {
    label = 'Messenger';
    icon = <MessageCircle className="w-3.5 h-3.5 text-blue-400" />;
    colorStyles = 'text-blue-300 bg-blue-950/40 border-blue-800/50';
  } else if (norm.includes('email') || norm.includes('mail')) {
    label = 'Email Direct';
    icon = <Mail className="w-3.5 h-3.5 text-amber-300" />;
    colorStyles = 'text-amber-200 bg-amber-950/40 border-amber-800/50';
  } else if (norm.includes('phone') || norm.includes('call')) {
    label = 'Phone Call';
    icon = <PhoneCall className="w-3.5 h-3.5 text-orange-400" />;
    colorStyles = 'text-orange-300 bg-orange-950/40 border-orange-800/50';
  } else if (norm !== 'website') {
    label = source.charAt(0).toUpperCase() + source.slice(1);
    icon = <Share2 className="w-3.5 h-3.5 text-[#94a3b8]" />;
    colorStyles = 'text-[#f8fafc] bg-[#162238] border-[rgba(241,245,249,0.15)]';
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${paddingClass} ${colorStyles} whitespace-nowrap`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
