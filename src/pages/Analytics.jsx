import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Target, Brain, Award } from "lucide-react";

export default function Analytics() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, "users", currentUser.uid)).then(s => { if (s.exists()) setProfile(s.data()); });
    }
  }, [currentUser]);

  const testHistory = profile?.testHistory || [];

  const mathTests = testHistory.filter(t => t.type === "math");
  const engTests = testHistory.filter(t => t.type === "english");

  const avgScore = (arr) => arr.length ? Math.round(arr.reduce((a, t) => a + (t.score / t.total) * 100, 0) / arr.length) : 0;
  const mathAvg = avgScore(mathTests);
  const engAvg = avgScore(engTests);

  const estimatedMath = Math.round(200 + (mathAvg / 100) * 600);
  const estimatedEng = Math.round(200 + (engAvg / 100) * 600);
  const totalEstimate = estimatedMath + estimatedEng;

  const chartData = testHistory.slice(-10).map((t, i) => ({
    name: `Test ${i + 1}`,
    score: Math.round((t.score / t.total) * 100),
    type: t.type,
  }));

  const topicPerformance = [
    { subject: "Math Easy", score: mathTests.filter(t => t.difficulty === "Easy").length > 0 ? avgScore(mathTests.filter(t => t.difficulty === "Easy")) : 50 },
    { subject: "Math Hard", score: mathTests.filter(t => t.difficulty === "Hard").length > 0 ? avgScore(mathTests.filter(t => t.difficulty === "Hard")) : 30 },
    { subject: "Eng Easy", score: engTests.filter(t => t.difficulty === "Easy").length > 0 ? avgScore(engTests.filter(t => t.difficulty === "Easy")) : 60 },
    { subject: "Eng Hard", score: engTests.filter(t => t.difficulty === "Hard").length > 0 ? avgScore(engTests.filter(t => t.difficulty === "Hard")) : 40 },
    { subject: "Eng Medium", score: engTests.filter(t => t.difficulty === "Medium").length > 0 ? avgScore(engTests.filter(t => t.difficulty === "Medium")) : 55 },
    { subject: "Math Medium", score: mathTests.filter(t => t.difficulty === "Medium").length > 0 ? avgScore(mathTests.filter(t => t.difficulty === "Medium")) : 45 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-white mb-2">My Analytics</h1>
        <p className="text-slate-400 mb-8">Track your SAT performance and identify areas to improve.</p>

        {/* Estimated SAT Score */}
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Award size={24} className="text-blue-400" />
            <h2 className="text-xl font-display font-bold text-white">Estimated SAT Score</h2>
            <span className="text-slate-400 text-sm">(based on practice test performance)</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-display font-bold text-violet-400">{testHistory.length > 0 ? estimatedMath : "—"}</p>
              <p className="text-slate-400 mt-1 text-sm">Math Score</p>
              <p className="text-slate-500 text-xs">out of 800</p>
            </div>
            <div className="text-center border-x border-slate-700">
              <p className="text-5xl font-display font-bold text-blue-400">{testHistory.length > 0 ? totalEstimate : "—"}</p>
              <p className="text-slate-400 mt-1">Total SAT Score</p>
              <p className="text-slate-500 text-xs">out of 1600</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-display font-bold text-cyan-400">{testHistory.length > 0 ? estimatedEng : "—"}</p>
              <p className="text-slate-400 mt-1 text-sm">EBRW Score</p>
              <p className="text-slate-500 text-xs">out of 800</p>
            </div>
          </div>
          {testHistory.length === 0 && (
            <p className="text-center text-slate-500 text-sm mt-4">Take practice tests to see your estimated score.</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score trend */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-blue-400" /> Score Trend</h3>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="url(#scoreGrad)" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500 text-sm">Take more tests to see trends</div>
            )}
          </div>

          {/* Radar */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><Brain size={18} className="text-violet-400" /> Topic Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={topicPerformance}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Tests Taken", value: testHistory.length, icon: Target, color: "text-blue-400" },
            { label: "Math Avg", value: `${mathAvg}%`, icon: TrendingUp, color: "text-violet-400" },
            { label: "English Avg", value: `${engAvg}%`, icon: TrendingUp, color: "text-cyan-400" },
            { label: "Best Score", value: testHistory.length ? `${Math.max(...testHistory.map(t => Math.round((t.score / t.total) * 100)))}%` : "—", icon: Award, color: "text-amber-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <Icon size={18} className={`${color} mb-2`} />
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-slate-400 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Personalized Recommendations</h3>
          {testHistory.length === 0 ? (
            <p className="text-slate-400 text-sm">Complete some practice tests to get personalized recommendations.</p>
          ) : (
            <ul className="space-y-3">
              {mathAvg < 70 && <li className="flex items-start gap-3 text-sm"><span className="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0" /><span className="text-slate-300">Your SAT Math score needs improvement. Focus on the <span className="text-violet-400">Algebra and Advanced Math</span> lessons in the SAT Math course.</span></li>}
              {engAvg < 70 && <li className="flex items-start gap-3 text-sm"><span className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" /><span className="text-slate-300">Work on your SAT English skills. The <span className="text-blue-400">Grammar Rules and Reading Strategies</span> lessons are most impactful.</span></li>}
              {mathAvg >= 70 && <li className="flex items-start gap-3 text-sm"><span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" /><span className="text-slate-300">Great math performance! Try the <span className="text-violet-400">Hard difficulty</span> practice set to push further.</span></li>}
              {engAvg >= 70 && <li className="flex items-start gap-3 text-sm"><span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" /><span className="text-slate-300">Strong English skills! Focus on <span className="text-blue-400">Vocabulary in Context</span> and advanced passage analysis to maximize your score.</span></li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
