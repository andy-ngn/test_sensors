import Sensors from "@/components/Sensors";
import { Button } from "@/components/ui/button";

import { useState } from "react";
export default function Home() {
  const [ask, setAsk] = useState(false);
  const [viewState, setViewState] = useState<Object>({});
  // const [data, setData] = useState<{ d1: Object; d2: Object; d3: Object }>({
  //   d1: {},
  //   d2: {},
  //   d3: {},
  // });

  // const handleOrientation = useCallback((event: any) => {
  //   requestAnimationFrame(() => {
  //     setData((prev) => ({ ...prev, d1: event }));
  //   });
  // }, []);
  // const handleMotion = useCallback((event: any) => {
  //   requestAnimationFrame(() => {
  //     setData((prev) => ({ ...prev, d3: event }));
  //   });
  // }, []);
  // const handleOrientationAndroid = useCallback((event: any) => {
  //   requestAnimationFrame(() => {
  //     if (
  //       !event.absolute ||
  //       event.alpha == null ||
  //       event.beta == null ||
  //       event.gamma == null
  //     ) {
  //       setData((prev) => ({ ...prev, d2: event }));
  //     }
  //   });
  // }, []);
  // useEffect(() => {
  //   if (ask) {
  //     setAsk(false);
  //     const tmpIos =
  //       navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
  //       navigator.userAgent.match(/AppleWebKit/);
  //     if (tmpIos) {
  //       let hasRequestPermission = false;
  //       try {
  //         hasRequestPermission =
  //           typeof DeviceOrientationEvent !== "undefined" &&
  //           //@ts-expect-error
  //           typeof DeviceOrientationEvent.requestPermission === "function" &&
  //           typeof DeviceMotionEvent !== "undefined" &&
  //           //@ts-expect-error
  //           typeof DeviceMotionEvent.requestPermission === "function";
  //       } catch (error) {
  //         hasRequestPermission = false;
  //       }

  //       if (!hasRequestPermission) return;
  //       //@ts-expect-error
  //       DeviceOrientationEvent.requestPermission()
  //         .then((response: any) => {
  //           if (response === "granted") {
  //             window.addEventListener(
  //               "deviceorientation",
  //               handleOrientation,
  //               true
  //             );
  //           } else {
  //             alert("has to be allowed!");
  //           }
  //         })
  //         .catch((err: any) => alert(err));
  //       //@ts-expect-error
  //       DeviceMotionEvent.requestPermission()
  //         .then((response: any) => {
  //           if (response === "granted") {
  //             window.addEventListener("devicemotion", handleMotion, true);
  //           } else {
  //             alert("has to be allowed! motion");
  //           }
  //         })
  //         .catch((err: any) => alert(err));
  //     } else {
  //       window.addEventListener(
  //         "deviceorientationabsolute",
  //         handleOrientationAndroid,
  //         true
  //       );
  //       window.addEventListener("devicemotion", handleMotion, true);
  //     }
  //   }
  // }, [handleMotion, handleOrientation, handleOrientationAndroid]);
  return (
    <main>
      <h1>Home</h1>

      <div>
        <Button
          onClick={() => {
            setAsk(true);
          }}
        >
          Start
        </Button>
      </div>
      <div>
        <Sensors
          askPermission={ask}
          setAskPermission={setAsk}
          setViewState={setViewState}
          // viewState={viewState}
        />
      </div>
      <div>{!viewState ? null : JSON.stringify(viewState, null, 2)}</div>
    </main>
  );
}
