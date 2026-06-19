import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, BookOpen, TrendingUp } from "lucide-react";

export default function PracticeCenter() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-4">SAT Practice Center</h1>
          <p className="text-slate-400 text-lg">Sharpen your skills with realistic SAT practice questions, timed tests, and instant feedback.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Math Practice */}
          <Link to="/practice/math" className="group bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/30 hover:border-violet-500/60 rounded-2xl p-8 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mb-5">
              <Calculator size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">SAT Math Practice</h2>
            <p className="text-slate-400 mb-5 leading-relaxed">50+ questions covering algebra, geometry, data analysis, and advanced math. Includes built-in graphing calculator.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Multiple Choice", "Free Response", "Graphing Calc", "Timed Mode"].map(t => (
                <span key={t} className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/30 px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-violet-400 font-medium group-hover:gap-3 transition-all">
              Start Math Practice <ArrowRight size={18} />
            </div>
          </Link>

          {/* English Practice */}
          <Link to="/practice/english" className="group bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-8 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-5">
              <BookOpen size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">SAT English Practice</h2>
            <p className="text-slate-400 mb-5 leading-relaxed">50+ questions on reading comprehension, grammar, writing, and vocabulary. Instant score and explanations.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Reading Comprehension", "Grammar", "Vocabulary", "Timed Mode"].map(t => (
                <span key={t} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-3 transition-all">
              Start English Practice <ArrowRight size={18} />
            </div>
          </Link>
        </div>

        {/* Analytics link */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">View My Analytics</h3>
            <p className="text-slate-400 text-sm">Track your performance over time, see your estimated SAT score, and identify weak areas.</p>
          </div>
          <Link to="/analytics" className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0">
            View Analytics <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}