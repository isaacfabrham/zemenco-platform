'use client'

import { useState, useEffect } from 'react'
import { Activity, Zap, AlertCircle, Clock, Server, Cpu, Database } from 'lucide-react'

export default function AgentAdmin() {
  const [stats, setStats] = useState({
    requestsPerMinute: 0,
    avgLatency: '0ms',
    errorRate: '0%',
    fallbackActivations: 0,
    ollamaStatus: 'online',
    activeUsers: 0
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        requestsPerMinute: Math.floor(Math.random() * 50) + 10,
        avgLatency: `${Math.floor(Math.random() * 500) + 200}ms`,
        activeUsers: Math.floor(Math.random() * 5) + 1
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Agent Command Center</h1>
            <p className="text-white/40 uppercase text-[10px] font-bold tracking-[0.4em] mt-2">Zemen Co. Infrastructure Monitoring</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Ollama Node Alpha</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Traffic Volume" value={`${stats.requestsPerMinute} RPM`} icon={<Activity size={20} />} trend="+12% vs last hour" />
          <StatCard title="Avg Latency" value={stats.avgLatency} icon={<Clock size={20} />} trend="Within SLI" color="text-blue-400" />
          <StatCard title="Error Rate" value={stats.errorRate} icon={<AlertCircle size={20} />} trend="Healthy" color="text-green-400" />
          <StatCard title="Fallbacks" value={stats.fallbackActivations.toString()} icon={<Zap size={20} />} trend="0 in last 24h" color="text-yellow-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest text-[#B5780A]">Live Agent Logs</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden font-mono text-[11px]">
               <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between uppercase font-bold tracking-tighter">
                  <span>Timestamp</span>
                  <span>Agent</span>
                  <span>Event</span>
                  <span>Status</span>
               </div>
               <div className="p-4 space-y-3 h-[400px] overflow-y-auto">
                  <LogLine time="13:42:01" agent="Orchestrator" event="Intent: LUXURY_REBRAND" status="SUCCESS" />
                  <LogLine time="13:42:05" agent="Design" event="Generating Color Palette" status="SUCCESS" />
                  <LogLine time="13:42:08" agent="Code" event="Patching site_data.theme" status="SUCCESS" />
                  <LogLine time="13:42:10" agent="Review" event="WCAG AA Check" status="PASSED" />
                  <LogLine time="13:43:15" agent="Memory" event="Storing User Preference" status="SUCCESS" />
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <h2 className="text-xl font-black uppercase tracking-widest text-[#B5780A]">System Health</h2>
             <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
                <HealthItem label="GPU Cluster (2x A10)" value="42% Load" icon={<Cpu size={20}/>} status="Optimal" />
                <HealthItem label="Redis Connection" value="2.1ms Latency" icon={<Database size={20}/>} status="Stable" />
                <HealthItem label="Vector DB (pgvector)" value="1.2k Embeddings" icon={<Server size={20}/>} status="Online" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend, color = 'text-[#B5780A]' }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
       <div className="flex justify-between items-start mb-6">
          <div className={`p-3 bg-black rounded-xl ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{trend}</span>
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{title}</p>
       <h3 className="text-4xl font-black italic tracking-tighter">{value}</h3>
    </div>
  )
}

function LogLine({ time, agent, event, status }: any) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2 last:border-0">
       <span className="text-white/30 w-24">{time}</span>
       <span className="text-[#B5780A] w-32 font-bold">[{agent}]</span>
       <span className="flex-1 text-white/60">{event}</span>
       <span className="text-green-500 font-bold">{status}</span>
    </div>
  )
}

function HealthItem({ label, value, icon, status }: any) {
  return (
    <div className="flex items-center gap-6">
       <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white/20">{icon}</div>
       <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
          <div className="flex justify-between items-end">
             <span className="text-lg font-black italic tracking-tighter">{value}</span>
             <span className="text-[8px] font-black uppercase text-green-500 tracking-widest">{status}</span>
          </div>
          <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-green-500 w-3/4" />
          </div>
       </div>
    </div>
  )
}
