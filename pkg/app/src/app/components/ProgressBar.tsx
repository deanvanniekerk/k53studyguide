import type React from "react";
import { useEffect, useState } from "react";
import "./ProgressBar.css";

type Props = {
  progress: number;
  backgroundRgb?: string;
  backgroundOpacity?: number;
  foregroundRgb?: string;
  foregroundOpacity?: number;
  height?: number;
};

const ProgressBar: React.FC<Props> = ({
  progress: targetProgress,
  backgroundRgb = "var(--app-progress-track-rgb)",
  backgroundOpacity = 0.12,
  foregroundRgb = "var(--app-progress-foreground-rgb)",
  foregroundOpacity = 0.8,
  height = 4,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress(targetProgress);
    }, 100);
  }, [targetProgress]);

  return (
    <div className="container">
      <div
        className="progressBar"
        style={{
          backgroundColor: `rgba(${backgroundRgb}, ${backgroundOpacity})`,
          height,
          borderRadius: height,
        }}
      >
        <div
          className="completeBar"
          style={{
            backgroundColor: `rgba(${foregroundRgb}, ${foregroundOpacity})`,
            width: `${progress}%`,
            height,
            borderRadius: height,
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
    </div>
  );
};

export { ProgressBar };
