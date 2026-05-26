import { useMemo } from "react";
import { useTheme } from "./useTheme";

export function useChartTheme() {
  const { isDark } = useTheme();

  return useMemo(
    () =>
      isDark
        ? {
            grid: "#3f3f48",
            axis: "#8b8b96",
            tick: "#a1a1ad",
            legend: "#a1a1ad",
            tooltipBg: "#1f1f23",
            tooltipBorder: "#3a3a42",
            tooltipText: "#f2f2f4",
            cursor: "rgba(139, 139, 150, 0.2)",
          }
        : {
            grid: "#c5cad4",
            axis: "#64748b",
            tick: "#334155",
            legend: "#475569",
            tooltipBg: "#ffffff",
            tooltipBorder: "#d4d8e0",
            tooltipText: "#1c1c1e",
            cursor: "rgba(100, 116, 139, 0.12)",
          },
    [isDark]
  );
}
