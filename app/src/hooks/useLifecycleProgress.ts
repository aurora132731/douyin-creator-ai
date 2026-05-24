import { useEffect, useState } from "react";

const STORAGE_KEY = "douyin-lifecycle-completed";

export function useLifecycleProgress() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      return new Set(JSON.parse(raw) as string[]);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed]);

  const markComplete = (step: string) => {
    setCompleted((prev) => new Set([...prev, step]));
  };

  const resetProgress = () => {
    setCompleted(new Set());
  };

  return { completed, markComplete, resetProgress };
}
