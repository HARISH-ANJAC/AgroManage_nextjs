"use client";

import React, { useEffect, useState } from 'react';
import { useSchedulerStore } from '@/hooks/useSchedulerStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Play, 
  Settings2, 
  Save, 
  RefreshCcw, 
  ToggleLeft, 
  ToggleRight,
  Mail,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function SchedulerPage() {
  const { settings, isLoading, fetchSettings, updateSetting } = useSchedulerStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEdit = (job: any) => {
    setEditingId(job.SNO);
    setEditForm({
      cronExpression: job.CRON_EXPRESSION,
      isEnabled: job.IS_ENABLED,
      remarks: job.REMARKS
    });
  };

  const handleSave = async (sno: number) => {
    try {
      await updateSetting(sno, editForm);
      toast.success("Job configuration updated");
      setEditingId(null);
      fetchSettings();
    } catch (error) {
      toast.error("Failed to update job");
    }
  };

  const toggleStatus = async (job: any) => {
    try {
      const newStatus = job.IS_ENABLED === 'True' ? 'False' : 'True';
      await updateSetting(job.SNO, {
        cronExpression: job.CRON_EXPRESSION,
        isEnabled: newStatus,
        remarks: job.REMARKS
      });
      toast.success(`Job ${newStatus === 'True' ? 'Enabled' : 'Disabled'}`);
      fetchSettings();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1A2E28] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <Settings2 className="w-6 h-6 text-[#A3E635]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">System Scheduler</h1>
                <p className="text-sm text-[#64748B] font-medium flex items-center gap-1.5">
                  Manage automated background processes and notifications
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => fetchSettings()} 
              variant="outline"
              disabled={isLoading}
              className="rounded-xl border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all flex items-center gap-2 px-5 py-6"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-semibold text-[#475569]">Refresh Jobs</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-all group-hover:bg-green-100" />
            <div className="relative">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-[#1E293B]">{settings.filter(s => s.IS_ENABLED === 'True').length}</div>
              <div className="text-[#64748B] text-sm font-medium">Active Automated Jobs</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-all group-hover:bg-blue-100" />
            <div className="relative">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-[#1E293B]">1</div>
              <div className="text-[#64748B] text-sm font-medium">Email Dispatcher Logs</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 transition-all group-hover:bg-purple-100" />
            <div className="relative">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-[#1E293B]">5:00 PM</div>
              <div className="text-[#64748B] text-sm font-medium">Next Scheduled Summary</div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-[#CBD5E1]">
                <RefreshCcw className="w-10 h-10 text-[#94A3B8] animate-spin mb-4" />
                <p className="text-[#64748B] font-medium">Loading scheduler configuration...</p>
             </div>
          ) : settings.map((job) => (
            <div 
              key={job.SNO} 
              className={`bg-white rounded-[2.5rem] border ${editingId === job.SNO ? 'border-[#1A2E28] ring-4 ring-[#1A2E28]/5' : 'border-[#E2E8F0]'} transition-all overflow-hidden`}
            >
              <div className="p-8">
                <div className="flex flex-wrap justify-between items-start gap-6">
                  <div className="flex gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${job.IS_ENABLED === 'True' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {job.IS_ENABLED === 'True' ? <Zap className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-[#1E293B]">{job.JOB_NAME}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.IS_ENABLED === 'True' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {job.IS_ENABLED === 'True' ? 'Operational' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-[#64748B] mt-1 font-medium max-w-xl">{job.REMARKS}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editingId === job.SNO ? (
                      <Button 
                        onClick={() => handleSave(job.SNO)} 
                        className="bg-[#1A2E28] hover:bg-[#254139] text-white rounded-2xl px-6 flex items-center gap-2 h-12 shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => toggleStatus(job)} 
                          variant="outline"
                          className="rounded-2xl border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center gap-2 h-12"
                        >
                          {job.IS_ENABLED === 'True' ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-[#94A3B8]" />}
                          <span className="font-semibold">{job.IS_ENABLED === 'True' ? 'Disable' : 'Enable'}</span>
                        </Button>
                        <Button 
                          onClick={() => handleEdit(job)} 
                          variant="outline"
                          className="rounded-2xl border-[#E2E8F0] hover:bg-[#F1F5F9] flex items-center gap-2 h-12"
                        >
                          <Settings2 className="w-4 h-4 text-[#475569]" />
                          <span className="font-semibold text-[#475569]">Configure</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-[#F8FAFC] rounded-[1.5rem] border border-[#F1F5F9]">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold">Cron Schedule</Label>
                    {editingId === job.SNO ? (
                      <Input 
                        value={editForm.cronExpression} 
                        onChange={(e) => setEditForm({...editForm, cronExpression: e.target.value})}
                        className="bg-white border-[#E2E8F0] rounded-xl font-mono text-sm"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-[#334155] font-mono text-sm font-semibold">
                        <Clock className="w-4 h-4 text-[#94A3B8]" />
                        {job.CRON_EXPRESSION}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold">Last Successful Run</Label>
                    <div className="flex items-center gap-2 text-[#334155] font-semibold text-sm">
                      <Calendar className="w-4 h-4 text-[#94A3B8]" />
                      {job.LAST_RUN ? new Date(job.LAST_RUN).toLocaleString() : 'Never'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold">Modified By</Label>
                    <div className="text-[#334155] font-semibold text-sm flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#E2E8F0] rounded-full flex items-center justify-center text-[10px] text-[#475569]">
                        {job.MODIFIED_BY?.charAt(0)}
                      </div>
                      {job.MODIFIED_BY || 'System'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold">Frequency Recommendation</Label>
                    <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 inline-flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Daily at 5 PM is optimal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
