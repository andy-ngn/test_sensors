import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<any>();
  useEffect(() => {
    if ("Accelerometer" in window) {
      let accelerometer = null;
      try {
        accelerometer = new Accelerometer({ frequency: 10 });
        accelerometer.onerror = (event: any) => {
          // Handle runtime errors.
          if (event.error.name === "NotAllowedError") {
            console.log("Permission to access sensor was denied.");
          } else if (event.error.name === "NotReadableError") {
            console.log("Cannot connect to the sensor.");
          }
        };
        accelerometer.onreading = (e) => {
          setData(e);
        };
        accelerometer.start();
      } catch (error: any) {
        // Handle construction errors.
        if (error.name === "SecurityError") {
          console.log(
            "Sensor construction was blocked by the Permissions Policy."
          );
        } else if (error.name === "ReferenceError") {
          console.log("Sensor is not supported by the User Agent.");
        } else {
          setError(error);
        }
      }
    }
  }, []);
  return (
    <div>
      Page
      <div>{!data ? "Nothing" : JSON.stringify(data)}</div>
    </div>
  );
};

export default Page;
