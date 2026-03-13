"use client";

import { useState, useEffect } from "react";

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return " just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
};

export default function ClientDate({ dateString }: { dateString: string }) {
  const [clientDate, setClientDate] = useState("");

  useEffect(() => {
    // This runs only on the client after initial render
    setClientDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);

  return (
    <time>{(clientDate && getRelativeTime(clientDate)) || "Loading..."}</time>
  );
}
