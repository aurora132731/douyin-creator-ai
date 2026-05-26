import { useEffect, useState } from "react";
import type { CreatorProfile } from "../types";

const STORAGE_KEY = "douyin-creator-profile";

const DEFAULT: CreatorProfile = {
  name: "创作者小明",
  stage: "growing",
  vertical: "美食",
  followers: 28000,
  avgViews: 15000,
  postFrequency: 3,
  contentGoalDefault: "mixed",
};

function loadProfile(): CreatorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<CreatorProfile>;
    return {
      ...DEFAULT,
      ...parsed,
      contentGoalDefault: parsed.contentGoalDefault ?? "mixed",
    };
  } catch {
    return DEFAULT;
  }
}

export function useCreatorProfile() {
  const [profile, setProfile] = useState<CreatorProfile>(loadProfile);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  return { profile, setProfile };
}
