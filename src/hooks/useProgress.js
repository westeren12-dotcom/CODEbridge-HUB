import { useState, useCallback } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export function useProgress() {
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const markLessonComplete = useCallback(async (courseId, lessonId) => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        [`progress.${courseId}.completedLessons`]: arrayUnion(lessonId),
        [`progress.${courseId}.lastWatched`]: lessonId,
        lastActive: new Date(),
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    } finally {
      setSaving(false);
    }
  }, [currentUser]);

  const saveNote = useCallback(async (lessonId, noteText) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        [`notes.${lessonId}`]: noteText,
      });
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  }, [currentUser]);

  const toggleBookmark = useCallback(async (lessonId) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);
      const bookmarks = snap.data()?.bookmarks || [];
      if (bookmarks.includes(lessonId)) {
        await updateDoc(userRef, {
          bookmarks: bookmarks.filter(b => b !== lessonId),
        });
      } else {
        await updateDoc(userRef, { bookmarks: arrayUnion(lessonId) });
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  }, [currentUser]);

  const saveTestResult = useCallback(async (testData) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        testHistory: arrayUnion({ ...testData, date: new Date().toISOString() }),
      });
    } catch (err) {
      console.error("Failed to save test result:", err);
    }
  }, [currentUser]);

  return { markLessonComplete, saveNote, toggleBookmark, saveTestResult, saving };
}