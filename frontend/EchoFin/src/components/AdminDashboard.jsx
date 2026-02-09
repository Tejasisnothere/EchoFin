import React from 'react';
import { 
  LayoutDashboard, Users, Phone, FileText, Settings, 
  Search, Bell, ChevronDown, MoreHorizontal, Clock, 
  CheckCircle, XCircle, BarChart2, Calendar, Shield
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Line, ComposedChart 
} from 'recharts';
import { motion } from 'framer-motion';

// --- Mock Data: Internal Ops Context ---

const callFrequencyData = [
  { day: 'Mon', calls: 1400, connected: 1200, missed: 200 },
  { day: 'Tue', calls: 2100, connected: 1800, missed: 300 },
  { day: 'Wed', calls: 1800, connected: 1600, missed: 200 },
  { day: 'Thu', calls: 2400, connected: 2100, missed: 300 },
  { day: 'Fri', calls: 2000, connected: 1700, missed: 300 },
  { day: 'Sat', calls: 1600, connected: 1400, missed: 200 },
  { day: 'Sun', calls: 1200, connected: 1100, missed: 100 },
];

const callOutcomeData = [
  { name: 'Completed', value: 65, color: '#4318FF' }, // Primary Blue
  { name: 'Missed', value: 20, color: '#6AD2FF' },    // Light Blue
  { name: 'Dropped', value: 15, color: '#EFF4FB' },   // Grey/White
];

const ongoingQueues = [
  { id: 1, name: "Loan Recovery Q1", pending: 434, status: "Active", icon: "🔥" },
  { id: 2, name: "New Customer Onboarding", pending: 252, status: "Active", icon: "👋" },
  { id: 3, name: "High Priority Support", pending: 180, status: "Idle", icon: "⭐" },
];

const recentCalls = [
  { id: 1, agent: "Sarah Jenkins", type: "Outbound Loan", time: "10:24 AM", duration: "12m 30s", status: "Completed", avatar: "SJ" },
  { id: 2, agent: "Michael Ross", type: "Inbound Support", time: "10:15 AM", duration: "00m 45s", status: "Missed", avatar: "MR" },
  { id: 3, agent: "David Kim", type: "Verification", time: "09:45 AM", duration: "05m 12s", status: "Completed", avatar: "DK" },
  { id: 4, agent: "Jessica Lee", type: "Follow-up", time: "09:30 AM", duration: "00m 00s", status: "Dropped", avatar: "JL" },
];

// --- Shared Components ---

const SidebarItem = ({ icon: Icon, label, active = false, badge = null }) => (
  <div className={`relative flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200 group
    ${active ? 'border-r-4 border-[#4318FF]' : 'hover:bg-gray-50'}`}>
    <Icon size={22} className={`transition-colors ${active ? 'text-[#4318FF]' : 'text-[#A3AED0] group-hover:text-[#4318FF]'}`} />
    <span className={`font-medium text-base ${active ? 'text-[#2B3674] font-bold' : 'text-[#A3AED0] group-hover:text-[#2B3674]'}`}>
      {label}
    </span>
    {badge && (
      <div className="absolute right-6 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </div>
    )}
  </div>
);

const KPICard = ({ title, value, subtext, icon: Icon, trendColor = "text-[#05CD99]" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-5 rounded-[20px] shadow-sm flex items-center justify-between"
  >
    <div>
      <p className="text-[#A3AED0] text-sm font-medium mb-1">{title}</p>
      <h3 className="text-[#2B3674] text-2xl font-bold tracking-tight">{value}</h3>
      <div className="flex items-center gap-1 mt-1">
        <span className={`text-xs font-bold ${trendColor}`}>{subtext}</span>
      </div>
    </div>
    <div className="h-[56px] w-[56px] rounded-full bg-[#F4F7FE] flex items-center justify-center text-[#4318FF]">
      <Icon size={28} />
    </div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-green-100 text-green-700",
    Active: "bg-green-100 text-green-700",
    Missed: "bg-red-100 text-red-700",
    Dropped: "bg-orange-100 text-orange-700",
    Idle: "bg-gray-100 text-gray-500",
  };
  const colorClass = styles[status] || "bg-gray-100 text-gray-600";
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      {status}
    </span>
  );
};

