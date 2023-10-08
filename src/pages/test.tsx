import React, { useEffect, useState } from "react";
import type { Accelerometer } from "motion-sensors-polyfill";
const Page = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>();
  useEffect(() => {
    let accelerometer: Accelerometer | null = null;
    try {
      //@ts-expect-error
      accelerometer = new Accelerometer({ referenceFrame: "device" });
      accelerometer.addEventListener("error", (event) => {
        // Handle runtime errors.
        //@ts-expect-error
        if (event.error.name === "NotAllowedError") {
          // Branch to code for requesting permission.
          //@ts-expect-error
        } else if (event.error.name === "NotReadableError") {
          console.log("Cannot connect to the sensor.");
        }
      });
      accelerometer.addEventListener("reading", () => {
        reloadOnShake(accelerometer);
        if (!accelerometer) return;
        setData({ x: accelerometer.x, y: accelerometer.y, z: accelerometer.z });
      });
      accelerometer.start();
    } catch (error) {
      // Handle construction errors.
      if (error.name === "SecurityError") {
        // See the note above about permissions policy.
        console.log("Sensor construction was blocked by a permissions policy.");
      } else if (error.name === "ReferenceError") {
        console.log("Sensor is not supported by the User Agent.");
      } else {
        throw error;
      }
    }
  }, []);
  return (
    <div>
      Page
      <div>{!data ? "Nothing" : JSON.stringify(data)}</div>
      {error && <div>Error: {JSON.stringify(error)}</div>}
    </div>
  );
};

export default Page;
