import type React from "react";
import { useEffect, useState } from "react";
import { TEXT_COLOR } from "@/data";
import { hexToRgb } from "@/utils/color";
import "./ProgressBar.css";

type Props = {
  progress: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
  foregroundColor?: string;
  foregroundOpacity?: number;
  height?: number;
};

const ProgressBar: React.FC<Props> = ({
  progress: targetProgress,
  backgroundColor = "#000000",
  backgroundOpacity = 0.12,
  foregroundColor = TEXT_COLOR,
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
          backgroundColor: `rgba(${hexToRgb(backgroundColor || TEXT_COLOR).join(",")}, ${backgroundOpacity})`,
          height,
          borderRadius: height,
        }}
      >
        <div
          className="completeBar"
          style={{
            backgroundColor: `rgba(${hexToRgb(foregroundColor || TEXT_COLOR).join(",")}, ${foregroundOpacity})`,
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
