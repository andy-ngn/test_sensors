import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [enabled, setEnabled] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  const askPermissionRef = useRef<boolean>(false);
  const askPermission = askPermissionRef.current;
  useEffect(() => {
    function handleOrientation(event: any) {
      requestAnimationFrame(() => {
        setBearing(event.webkitCompassHeading);
        setAlpha(event.webkitCompassHeading);
        setBeta(event.beta);
        setGamma(event.gamma);
      });
    }
    function handleOrientationAndroid(event: any) {
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
      askPermissionRef.current = false;
      {
        window.addEventListener(
          "deviceorientationabsolute",
          handleOrientationAndroid,
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
      <button
        onClick={() => {
          askPermissionRef.current = true;
        }}
      >
        Start
      </button>
      {JSON.stringify({ bearing, alpha, beta, gamma }, null, 2)}
    </main>
  );
}
