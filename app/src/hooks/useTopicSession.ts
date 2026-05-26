import { EMPTY_BRIEF } from "../data/mockData";
import type { TopicSessionContext } from "../types";

export const DEFAULT_TOPIC_SESSION: TopicSessionContext = {
  contentGoal: "mixed",
  hasCommercial: false,
  brief: { ...EMPTY_BRIEF },
};

export function resolveContentGoal(
  profileDefault: TopicSessionContext["contentGoal"],
  sessionGoal: TopicSessionContext["contentGoal"]
): "exposure" | "seeding" {
  if (sessionGoal === "exposure") return "exposure";
  if (sessionGoal === "seeding") return "seeding";
  if (profileDefault === "exposure") return "exposure";
  if (profileDefault === "seeding") return "seeding";
  return "exposure";
}
