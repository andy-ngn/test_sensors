import { GeoJsonLayer, TextLayer } from "@deck.gl/layers/typed";

import "mapbox-gl/dist/mapbox-gl.css";
// import {} from '@deck.gl/'
import React, { useEffect, useState } from "react";
import { Map } from "react-map-gl";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import DeckGLOverlay from "./MapboxOverlay";
import { FeatureCollection, Polygon, Properties } from "@turf/helpers";
const WorldMap: React.FC = () => {
  const [layers, setLayers] = useState<Array<any>>([]);
  const { data: countries } = useQuery({
    queryKey: ["tracks"],
    staleTime: 1000 * 60 * 60 * 24 * 365,
    cacheTime: 1000 * 60 * 60 * 24 * 365,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.get<
        FeatureCollection<Polygon, Properties & { name: string }>
      >("/api/tracks");
      return response.data;
    },
  });
  useEffect(() => {
    if (countries) {
      setLayers([
        new GeoJsonLayer({
          id: "tracks",

          data: countries,
          filled: false,
          getLineColor: [255, 0, 0, 50],
          getLineWidth: 4,
          lineWidthScale: 3,
          lineWidthMinPixels: 1.5,
        }),
      ]);
    }
  }, [countries]);
  return (
    <Map
      initialViewState={{
        bearing: 0,
        zoom: 10,
        latitude: 51.165691,
        longitude: 10.4541194,
        pitch: 0,
      }}
      style={{ width: "100vw", height: "100vh" }}
      reuseMaps
      styleDiffing
      mapboxAccessToken='pk.eyJ1IjoiaWI5OCIsImEiOiJjbGhhbTRuaXUwOGliM2Ruc3h2YTFoMG9yIn0.YtRfHX0vI6aXB6WBD6hajg'
      mapStyle={`mapbox://styles/mapbox/dark-v11`}
      preserveDrawingBuffer
      antialias
    >
      <DeckGLOverlay interleaved layers={layers} />
    </Map>
  );
};

export default WorldMap;
