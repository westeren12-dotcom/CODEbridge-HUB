import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { lessons } from "../data/lessons";
import { Users, BookOpen, TrendingUp, Settings, ChevronDown, ChevronUp } from "lucide-react";

export default function Admin() {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [videoUrls, setVideoUrls] = useState({});

  useEffect(() => {
    getDocs(collection(db, "users")).then(snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const totalLessons = Object.values(lessons).reduce((a, arr) => a + arr.length, 0);
  const totalTests = students.reduce((a, s) => a + (s.testHistory?.length || 0), 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "students", label: "Students", icon: Users },
    { id: "content", label: "Content", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const updateVideoUrl = async (courseId, lessonId, url) => {
    // In production this would update Firestore; here we show the UI pattern
    setVideoUrls(p => ({ ...p, [`${courseId}-${lessonId}`]: url }));
    alert("In production, this saves to Firebase. Add videoUrl field to your lessons data/Firestore.");
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">Admin Panel</h1>
            <p className="text-slate-400">Manage CODEbridge HUB</p>
          </div>
          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full">Admin Access</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Students", value: students.length, color: "text-blue-400" },
                { label: "Total Lessons", value: totalLessons, color: "text-cyan-400" },
                { label: "Practice Tests", value: totalTests, color: "text-violet-400" },
                { label: "Avg Tests/Student", value: students.length ? Math.round(totalTests / students.length) : 0, color: "text-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                  <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
                  <p className="text-slate-400 text-sm">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Recent Registrations</h3>
              <div className="space-y-3">
                {students.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                        {(s.displayName || s.email || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm">{s.displayName || "Unnamed"}</p>
                        <p className="text-slate-500 text-xs">{s.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>{s.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students */}
        {activeTab === "students" && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5">All Students ({students.length})</h3>
            {loading ? (
              <div className="text-center py-8"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : (
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="border border-slate-700 rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedStudent(expandedStudent === s.id ? null : s.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                          {(s.displayName || s.email || "?")[0].toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">{s.displayName || "Unnamed"}</p>
                          <p className="text-slate-500 text-xs">{s.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs">{s.testHistory?.length || 0} tests</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>{s.role}</span>
                        {expandedStudent === s.id ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                      </div>
                    </button>
                    {expandedStudent === s.id && (
                      <div className="px-4 pb-4 border-t border-slate-700 pt-3">
                        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                          <div><p className="text-slate-500 text-xs">Streak</p><p className="text-white">{s.streak || 0} days</p></div>
                          <div><p className="text-slate-500 text-xs">Bookmarks</p><p className="text-white">{s.bookmarks?.length || 0}</p></div>
                          <div><p className="text-slate-500 text-xs">Tests Taken</p><p className="text-white">{s.testHistory?.length || 0}</p></div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={async () => {
                            await updateDoc(doc(db, "users", s.id), { role: s.role === "admin" ? "student" : "admin" });
                            setStudents(p => p.map(u => u.id === s.id ? { ...u, role: u.role === "admin" ? "student" : "admin" } : u));
                          }} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors">
                            Toggle Admin
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content management */}
        {activeTab === "content" && (
          <div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-2">Add Video URLs</h3>
              <p className="text-slate-400 text-sm mb-5">Paste YouTube, Vimeo, or direct MP4 URLs for each lesson. These get saved to Firebase.</p>
              {Object.entries(lessons).map(([courseId, arr]) => (
                <div key={courseId} className="mb-6">
                  <h4 className="text-blue-400 font-medium mb-3 capitalize">{courseId.replace(/-/g, " ")}</h4>
                  <div className="space-y-2">
                    {arr.map(l => (
                      <div key={l.id} className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm w-52 truncate flex-shrink-0">{l.title}</span>
                        <input
                          value={videoUrls[`${courseId}-${l.id}`] || l.videoUrl || ""}
                          onChange={e => setVideoUrls(p => ({ ...p, [`${courseId}-${l.id}`]: e.target.value }))}
                          placeholder="Paste video URL..."
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                        />
                        <button onClick={() => updateVideoUrl(courseId, l.id, videoUrls[`${courseId}-${l.id}`] || "")}
                          className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors">
                          Save
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5">Platform Settings</h3>
            <div className="space-y-4">
              {[
                { label: "Platform Name", value: "CODEbridge HUB" },
                { label: "Admin Email", value: currentUser?.email || "" },
                { label: "Firestore Rules", value: "Set rules in Firebase Console → Firestore → Rules" },
                { label: "Authentication", value: "Firebase Authentication — Email/Password enabled" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-sm text-slate-400 mb-1">{label}</label>
                  <p className="text-white bg-slate-900 px-4 py-2.5 rounded-xl text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}