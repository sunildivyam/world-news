import { useState, useEffect } from "react";

export default function ClientDate({ dateString }: { dateString: string }) {
  const [clientDate, setClientDate] = useState("");

  useEffect(() => {
    // This runs only on the client after initial render
    setClientDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);

  return <time>{clientDate || "Loading..."}</time>;
}
