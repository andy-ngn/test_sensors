import {
  FeatureCollection,
  Polygon,
  Position,
  Properties,
  featureCollection,
  point,
} from "@turf/helpers";

import "mapbox-gl/dist/mapbox-gl.css";

import React, { useEffect, useMemo, useState } from "react";
import { Layer, Map, MapRef, NavigationControl, Source } from "react-map-gl";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";

import DeckGLOverlay from "./MapboxOverlay";
import ColorRemapBitmapLayer from "./BitMap";

type FloorApiResponse =
  | { message: string }
  | Array<{
      imgSrc: string;
      coords: [
        { lat: number; lng: number },
        { lat: number; lng: number },
        { lat: number; lng: number },
        { lat: number; lng: number }
      ];
    }>
  | {
      imgSrc: string;
      coords: [
        { lat: number; lng: number },
        { lat: number; lng: number },
        { lat: number; lng: number },
        { lat: number; lng: number }
      ];
    };
const TestMap = () => {
  const [layers, setLayers] = useState<Array<any>>([]);
  const { data: floorPlan } = useQuery({
    queryKey: ["floor_plan"],
    queryFn: async () => {
      const response = await axios.get<FloorApiResponse>(
        "https://api.ariadne.inc/image_file",
        {
          headers: {
            "x-access-token":
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im5pa29zIiwiZXhwIjoxODQ4MTI1MzM3fQ.HNHDEA_a30Ua3O_iKEI8-QonxdViHkJnVunEiHJrGss",
          },
          params: {
            proj: "ikea_villesse_0",
          },
        }
      );
      if ("message" in response.data) {
        throw Error("Floor plan not found");
      }

      const check_array = Array.isArray(response["data"])
        ? response["data"]
        : [response["data"]];

      return check_array;
    },
  });
  useEffect(() => {
    if (!floorPlan) {
      setLayers([]);
      return;
    }
    setLayers([
      floorPlan?.map((fpItem, idx) => {
        const [zero, first, second, third] = fpItem.coords.map(
          (x) => [x.lng, x.lat] as [number, number]
        );
        const bounds = [second, zero, first, third] as [
          [number, number],
          [number, number],
          [number, number],
          [number, number]
        ];
        return new ColorRemapBitmapLayer({
          id: `floorPlan${idx}`,
          bounds,
          image: fpItem.imgSrc,
          desaturate: 1,

          colorRange: [
            [205, 205, 205, 50],
            [20, 20, 20, 20],
          ],
        });
      }) ?? [],
    ]);
  }, [floorPlan]);
  return (
    <Map
      initialViewState={{
        bearing: 0,
        zoom: 19,
        latitude: 45.86575,
        longitude: 13.43268,
        pitch: 0,
      }}
      reuseMaps
      styleDiffing
      mapboxAccessToken='pk.eyJ1IjoiaWI5OCIsImEiOiJjbGhhbTRuaXUwOGliM2Ruc3h2YTFoMG9yIn0.YtRfHX0vI6aXB6WBD6hajg'
      mapStyle={`mapbox://styles/mapbox/dark-v11`}
      preserveDrawingBuffer
      antialias
      style={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <DeckGLOverlay
        layers={layers}
        interleaved
        getTooltip={({ object }) => object?.properties.name}
        getCursor={({ isHovering }) => (isHovering ? "pointer" : "default")}
      />
      <NavigationControl position='top-left' />
    </Map>
  );
};

export default TestMap;
