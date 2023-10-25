import {
  FeatureCollection,
  Polygon,
  Position,
  Properties,
  featureCollection,
  point,
} from "@turf/helpers";

import { GeoJsonLayer, IconLayer, TextLayer } from "@deck.gl/layers/typed";

import "mapbox-gl/dist/mapbox-gl.css";

import React, { useCallback, useEffect, useState } from "react";
import { Map, MapRef, NavigationControl } from "react-map-gl";

import { Card, CardContent } from "./ui/card";

import DeckGLOverlay from "./MapboxOverlay";
import { Button } from "./ui/button";

const MapBox: React.FC<{
  askPermission: boolean;
  setAskPermission: Function;
}> = ({ askPermission, setAskPermission }) => {
  const [mapInstance, setMapInstance] = useState<MapRef | null>(null);
  const [layers, setLayers] = useState<Array<any>>([]);
  const [sensorsData, setSensorsData] = useState<{
    alpha?: number;
    beta?: number;
    dax?: number;
    day?: number;
    daz?: number;
  }>({});
  const [currentCoord, setCoord] = useState<{ lat: number; lng: number }>({
    lat: 48.173623,
    lng: 11.589739,
  });
  const [selectedCoord, setSelectedCoord] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 48.173623,
    lng: 11.589739,
  });
  const handleOrientation = useCallback((event: any) => {
    requestAnimationFrame(() => {
      setSensorsData((prev) => ({
        ...prev,
        alpha: event.webkitCompassHeading,
        beta: event.beta,
        gamma: event.gamma,
      }));
    });
  }, []);
  const handleOrientationAndorid = useCallback((event: any) => {
    requestAnimationFrame(() => {
      setSensorsData((prev) => ({
        ...prev,
        alpha: -(event.alpha + (event.beta * event.gamma) / 90),
        beta: event.beta,
        gamma: event.gamma,
      }));
    });
  }, []);
  const handleMotion = useCallback((event: any) => {
    requestAnimationFrame(() => {
      setSensorsData((prev) => ({
        ...prev,
        dax: event.accelerationIncludingGravity.x,
        day: event.accelerationIncludingGravity.y,
        daz: event.accelerationIncludingGravity.z,
      }));
    });
  }, []);
  useEffect(() => {
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
    // }
  }, [setAskPermission]);

  useEffect(() => {
    if (!selectedCoord) return;
    const { lat, lng } = selectedCoord;
    const angle = sensorsData?.alpha ?? 0;
    const current_position = new IconLayer({
      id: `currentPositionLayer_arrow`,
      data: [{ coord: [lng, lat] }],

      opacity: 2,

      loadOptions: {
        fetch: {
          method: "GET",
        },
      },
      getSize: (d) => 5,
      sizeScale: 7,
      getPosition: (d) => [...d.coord, 1] as [number, number, number],
      getIcon: () => {
        return {
          url: `/api/getImg?url=${encodeURI(
            `https://cdn-icons-png.flaticon.com/512/399/399308.png`
          )}`,
          id: "sas",
          width: 550,
          height: 550,
        };
      },
      getAngle: angle,
      updateTriggers: {
        getAngle: angle,
      },
      billboard: false,
    });

    setLayers([current_position]);
  }, [sensorsData, selectedCoord]);

  return (
    <Map
      ref={(ref) => {
        if (ref) {
          setMapInstance(ref);
        }
      }}
      style={{ position: "absolute", height: "100vh", width: "100vw" }}
      onMouseMove={(e) => {
        const { lat, lng } = e.lngLat;
        setCoord({ lat, lng });
      }}
      onClick={(e) => {
        const { lat, lng } = e.lngLat;
        setSelectedCoord({ lat, lng });
      }}
      initialViewState={{
        bearing: 0,
        zoom: 19,
        latitude: 48.173623,
        longitude: 11.589739,
        pitch: 0,
      }}
      reuseMaps
      styleDiffing
      mapboxAccessToken='pk.eyJ1IjoiaWI5OCIsImEiOiJjbGhhbTRuaXUwOGliM2Ruc3h2YTFoMG9yIn0.YtRfHX0vI6aXB6WBD6hajg'
      mapStyle={`mapbox://styles/mapbox/dark-v11`}
      preserveDrawingBuffer
      antialias
    >
      <DeckGLOverlay layers={layers} interleaved />
      <NavigationControl position='top-left' />

      <Card className='absolute top-3 right-3 p-3 z-5 w-2/3'>
        <CardContent>
          <div>
            <Button
              onClick={() => {
                setAskPermission(true);
              }}
              size='sm'
            >
              Start
            </Button>
          </div>
          <div>
            Real coords:
            {currentCoord && (
              <div>
                <div>lat: {currentCoord.lat}</div>
                <div>lng: {currentCoord.lng}</div>
              </div>
            )}
          </div>
          <div>
            Sensors : {sensorsData && JSON.stringify(sensorsData, null, 2)}
          </div>
        </CardContent>
      </Card>
    </Map>
  );
};

export default MapBox;
