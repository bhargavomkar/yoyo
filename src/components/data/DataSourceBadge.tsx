'use client';

import React from 'react';
import { DataSourceStatus, DataFreshness } from '@/types/dataLayer';
import { Shield, AlertTriangle, HelpCircle, Clock, User, FlaskConical, Database } from 'lucide-react';

interface DataSourceBadgeProps {
  status: DataSourceStatus;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

const STATUS_CONFIG: Record<DataSourceStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  verified:      { label: 'Verified',      bg: 'bg-emerald-50 border-emerald-200',  text: 'text-emerald-700',  icon: <Shield className="w-3 h-3" /> },
  estimated:     { label: 'Estimated',     bg: 'bg-amber-50 border-amber-200',      text: 'text-amber-700',    icon: <FlaskConical className="w-3 h-3" /> },
  derived:       { label: 'Derived',       bg: 'bg-blue-50 border-blue-200',        text: 'text-blue-700',     icon: <Database className="w-3 h-3" /> },
  user_provided: { label: 'User Provided', bg: 'bg-violet-50 border-violet-200',    text: 'text-violet-700',   icon: <User className="w-3 h-3" /> },
  demo:          { label: 'Demo Data',     bg: 'bg-neutral-100 border-neutral-300',  text: 'text-neutral-500',  icon: <HelpCircle className="w-3 h-3" /> },
  unavailable:   { label: 'Unavailable',   bg: 'bg-red-50 border-red-200',          text: 'text-red-600',      icon: <AlertTriangle className="w-3 h-3" /> },
};

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({ status, showLabel = true, size = 'sm' }) => {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'xs' ? 'text-[10px] px-1.5 py-0.5 gap-0.5' : size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${sizeClasses}`}>
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

// ---- Freshness Badge ----

interface FreshnessBadgeProps {
  freshness: DataFreshness;
  lastUpdated?: string;
  size?: 'xs' | 'sm';
}

const FRESHNESS_CONFIG: Record<DataFreshness, { label: string; color: string }> = {
  live:    { label: 'Live',    color: 'text-emerald-600' },
  delayed: { label: 'Delayed', color: 'text-amber-600' },
  current: { label: 'Current', color: 'text-blue-600' },
  stale:   { label: 'Stale',   color: 'text-red-500' },
  demo:    { label: 'Demo',    color: 'text-neutral-400' },
};

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({ freshness, lastUpdated, size = 'sm' }) => {
  const config = FRESHNESS_CONFIG[freshness];
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs';

  const timeAgo = lastUpdated ? getTimeAgo(lastUpdated) : '';

  return (
    <span className={`inline-flex items-center gap-1 ${config.color} ${textSize}`}>
      <Clock className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      <span>{config.label}</span>
      {timeAgo && <span className="text-neutral-400">· {timeAgo}</span>}
    </span>
  );
};

function getTimeAgo(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ---- Demo Mode Banner ----

export const DemoModeBanner: React.FC<{ mode: 'demo' | 'live' }> = ({ mode }) => {
  if (mode !== 'demo') return null;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center gap-2 text-amber-700 text-xs font-medium">
      <HelpCircle className="w-3.5 h-3.5" />
      <span>DEMO MODE — All financial data shown is synthetic demonstration data. No real providers are connected.</span>
    </div>
  );
};
