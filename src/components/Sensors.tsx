//@ts-nocheck

import { useEffect, useState } from "react";

type Props = {
  setViewState: Function;
  askPermission: boolean;
  setAskPermission: Function;
};

const Sensors = ({ setViewState, askPermission, setAskPermission }: Props) => {
  const [isIos, setIsIos] = useState("undefined");

  useEffect(() => {
    function handleOrientation(event) {
      requestAnimationFrame(() => {
        setViewState((prev) => ({
          ...prev,
          alpha: event.webkitCompassHeading,
          beta: event.beta,
          gamma: event.gamma,
        }));
      });
    }
    function handleOrientationAndorid(event) {
      requestAnimationFrame(() => {
        setViewState((prev) => ({
          ...prev,
          alpha: -(event.alpha + (event.beta * event.gamma) / 90),
          beta: event.beta,
          gamma: event.gamma,
        }));
      });
    }
    function handleMotion(event) {
      requestAnimationFrame(() => {
        setViewState((prev) => ({
          ...prev,
          Dax: event.accelerationIncludingGravity.x,
          Day: event.accelerationIncludingGravity.y,
          Daz: event.accelerationIncludingGravity.z,
        }));
      });
    }
    if (isIos == "undefined" && askPermission) {
      setAskPermission(false);
      const tmpIos =
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/);
      setIsIos(tmpIos);

      if (tmpIos) {
        let hasRequestPermission = false;
        try {
          hasRequestPermission =
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function" &&
            typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function";
        } catch (error) {
          hasRequestPermission = false;
        }

        if (!hasRequestPermission) return;
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
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
          .catch((err) => alert(err));

        DeviceMotionEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("devicemotion", handleMotion, true);
            } else {
              alert("has to be allowed! motion");
            }
          })
          .catch((err) => alert(err));
      } else {
        window.addEventListener(
          "deviceorientationabsolute",
          handleOrientationAndorid,
          true
        );
        window.addEventListener("devicemotion", handleMotion, true);
      }
    }
    // }
  }, [askPermission, isIos]);

  /////////////////////////////////////////////////////////////////////////INCREAS WEIGHTS CLOSE TO PATH LINE STRING

  return (
    <>
      Sensors
      {/* <Waveform eaz={eazentry} setVariance={setVariance}></Waveform>
      <EazIndicator eaz={timestampOfLastAriadnePos} /> */}
    </>
  );
};

export default Sensors;
