import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { lessons } from "../data/lessons";
import { mathQuestions } from "../data/mathQuestions";
import { englishQuestions } from "../data/englishQuestions";
import { Search as SearchIcon, PlayCircle, HelpCircle } from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState({ lessons: [], questions: [] });

  useEffect(() => {
    if (!query.trim()) { setResults({ lessons: [], questions: [] }); return; }
    const q = query.toLowerCase();

    const allLessons = [];
    Object.entries(lessons).forEach(([courseId, arr]) => {
      arr.forEach(l => {
        if (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) {
          allLessons.push({ ...l, courseId });
        }
      });
    });

    const allQ = [...mathQuestions, ...englishQuestions].filter(q2 =>
      q2.question.toLowerCase().includes(q) || q2.topic.toLowerCase().includes(q)
    );

    setResults({ lessons: allLessons, questions: allQ });
  }, [query]);

  const courseNames = { "sat-english": "SAT English", "sat-math": "SAT Math", "it-developing": "IT Developing" };
  const total = results.lessons.length + results.questions.length;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon size={20} className="text-blue-400" />
            <h1 className="text-2xl font-display font-bold text-white">Search Results</h1>
          </div>
          {query && <p className="text-slate-400">{total} result{total !== 1 ? "s" : ""} for "<span className="text-white">{query}</span>"</p>}
        </div>

        {results.lessons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><PlayCircle size={16} className="text-blue-400" /> Lessons ({results.lessons.length})</h2>
            <div className="space-y-3">
              {results.lessons.map(l => (
                <Link key={l.id} to={`/lesson/${l.courseId}/${l.id}`}
                  className="flex items-center gap-4 bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 transition-all group">
                  <img src={l.thumbnail} alt={l.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors">{l.title}</h3>
                    <p className="text-slate-500 text-sm">{courseNames[l.courseId]} · {l.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.questions.length > 0 && (
          <div>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><HelpCircle size={16} className="text-violet-400" /> Practice Questions ({results.questions.length})</h2>
            <div className="space-y-3">
              {results.questions.slice(0, 10).map(q => (
                <div key={q.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${q.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : q.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{q.difficulty}</span>
                    <span className="text-xs text-slate-500">{q.topic}</span>
                  </div>
                  <p className="text-white text-sm">{q.question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {query && total === 0 && (
          <div className="text-center py-16">
            <SearchIcon size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No results found</h3>
            <p className="text-slate-400 text-sm">Try different keywords or browse our courses directly.</p>
          </div>
        )}
      </div>
    </div>
  );
}