import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Star, PlayCircle } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/${course.id}`}
      className="group block bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Card header with gradient */}
      <div className={`h-32 bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-5xl">{course.icon}</span>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-3 right-3">
          <span className="bg-black/30 text-white text-xs px-2 py-1 rounded-full">{course.level}</span>
        </div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircle size={28} className="text-white/90" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
            {course.category}
          </span>
        </div>
        <h3 className="font-display font-semibold text-white text-lg mb-1.5 group-hover:text-blue-300 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{course.totalHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-400">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}