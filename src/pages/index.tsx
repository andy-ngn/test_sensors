import map from "mapbox-gl";
import { useEffect, useState } from "react";
export default function Home() {
  const [status, setStatus] = useState("Normal");
  useEffect(() => {
    if (!map.supported()) {
      setStatus("GL Not Supported");
    }
  }, []);
  return (
    <main>
      <h1>Home</h1>
      <div>Status: {status}</div>
    </main>
  );
}
