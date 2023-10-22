import map from "mapbox-gl";
import { useEffect, useState } from "react";
export default function Home() {
  const [status, setStatus] = useState("Default");
  useEffect(() => {
    if (!map.supported()) {
      setStatus("GL Not Supported");
    } else {
      setStatus("Running");
    }
  }, []);
  return (
    <main>
      <h1>Home</h1>
      <div>Status: {status}</div>
    </main>
  );
}
