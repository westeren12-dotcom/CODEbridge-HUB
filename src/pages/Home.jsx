import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Star, Users, Clock, ChevronDown, ChevronUp, CheckCircle, TrendingUp, Zap, Award } from "lucide-react";
import CourseCard from "../components/CourseCard";
import { courses } from "../data/courses";

const stats = [
  { label: "Active Students", value: "37,400+", icon: Users, color: "text-blue-400" },
  { label: "Video Lessons", value: "2,800+", icon: BookOpen, color: "text-cyan-400" },
  { label: "Learning Hours", value: "160,000+", icon: Clock, color: "text-violet-400" },
  { label: "Avg SAT Improvement", value: "+180pts", icon: TrendingUp, color: "text-green-400" },
];

const testimonials = [
  { name: "Aisha T.", role: "Harvard-bound student", score: "1540 SAT", text: "CODEbridge HUB completely transformed my SAT prep. The practice center's instant feedback helped me jump 210 points in 2 months.", avatar: "AT" },
  { name: "Marcus L.", role: "Software Engineering Student", score: "Full Stack Dev", text: "The IT Developing course took me from zero to building real apps. Lessons are clear, paced perfectly, and very practical.", avatar: "ML" },
  { name: "Priya K.", role: "College Freshman", score: "1490 SAT", text: "The analytics dashboard showed me exactly which topics to focus on. I improved my weakest areas in just 3 weeks.", avatar: "PK" },
];

const faqs = [
  { q: "Do I need prior knowledge to start?", a: "No. All courses start from the basics and build up. Our SAT English and Math courses are designed for all levels, from complete beginners to advanced students looking to perfect their scores." },
  { q: "How long are the video lessons?", a: "Each video lesson is approximately 40 minutes, designed to cover a complete topic without overwhelming you. You can pause, rewatch, and continue at any time." },
  { q: "Can I track my SAT score improvement?", a: "Yes! Our Analytics dashboard provides an estimated SAT score prediction based on your practice test performance, tracks your strengths and weaknesses, and gives personalized improvement recommendations." },
  { q: "Is the Practice Center based on real SAT questions?", a: "Our 100+ question database is created to mirror the official SAT format, style, and difficulty levels. Every question includes a detailed explanation so you understand the reasoning." },
  { q: "Can I use CODEbridge HUB on my phone?", a: "Absolutely. The platform is fully responsive and works on mobile, tablet, and desktop. You can watch lessons, take quizzes, and check your dashboard from anywhere." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-2 rounded-full mb-8 font-medium">
            <Zap size={14} />
            Premium SAT & IT Learning Platform
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            Master{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              SAT & IT Skills
            </span>
            <br />
            with CODEbridge HUB
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional video lessons, AI-powered practice tests, real-time analytics, and personalized learning paths — all in one premium platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Start Learning <ArrowRight size={20} />
            </Link>
            <Link
              to="/practice"
              className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-lg border border-slate-700 hover:border-slate-600 transition-all"
            >
              Try Practice Center
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> No credit card required</div>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Free practice questions</div>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <Icon size={24} className={`${color} mx-auto mb-3`} />
              <div className={`text-3xl font-display font-bold ${color} mb-1`}>{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">Courses</p>
            <h2 className="text-4xl font-display font-bold text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Three dedicated learning paths, each built with professional video lessons, quizzes, and progress tracking.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/practice" className="inline-flex items-center gap-2 px-6 py-3 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-xl font-medium transition-colors">
              Explore Practice Center <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Why Students Choose CODEbridge HUB</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Targeted Practice", desc: "Our AI detects your weak areas and generates personalized quizzes to help you improve where it matters most." },
              { icon: "📊", title: "Real-Time Analytics", desc: "Track your progress, see your estimated SAT score, and monitor performance trends over time on your dashboard." },
              { icon: "🧮", title: "Built-in Graphing Calc", desc: "Practice SAT Math with an integrated Desmos-style graphing calculator — no external tools required." },
              { icon: "🏆", title: "Achievement Badges", desc: "Earn badges for streaks, completed courses, and high quiz scores to stay motivated throughout your journey." },
              { icon: "📹", title: "40-Min Expert Lessons", desc: "Every lesson is structured for deep understanding — not just test tips, but genuine subject mastery." },
              { icon: "💾", title: "Saves Your Progress", desc: "Automatic cloud sync means you can start on desktop and continue on mobile right where you left off." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
                <span className="text-4xl mb-4 block">{icon}</span>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Students Love CODEbridge HUB</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-slate-400">Rated 4.9/5 across 2,400+ reviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role} · <span className="text-blue-400">{t.score}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-white font-medium">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-blue-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30 rounded-3xl p-12">
          <Award size={48} className="text-blue-400 mx-auto mb-6" />
          <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to Achieve Your Goal?</h2>
          <p className="text-slate-300 mb-8 text-lg">Join over 37,000 students already improving their scores and skills on CODEbridge HUB.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
          >
            Start Learning Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}