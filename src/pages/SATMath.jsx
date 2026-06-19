import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { lessons } from "../data/lessons";
import { PlayCircle, CheckCircle, Clock, Lock, Calculator } from "lucide-react";

export default function SATMath() {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({ completedLessons: [], lastWatched: null });
  const courseId = "sat-math";
  const courseLessons = lessons[courseId];

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, "users", currentUser.uid)).then(s => {
        if (s.exists()) setProgress(s.data().progress?.[courseId] || {});
      });
    }
  }, [currentUser]);

  const completed = progress.completedLessons || [];
  const pct = Math.round((completed.length / courseLessons.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/30 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-4xl mb-3">📐</div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">SAT Math</h1>
              <p className="text-slate-300">Algebra, advanced math, geometry & data analysis — fully covered.</p>
              <Link to="/practice/math" className="inline-flex items-center gap-2 mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                <Calculator size={15} /> Open Graphing Calculator
              </Link>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-5 min-w-48">
              <p className="text-slate-400 text-sm mb-2">Your Progress</p>
              <p className="text-3xl font-bold text-violet-400 mb-2">{pct}%</p>
              <div className="w-full h-2 bg-slate-700 rounded-full">
                <div className="h-full bg-gradient-to-r from-violet-600 to-blue-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-slate-500 text-xs mt-2">{completed.length}/{courseLessons.length} lessons</p>
            </div>
          </div>
        </div>

        {progress.lastWatched && (
          <div className="bg-slate-800/60 border border-violet-500/30 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0"><PlayCircle size={22} className="text-white" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-400 text-sm">Continue Watching</p>
              <p className="text-white font-medium truncate">{courseLessons.find(l => l.id === progress.lastWatched)?.title}</p>
            </div>
            <Link to={`/lesson/${courseId}/${progress.lastWatched}`} className="flex-shrink-0 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-colors">Resume</Link>
          </div>
        )}

        <h2 className="text-xl font-display font-bold text-white mb-5">All Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseLessons.map((lesson) => {
            const isDone = completed.includes(lesson.id);
            return (
              <Link key={lesson.id} to={currentUser ? `/lesson/${courseId}/${lesson.id}` : "/login"}
                className="group flex gap-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-violet-500/50 rounded-2xl p-4 transition-all">
                <div className="relative w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle size={22} className="text-white" /></div>
                  {isDone && <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center"><CheckCircle size={20} className="text-green-300" /></div>}
                  {!currentUser && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Lock size={16} className="text-white" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">Lesson {lesson.order}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${lesson.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : lesson.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{lesson.difficulty}</span>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1 group-hover:text-violet-300 transition-colors line-clamp-2">{lesson.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs"><Clock size={11} />{lesson.duration}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}