// --- Main Dashboard Component ---

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-[290px] bg-white h-screen fixed left-0 top-0 hidden xl:flex flex-col py-8 z-50 border-r border-gray-100">
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4318FF] rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
          <h1 className="text-[#2B3674] text-2xl font-bold tracking-tight">Admin<span className="font-normal">Panel</span></h1>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Users} label="Employees" />
          <SidebarItem icon={Phone} label="Call Logs" badge="8" />
          <SidebarItem icon={BarChart2} label="Analytics" />
          <SidebarItem icon={FileText} label="Loans" />
          <SidebarItem icon={Calendar} label="Schedule" />
          <div className="my-4 border-t border-gray-100 mx-6"></div>
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={Shield} label="Security" />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 xl:ml-[290px] p-6 lg:p-8 overflow-y-auto">
        
        {/* TOP NAV */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[#707EAE] text-sm font-medium">Pages / Dashboard</p>
            <h2 className="text-[#2B3674] text-3xl font-bold">Main Dashboard</h2>
          </div>

          <div className="flex items-center gap-4 bg-white p-2.5 rounded-full shadow-sm">
            <div className="bg-[#F4F7FE] flex items-center px-4 py-2.5 rounded-full w-64 transition-all focus-within:ring-2 ring-[#4318FF]/20">
              <Search size={18} className="text-[#8F9BBA]" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-[#2B3674] placeholder-[#8F9BBA]"
              />
            </div>
            <button className="text-[#A3AED0] hover:text-[#4318FF] transition p-1"><Bell size={20} /></button>
            <button className="text-[#A3AED0] hover:text-[#4318FF] transition p-1"><Settings size={20} /></button>
            <div className="w-10 h-10 rounded-full bg-[#11047A] text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition">
              AD
            </div>
          </div>
        </header>

        {/* KPI ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Total Calls Processed" 
            value="3,182" 
            subtext="+12% this week" 
            icon={Phone} 
          />
          <KPICard 
            title="Total Customers" 
            value="1,276" 
            subtext="+8% this week" 
            icon={Users} 
            trendColor="text-red-500" 
          />
          <KPICard 
            title="Active Employees" 
            value="24" 
            subtext="+2 today" 
            icon={CheckCircle} 
          />
          <KPICard 
            title="Total Loan Amount" 
            value="₹8.4 Cr" 
            subtext="Updated today" 
            icon={FileText} 
            trendColor="text-[#4318FF]"
          />
        </div>

        {/* MIDDLE GRID (Lists + Main Chart) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          {/* Left Column: Ongoing Call Queues */}
          <div className="xl:col-span-4 bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#2B3674] text-lg font-bold">Ongoing Call Queues</h3>
              <button className="p-2 bg-[#F4F7FE] rounded-lg text-[#4318FF] hover:bg-[#E6EFFD] transition"><MoreHorizontal size={20} /></button>
            </div>
            
            <div className="space-y-4">
              {ongoingQueues.map((queue) => (
                <div key={queue.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-lg">{queue.icon}</div>
                    <div>
                      <h4 className="text-[#2B3674] font-bold text-sm">{queue.name}</h4>
                      <p className="text-[#A3AED0] text-xs mt-1">{queue.pending} pending calls</p>
                    </div>
                  </div>
                  <StatusBadge status={queue.status} />
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-50">
                 <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[#2B3674] font-bold text-sm">Calls Cleared Today</h4>
                    <p className="text-[#05CD99] text-xs font-bold">+15%</p>
                 </div>
                 <div className="flex justify-between items-center">
                    <h4 className="text-[#2B3674] font-bold text-2xl">180</h4>
                    <p className="text-[#A3AED0] text-xs">vs last 7 days</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Main Chart (FIXED HEIGHT) */}
          <div className="xl:col-span-8 bg-white p-6 rounded-[20px] shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-[#2B3674] text-xl font-bold">Call Frequency</h3>
                <p className="text-[#A3AED0] text-sm mt-1">Last 7 Days (September 2024)</p>
              </div>
              <div className="flex gap-2 bg-[#F4F7FE] p-1 rounded-xl">
                <button className="px-3 py-1.5 text-[#A3AED0] rounded-lg text-xs font-bold hover:bg-white hover:text-[#2B3674] transition">Day</button>
                <button className="px-3 py-1.5 text-[#A3AED0] rounded-lg text-xs font-bold hover:bg-white hover:text-[#2B3674] transition">Week</button>
                <button className="px-3 py-1.5 bg-white text-[#2B3674] rounded-lg text-xs font-bold shadow-sm">Month</button>
              </div>
            </div>

            {/* FIXED: Added specific height (h-[350px]) to container */}
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={callFrequencyData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E5F2" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', padding: '12px' }}
                    cursor={{ fill: '#F4F7FE' }}
                  />
                  <Bar dataKey="calls" barSize={16} fill="#4318FF" radius={[20, 20, 0, 0]} name="Total Calls" />
                  <Bar dataKey="connected" barSize={16} fill="#6AD2FF" radius={[20, 20, 0, 0]} name="Connected" />
                  <Line type="monotone" dataKey="calls" stroke="#FFB547" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW (Recent Calls / Availability / Outcome) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Calls List */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#2B3674] text-lg font-bold">Recent Calls</h3>
              <ChevronDown className="text-[#A3AED0] cursor-pointer" size={20} />
            </div>
            <div className="space-y-4">
              {recentCalls.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4318FF] to-[#868CFF] text-white flex items-center justify-center font-bold text-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <h4 className="text-[#2B3674] font-bold text-sm">{item.agent}</h4>
                      <p className="text-[#A3AED0] text-xs">{item.time} • {item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={item.status} />
                    <p className="text-[#2B3674] font-bold text-xs mt-1">{item.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Availability */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm flex flex-col justify-between">
             <div>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[#2B3674] text-lg font-bold">Employee Availability</h3>
                   <button className="p-2 bg-[#F4F7FE] rounded-full text-[#4318FF]"><MoreHorizontal size={16} /></button>
                </div>
                
                <div className="flex items-center gap-3 mb-6 bg-[#F4F7FE] p-4 rounded-xl border border-transparent hover:border-[#4318FF] transition cursor-pointer">
                  <Clock size={20} className="text-[#A3AED0]" />
                  <span className="text-[#2B3674] font-bold text-sm">Shift: 09:00 AM - 06:00 PM</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                   <span className="px-3 py-1 bg-[#E6EFFD] text-[#4318FF] rounded-full text-xs font-bold">Loan Team</span>
                   <span className="px-3 py-1 bg-[#F4F7FE] text-[#A3AED0] rounded-full text-xs font-bold">Support</span>
                </div>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => <div key={i} className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white"></div>)}
                   <div className="w-9 h-9 rounded-full bg-[#E6EFFD] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#4318FF]">+8</div>
                </div>
                <button className="px-5 py-2 bg-[#4318FF] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/40 hover:bg-[#3311cc] transition">
                  View Schedule
                </button>
             </div>
          </div>

          {/* Call Outcome Breakdown (Donut) */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm flex flex-col items-center justify-center relative">
             <div className="w-full flex justify-between items-start mb-2">
                <h3 className="text-[#2B3674] text-lg font-bold">Call Outcomes</h3>
                <MoreHorizontal size={16} className="text-[#A3AED0] cursor-pointer" />
             </div>
             
             {/* FIXED: Added specific height (h-[220px]) to container */}
             <div className="w-full h-[220px] relative mt-2">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={callOutcomeData}
                     innerRadius={55}
                     outerRadius={75}
                     paddingAngle={5}
                     dataKey="value"
                     cornerRadius={5}
                   >
                     {callOutcomeData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                     ))}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Text for Donut */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-[#A3AED0] text-xs font-medium">Total</span>
                 <span className="text-[#2B3674] text-3xl font-bold">100%</span>
               </div>
             </div>
             
             <div className="bg-white shadow-sm rounded-[15px] p-4 flex justify-between w-full mt-4 border border-gray-50">
                <div className="text-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#4318FF] mb-1"></span>
                  <p className="text-[#A3AED0] text-xs">Done</p>
                  <p className="text-[#2B3674] font-bold">65%</p>
                </div>
                <div className="text-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#6AD2FF] mb-1"></span>
                  <p className="text-[#A3AED0] text-xs">Missed</p>
                  <p className="text-[#2B3674] font-bold">20%</p>
                </div>
                <div className="text-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#EFF4FB] mb-1"></span>
                  <p className="text-[#A3AED0] text-xs">Drop</p>
                  <p className="text-[#2B3674] font-bold">15%</p>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}