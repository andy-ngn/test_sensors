//@ts-nocheck

import { useEffect, useMemo, useState } from "react";

import Waveform from "@/components/waveform";
import EazIndicator from "@/components/EazIndicator";

type Props = {
  viewState: object;
  setViewState: Function;
  askPermission: boolean;
  setAskPermission: Function;
};

const Sensors = ({
  viewState,
  setViewState,
  askPermission,
  setAskPermission,
}: Props) => {
  const [Bearing, setBearing] = useState(viewState?.bearing);
  const [checkStep, setCheckStep] = useState(false);

  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [dax, setDax] = useState(0);
  const [day, setDay] = useState(0);
  const [daz, setDaz] = useState(0);

  const [eazentry, setEazentry] = useState(null);

  const [timestampOfLastAriadnePos, setTimestampOfLastAriadnePos] = useState(0);

  const [isIos, setIsIos] = useState("undefined");

  useEffect(() => {
    function handleOrientation(event) {
      requestAnimationFrame(() => {
        setViewState({ ...viewState, bearing: event.webkitCompassHeading });
        setBearing(event.webkitCompassHeading);
        setAlpha(event.webkitCompassHeading);
        setBeta(event.beta);
        setGamma(event.gamma);
      });
    }
    function handleOrientationAndorid(event) {
      requestAnimationFrame(() => {
        if (
          !event.absolute ||
          event.alpha == null ||
          event.beta == null ||
          event.gamma == null
        )
          let compass = -(event.alpha + (event.beta * event.gamma) / 90);
        compass -= Math.floor(compass / 360) * 360; // Wrap into range [0,360]
        setViewState({ ...viewState, bearing: compass });
        setBearing(compass);
        setAlpha(compass);
        setBeta(event.beta);
        setGamma(event.gamma);
      });
    }
    function handleMotion(event) {
      requestAnimationFrame(() => {
        setDax(event.accelerationIncludingGravity.x);
        setDay(event.accelerationIncludingGravity.y);
        setDaz(event.accelerationIncludingGravity.z);
        setCalcFlag(true);
        setCheckStep(true);
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
