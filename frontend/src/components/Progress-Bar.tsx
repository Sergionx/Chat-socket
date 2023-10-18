import { useEffect, useState } from "react";

interface Props {
  seconds: number;
  onEnd: () => void;
}

export default function ProgressBar({ seconds, onEnd }: Props) {
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const intervalsPerSecond = 20
    const fraction = 100 / (seconds * intervalsPerSecond);

    const id = setInterval(() => {
      setProgress((prevProgress) => prevProgress - fraction);
    }, 50);

    setIntervalId(id);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [seconds]);

  useEffect(() => {
    if (progress <= 0) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      onEnd();
    }
  }, [progress, onEnd, intervalId]);

  return (
    <div className="w-full h-2 bg-gray-200 rounded-md mt-4">
      <div
        className="h-full bg-primary-400 rounded-md transition-[width] ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
