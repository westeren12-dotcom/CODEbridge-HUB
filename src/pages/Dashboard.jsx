import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { lessons } from "../data/lessons";
import { BookOpen, Trophy, Flame, TrendingUp, PlayCircle, Clock, Target, Star } from "lucide-react";

const BADGES = [
  { id: "first_lesson", icon: "🎓", label: "First Lesson", desc: "Completed your first lesson" },
  { id: "quiz_10", icon: "🧠", label: "Quiz Master", desc: "Completed 10 quizzes" },
  { id: "streak_7", icon: "🔥", label: "7-Day Streak", desc: "Studied 7 days in a row" },
  { id: "perfect_score", icon: "⭐", label: "Perfect Score", desc: "Got 100% on a quiz" },
  { id: "sat_ready", icon: "🏆", label: "SAT Ready", desc: "Completed all SAT prep courses" },
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, "users", currentUser.uid)).then(snap => {
        if (snap.exists()) setProfile(snap.data());
        setLoading(false);
      });
    }
  }, [currentUser]);

  const getProgress = (courseId) => {
    const completed = profile?.progress?.[courseId]?.completedLessons || [];
    const total = lessons[courseId]?.length || 1;
    return Math.round((completed.length / total) * 100);
  };

  const getLastWatched = (courseId) => {
    const lessonId = profile?.progress?.[courseId]?.lastWatched;
    return lessonId ? lessons[courseId]?.find(l => l.id === lessonId) : null;
  };

  const testHistory = profile?.testHistory || [];
  const avgScore = testHistory.length > 0
    ? Math.round(testHistory.reduce((a, t) => a + (t.score / t.total) * 100, 0) / testHistory.length)
    : 0;

  const courses = [
    { id: "sat-english", label: "SAT English", icon: "📖", color: "from-blue-600 to-cyan-500", path: "/sat-english" },
    { id: "sat-math", label: "SAT Math", icon: "📐", color: "from-violet-600 to-blue-500", path: "/sat-math" },
    { id: "it-developing", label: "IT Developing", icon: "💻", color: "from-emerald-600 to-teal-500", path: "/it-developing" },
  ];

  if (loading) return (
    <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center">
      <div className="text-center"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-slate-400">Loading your dashboard...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-1">
            Welcome back, {currentUser?.displayName?.split(" ")[0] || "Student"} 👋
          </h1>
          <p className="text-slate-400">Here's your learning overview</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Lessons Watched", value: Object.values(profile?.progress || {}).reduce((a, c) => a + (c.completedLessons?.length || 0), 0), color: "text-blue-400" },
            { icon: Target, label: "Tests Taken", value: testHistory.length, color: "text-cyan-400" },
            { icon: TrendingUp, label: "Avg Quiz Score", value: `${avgScore}%`, color: "text-violet-400" },
            { icon: Flame, label: "Day Streak", value: profile?.streak || 0, color: "text-orange-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
              <Icon size={20} className={`${color} mb-3`} />
              <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
              <p className="text-slate-400 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Course progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {courses.map(c => {
            const pct = getProgress(c.id);
            const lastLesson = getLastWatched(c.id);
            return (
              <div key={c.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl mb-4`}>{c.icon}</div>
                <h3 className="text-white font-semibold mb-1">{c.label}</h3>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full mb-4">
                  <div className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                {lastLesson ? (
                  <Link to={`/lesson/${c.id}/${lastLesson.id}`} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    <PlayCircle size={16} /> Continue: {lastLesson.title.slice(0, 28)}...
                  </Link>
                ) : (
                  <Link to={c.path} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    <PlayCircle size={16} /> Start Learning
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent tests + Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent tests */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-blue-400" /> Recent Practice Tests</h3>
            {testHistory.length === 0 ? (
              <div className="text-center py-8">
                <Target size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No tests taken yet.</p>
                <Link to="/practice" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">Start Practicing →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {testHistory.slice(-5).reverse().map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                    <div>
                      <p className="text-white text-sm font-medium capitalize">{t.type} Practice</p>
                      <p className="text-slate-500 text-xs">{new Date(t.date).toLocaleDateString()} · {t.difficulty}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${(t.score / t.total) >= 0.7 ? "text-green-400" : "text-red-400"}`}>
                        {Math.round((t.score / t.total) * 100)}%
                      </p>
                      <p className="text-slate-500 text-xs">{t.score}/{t.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><Trophy size={18} className="text-amber-400" /> Achievement Badges</h3>
            <div className="grid grid-cols-3 gap-3">
              {BADGES.map(badge => {
                const earned = profile?.badges?.includes(badge.id);
                return (
                  <div key={badge.id} title={badge.desc}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${earned ? "bg-amber-500/10 border-amber-500/40" : "bg-slate-900/60 border-slate-700 opacity-40"}`}>
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <span className="text-xs text-slate-300 font-medium leading-tight">{badge.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-slate-500 text-xs text-center mt-4">Complete activities to earn badges</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: "/practice/math", label: "Math Practice", icon: "🧮" },
            { to: "/practice/english", label: "English Practice", icon: "📝" },
            { to: "/analytics", label: "My Analytics", icon: "📊" },
            { to: "/profile", label: "My Profile", icon: "👤" },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 rounded-xl px-4 py-3 text-slate-300 hover:text-white transition-all">
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}