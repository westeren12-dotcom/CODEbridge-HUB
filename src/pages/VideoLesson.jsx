import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { lessons } from "../data/lessons";
import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import VideoPlayer from "../components/VideoPlayer";
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, CheckCircle, StickyNote, Save } from "lucide-react";

export default function VideoLesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { markLessonComplete, saveNote, toggleBookmark } = useProgress();
  const [note, setNote] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [noteSaved, setNoteSaved] = useState(false);

  const courseLessons = lessons[courseId] || [];
  const currentIdx = courseLessons.findIndex(l => l.id === lessonId);
  const lesson = courseLessons[currentIdx];
  const prevLesson = courseLessons[currentIdx - 1];
  const nextLesson = courseLessons[currentIdx + 1];

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, "users", currentUser.uid)).then(s => {
        if (s.exists()) {
          const data = s.data();
          setProfile(data);
          setNote(data.notes?.[lessonId] || "");
          setBookmarked(data.bookmarks?.includes(lessonId) || false);
          setCompleted(data.progress?.[courseId]?.completedLessons?.includes(lessonId) || false);
        }
      });
    }
  }, [currentUser, lessonId, courseId]);

  if (!lesson) return <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center text-slate-400">Lesson not found.</div>;

  const handleComplete = async () => {
    await markLessonComplete(courseId, lessonId);
    setCompleted(true);
  };

  const handleSaveNote = async () => {
    await saveNote(lessonId, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleBookmark = async () => {
    await toggleBookmark(lessonId);
    setBookmarked(b => !b);
  };

  const courseNames = { "sat-english": "SAT English", "sat-math": "SAT Math", "it-developing": "IT Developing" };

  return (
    <div className="min-h-screen bg-slate-950 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
          <Link to={`/${courseId}`} className="hover:text-blue-400 transition-colors">{courseNames[courseId]}</Link>
          <span>/</span>
          <span className="text-white truncate">{lesson.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} onComplete={handleComplete} />

            <div className="mt-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-white mb-1">{lesson.title}</h1>
                  <p className="text-slate-400 text-sm">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={handleBookmark} className={`p-2.5 rounded-xl border transition-all ${bookmarked ? "bg-amber-500/20 border-amber-500/50 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"}`}>
                    {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                  <button onClick={handleComplete} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${completed ? "bg-green-500/20 border-green-500/50 text-green-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-green-500/50"}`}>
                    <CheckCircle size={16} /> {completed ? "Completed" : "Mark Done"}
                  </button>
                </div>
              </div>

              {/* Nav */}
              <div className="flex gap-3 mb-6">
                {prevLesson && (
                  <button onClick={() => navigate(`/lesson/${courseId}/${prevLesson.id}`)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 hover:text-white transition-all">
                    <ChevronLeft size={16} /> Previous
                  </button>
                )}
                {nextLesson && (
                  <button onClick={() => navigate(`/lesson/${courseId}/${nextLesson.id}`)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm text-white font-medium transition-all ml-auto">
                    Next <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* Notes */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><StickyNote size={16} className="text-blue-400" /> My Notes</h3>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Take notes while watching this lesson..."
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  {noteSaved && <span className="text-green-400 text-sm">Notes saved!</span>}
                  <button onClick={handleSaveNote} className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm text-white font-medium transition-colors">
                    <Save size={14} /> Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: lesson list */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 h-fit lg:sticky lg:top-20">
            <h3 className="text-white font-semibold mb-4 px-1">{courseNames[courseId]} — All Lessons</h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {courseLessons.map((l, i) => {
                const isCurrent = l.id === lessonId;
                const isDone = profile?.progress?.[courseId]?.completedLessons?.includes(l.id);
                return (
                  <Link key={l.id} to={`/lesson/${courseId}/${l.id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isCurrent ? "bg-blue-600/20 border border-blue-500/50" : "hover:bg-slate-700/60 border border-transparent"}`}>
                    <span className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${isDone ? "bg-green-500 text-white" : isCurrent ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-400"}`}>
                      {isDone ? "✓" : i + 1}
                    </span>
                    <span className={`text-sm line-clamp-2 ${isCurrent ? "text-white font-medium" : "text-slate-400 hover:text-white"}`}>{l.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
