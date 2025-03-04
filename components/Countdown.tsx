"use client";

import React, { useEffect, useState } from "react";
import { startStage1 } from "../app/lib/constants";
import { CountdownProps } from "../app/lib/interfaces";
import styles from "../styles/countdown.module.css";

export const Countdown: React.FC<CountdownProps> = ({ onEnabledChange }) => {
  const calculateTimeLeft = () => {
    const difference = startStage1.getTime() - Date.now();

    if (difference <= 0) onEnabledChange(true);

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { difference, days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft.difference > 0) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startStage1]);

  const day = startStage1.getUTCDate();
  const month = startStage1.toLocaleString("en-US", { month: "long" });
  const year = startStage1.getUTCFullYear();

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className={styles.countdown}>
      <div className={styles.date}>
        <i>
          Starts: {month} {day}, {year}
        </i>
      </div>
      <div>
        {timeLeft.days > 0 ? <span>{formatNumber(timeLeft.days)}d</span> : null}
        {timeLeft.days > 0 ? <span className={styles.separator}>:</span> : null}
        {timeLeft.hours > 0 ? <span>{formatNumber(timeLeft.hours)}h</span> : null}
        {timeLeft.hours > 0 ? <span className={styles.separator}>:</span> : null}
        {timeLeft.minutes > 0 ? <span>{formatNumber(timeLeft.minutes)}m</span> : null}
        {timeLeft.minutes > 0 ? <span className={styles.separator}>:</span> : null}
        {timeLeft.seconds >= 0 ? <span suppressHydrationWarning={true}>{formatNumber(timeLeft.seconds)}s</span> : null}
      </div>
    </div>
  );
};
