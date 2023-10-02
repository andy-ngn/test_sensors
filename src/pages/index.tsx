import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [enabled, setEnabled] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [askPermission, setAskPermission] = useState(false);

  useEffect(() => {
    function handleOrientation(event: any) {
      requestAnimationFrame(() => {
        setBearing(event.webkitCompassHeading);
        setAlpha(event.webkitCompassHeading);
        setBeta(event.beta);
        setGamma(event.gamma);
      });
    }
    function handleOrientationAndorid(event: any) {
      requestAnimationFrame(() => {
        if (
          !event.absolute ||
          event.alpha == null ||
          event.beta == null ||
          event.gamma == null
        ) {
          let compass = -(event.alpha + (event.beta * event.gamma) / 90);
          compass -= Math.floor(compass / 360) * 360; // Wrap into range [0,360]

          setBearing(compass);
          setAlpha(compass);
          setBeta(event.beta);
          setGamma(event.gamma);
        }
      });
    }
    function handleMotion(event: any) {
      // requestAnimationFrame(() => {
      //   setDax(event.accelerationIncludingGravity.x);
      //   setDay(event.accelerationIncludingGravity.y);
      //   setDaz(event.accelerationIncludingGravity.z);
      //   setCalcFlag(true);
      //   setCheckStep(true);
      // });
    }
    if (askPermission) {
      setAskPermission(false);
      const tmpIos =
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/);

      if (tmpIos) {
        let hasRequestPermission = false;
        try {
          hasRequestPermission =
            typeof DeviceOrientationEvent !== "undefined" &&
            //@ts-expect-error
            typeof DeviceOrientationEvent.requestPermission === "function" &&
            typeof DeviceMotionEvent !== "undefined" &&
            //@ts-expect-error
            typeof DeviceMotionEvent.requestPermission === "function";
        } catch (error) {
          hasRequestPermission = false;
        }

        if (!hasRequestPermission) return;
        //@ts-expect-error
        DeviceOrientationEvent.requestPermission()
          .then((response: any) => {
            if (response === "granted") {
              window.addEventListener(
                "deviceorientation",
                handleOrientation,
                true
              );
            } else {
              alert("has to be allowed!");
            }
          })
          .catch((err: any) => alert(err));
        //@ts-expect-error
        DeviceMotionEvent.requestPermission()
          .then((response: any) => {
            if (response === "granted") {
              window.addEventListener("devicemotion", handleMotion, true);
            } else {
              alert("has to be allowed! motion");
            }
          })
          .catch((err: any) => alert(err));
      } else {
        window.addEventListener(
          "deviceorientationabsolute",
          handleOrientationAndorid,
          true
        );
        window.addEventListener("devicemotion", handleMotion, true);
      }
    }
  }, [askPermission]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <button onClick={() => setAskPermission(true)}>Start</button>
      {JSON.stringify({ bearing, alpha, beta, gamma }, null, 2)}
    </main>
  );
}
