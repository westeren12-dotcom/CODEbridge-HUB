import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { updateProfile } from "firebase/auth";
import { User, Mail, Calendar, Edit2, Save, Loader } from "lucide-react";

export default function Profile() {
  const { currentUser, fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, "users", currentUser.uid)).then(s => {
        if (s.exists()) { setProfile(s.data()); setDisplayName(s.data().displayName || ""); }
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(currentUser, { displayName });
      await updateDoc(doc(db, "users", currentUser.uid), { displayName });
      await fetchUserProfile(currentUser.uid);
      setSuccess(true); setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (!profile) return <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-white mb-8">My Profile</h1>

        {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">Profile updated successfully!</div>}

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 mb-6">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-bold">
              {(displayName || currentUser?.displayName || "U")[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">{displayName || currentUser?.displayName}</h2>
              <span className="inline-block mt-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full capitalize">
                {profile.role}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2"><User size={14} /> Display Name</label>
              {editing ? (
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-blue-500 rounded-xl text-white focus:outline-none" />
              ) : (
                <p className="text-white px-4 py-3 bg-slate-900/50 rounded-xl">{displayName || "—"}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2"><Mail size={14} /> Email</label>
              <p className="text-white px-4 py-3 bg-slate-900/50 rounded-xl">{currentUser?.email}</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2"><Calendar size={14} /> Member Since</label>
              <p className="text-white px-4 py-3 bg-slate-900/50 rounded-xl">
                {profile.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50">
                  {saving ? <Loader size={15} className="animate-spin" /> : <Save size={15} />} Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm transition-colors">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm transition-colors">
                <Edit2 size={15} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tests Taken", value: profile.testHistory?.length || 0 },
            { label: "Bookmarks", value: profile.bookmarks?.length || 0 },
            { label: "Day Streak", value: `${profile.streak || 0} 🔥` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{value}</p>
              <p className="text-slate-400 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}