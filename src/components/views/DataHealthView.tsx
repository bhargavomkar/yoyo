'use client';

import React, { useEffect, useState } from 'react';
import { DataLayerService } from '@/services/dataLayerService';
import { DataHealthSummary, ProviderRegistration } from '@/types/dataLayer';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { DataSourceBadge, DemoModeBanner } from '@/components/data/DataSourceBadge';
import { Activity, Database, ServerCrash, RefreshCw, CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react';

export const DataHealthView: React.FC = () => {
  const [summary, setSummary] = useState<DataHealthSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      setIsLoading(true);
      const data = await DataLayerService.getDataHealth();
      setSummary(data);
      setIsLoading(false);
    };
    fetchHealth();
  }, []);

  if (isLoading || !summary) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-neutral-400 animate-pulse">
          <Activity className="w-8 h-8" />
          <p className="text-sm font-medium">Scanning Data Layer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-150">
      <SectionHeader 
        title="Data Health & Providers" 
        subtitle="Manage financial data integrations, sync status, and data quality across the Faro ecosystem."
      />

      <DemoModeBanner mode={summary.dataMode} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Providers Connected" 
          value={`${summary.connectedProviders}/${summary.totalProviders}`} 
          icon={<Database className="w-4 h-4" />} 
          trend={summary.connectedProviders === summary.totalProviders ? 'All systems nominal' : 'Some providers offline'}
          trendColor={summary.connectedProviders === summary.totalProviders ? 'text-emerald-500' : 'text-amber-500'}
        />
        <StatCard 
          title="Total Records" 
          value={summary.totalRecords.toLocaleString()} 
          icon={<FileText className="w-4 h-4" />} 
          trend="Across all sources"
        />
        <StatCard 
          title="Quality Warnings" 
          value={summary.warningCount.toString()} 
          icon={<AlertTriangle className="w-4 h-4" />} 
          trend="Requires review"
          trendColor={summary.warningCount > 0 ? 'text-amber-500' : 'text-emerald-500'}
        />
        <StatCard 
          title="Data Errors" 
          value={summary.errorCount.toString()} 
          icon={<XCircle className="w-4 h-4" />} 
          trend="Failed syncs or invalid data"
          trendColor={summary.errorCount > 0 ? 'text-red-500' : 'text-emerald-500'}
        />
      </div>

      {/* Provider List */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-500" />
            Data Provider Registry
          </h3>
          <button className="text-xs font-medium text-[#1E4D3C] bg-[#EBF5F1] hover:bg-[#BAD6CC]/50 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync All
          </button>
        </div>

        <div className="divide-y divide-neutral-100">
          {summary.providers.sort((a, b) => b.priority - a.priority).map((provider) => (
            <ProviderRow key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
      
      {/* Document Processing Queue - Just a placeholder for now to show it exists */}
       <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
         <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/50">
           <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
             <FileText className="w-4 h-4 text-neutral-500" />
             Private Document Processing Queue
           </h3>
         </div>
         <div className="p-6 text-center text-sm text-neutral-500">
           {summary.processingJobs.length > 0 ? (
             <div className="text-left">
               <p className="mb-4">Recent Jobs: {summary.processingJobs.length}</p>
                {/* Simplified list */}
                <div className="space-y-2">
                  {summary.processingJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded border border-neutral-100">
                      <div>
                        <p className="font-medium text-neutral-800">{job.fileName}</p>
                        <p className="text-xs text-neutral-500">Entity: {job.entityName || 'Unassigned'} • Uploaded: {new Date(job.uploadedAt).toLocaleString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${job.status === 'verified' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
             </div>
           ) : (
             <p>No active processing jobs.</p>
           )}
         </div>
       </div>

    </div>
  );
};

// ---- Subcomponents ----

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend: string; trendColor?: string }> = ({ title, value, icon, trend, trendColor = 'text-neutral-500' }) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-32">
    <div className="flex items-center justify-between text-neutral-500">
      <span className="text-sm font-medium">{title}</span>
      {icon}
    </div>
    <div className="mt-2">
      <div className="text-2xl font-bold text-neutral-900">{value}</div>
      <div className={`text-xs mt-1 ${trendColor}`}>{trend}</div>
    </div>
  </div>
);

const ProviderRow: React.FC<{ provider: ProviderRegistration }> = ({ provider }) => {
  const getStatusIcon = () => {
    switch (provider.status) {
      case 'connected': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'disconnected':
      case 'error': return <ServerCrash className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getStatusIcon()}</div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-neutral-900">{provider.name}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 border border-neutral-200">
              {provider.type.replace('_', ' ')}
            </span>
            {provider.isDemo && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Priority: {provider.priority} • Last Sync: {provider.lastSyncAt ? new Date(provider.lastSyncAt).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-center hidden md:block">
          <div className="font-medium text-neutral-900">{provider.apiUsage ? `${provider.apiUsage.requestsToday}/${provider.apiUsage.requestLimit}` : 'Unlimited'}</div>
          <div className="text-xs text-neutral-500">Rate Limit</div>
        </div>
        <div className="text-center hidden sm:block">
          <div className="font-medium text-neutral-900">{provider.isDemo ? '0ms' : '42ms'}</div>
          <div className="text-xs text-neutral-500">Latency</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-neutral-900">{provider.recordCount.toLocaleString()}</div>
          <div className="text-xs text-neutral-500">Records</div>
        </div>
        <div className="text-center">
          <div className={`font-medium ${provider.warningCount > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>{provider.warningCount}</div>
          <div className="text-xs text-neutral-500">Warnings</div>
        </div>
        <div className="text-center">
          <div className={`font-medium ${provider.errorCount > 0 ? 'text-red-600' : 'text-neutral-900'}`}>{provider.errorCount}</div>
          <div className="text-xs text-neutral-500">Errors</div>
        </div>
      </div>
    </div>
  );
};
