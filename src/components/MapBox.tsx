import {
  FeatureCollection,
  Polygon,
  Position,
  Properties,
  featureCollection,
  point,
} from "@turf/helpers";
import { Input } from "@/components/ui/input";

import { GeoJsonLayer, TextLayer } from "@deck.gl/layers/typed";
import { CollisionFilterExtension } from "@deck.gl/extensions/typed";
import centroid from "@turf/center-of-mass";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Layer, Map, MapRef, NavigationControl, Source } from "react-map-gl";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import ColorRemapBitmapLayer from "./BitMap";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

import AutoComplete from "./AutoComplete";
import CustomDatePicker from "./CustomDatePicker";
import DeckGLOverlay from "./MapboxOverlay";
type TrajectoryPoint = {
  coordinate: [number, number];
  floor: number;
  hash_id: string;
  latitude: number;
  longitude: number;
  node_id: string;
  timestamp: number;
  uncertainty: number;
};
const MapBox: React.FC<{
  data: FeatureCollection<Polygon, Properties & { name: string }>;
}> = ({ data }) => {
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState<MapRef | null>(null);
  const selected_polygon = router?.query?.polygon
    ? decodeURI(String(router.query.polygon))
    : undefined;
  const from = router.query.from ? +String(router.query.from) : undefined;
  const to = router.query.to ? +String(router.query.to) : undefined;
  const [value, setValue] = useState<string>("");
  const {
    data: trajectories,
    error,
    isLoading,
    status,
  } = useQuery({
    enabled: !!selected_polygon && !!from && !!to,
    queryKey: ["trajectories", selected_polygon, from, to],
    queryFn: async ({ queryKey }) => {
      const [_, polygon, from, to] = queryKey;
      const response = await axios.get<TrajectoryPoint[]>("/api/trajectories", {
        params: { polygon, from, to },
      });
      return response.data;
    },
    select: (newData) => newData.filter((x) => x.floor === 0),
  });
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

  const centroids = useMemo(
    () =>
      data.features.map((x) =>
        centroid(x.geometry, { properties: { name: x.properties.name } })
      ),
    [data]
  );
  useEffect(() => {
    if (!mapInstance || !centroids?.length) return;
    if (selected_polygon) {
      setValue(selected_polygon);
    }
    const findPol = centroids.find(
      (x) => x.properties.name === selected_polygon
    );
    if (findPol) {
      mapInstance.flyTo({
        center: findPol.geometry.coordinates as [number, number],
        zoom: mapInstance.getZoom(),
        duration: 1000,
        animate: true,
      });
    }
  }, [centroids, mapInstance, selected_polygon]);
  type CentroidType = typeof centroids;

  const name_list = [
    ...new Set<string>(data.features.map((x) => x.properties.name)),
  ].sort((a, b) => a.localeCompare(b));

  const handleChoosePolygon = () => {
    if (!value) return;
    router.replace({
      query: { ...router.query, polygon: encodeURI(value) },
    });
  };
  const pointsFC = useMemo(() => {
    if (!trajectories?.length) return null;
    return featureCollection(
      trajectories.map(({ latitude, longitude }) =>
        point([longitude, latitude])
      )
    );
  }, [trajectories]);
  return (
    <div className='relative w-full aspect-video'>
      <Map
        ref={(ref) => {
          if (ref) {
            setMapInstance(ref);
          }
        }}
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
      >
        {!pointsFC ? null : (
          <Source id='heatmap_geojson' type='geojson' data={pointsFC}>
            <Layer
              id='heatmap'
              type='heatmap'
              paint={{
                "heatmap-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  2,
                  9,
                  8,
                ],
              }}
            />
          </Source>
        )}
        <DeckGLOverlay
          layers={[
            new TextLayer<CentroidType[number]>({
              id: "labels",
              data: centroids,
              extensions: [new CollisionFilterExtension()],
              characterSet: "auto",
              fontSettings: {
                buffer: 8,
              },
              getText: (d) => d.properties.name,
              getPosition: (d) => [
                d.geometry.coordinates[0],
                d.geometry.coordinates[1],
              ],
              getColor: [255, 255, 255, 200],
              getSize: 1,
              maxWidth: 15,
              sizeScale: 10,
              billboard: true,
              //@ts-expect-error

              collisionEnabled: true,

              collisionTestProps: {
                radiusScale: 20,

                sizeMaxPixels: 20 * 2,
                sizeMinPixels: 9 * 2,
              },
            }),
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
                desaturate: 1,

                colorRange: [
                  [205, 205, 205, 50],
                  [20, 20, 20, 20],
                ],
                id: `floorPlan${idx}`,
                bounds,
                image: fpItem.imgSrc,
              });
            }) ?? [],

            new GeoJsonLayer({
              id: "buildings",
              data,
              getFillColor: (d) => {
                if (!!d.properties && "name" in d.properties) {
                  const pol_name = d.properties.name as string;
                  if (pol_name.trim().toLowerCase().includes("corridor")) {
                    return [100, 100, 0, 20];
                  }
                  return [100, 100, 100, 50];
                }

                return [100, 100, 100, 50];
              },
              getLineColor: (d) => {
                if (!!d.properties && "name" in d.properties) {
                  const pol_name = d.properties.name as string;
                  if (selected_polygon && selected_polygon === pol_name)
                    return [255, 255, 153, 250];
                  return [50, 205, 50, 100];
                }
                return [50, 205, 50, 100];
              },
              getLineWidth: (d) => {
                if (!!d.properties && "name" in d.properties) {
                  const pol_name = d.properties.name as string;
                  if (selected_polygon && selected_polygon === pol_name)
                    return 1;
                  return 0.5;
                }
                return 0.5;
              },
              lineWidthScale: 0.2,
              //   lineWidthMaxPixels: 3,
              autoHighlight: true,
              pickable: true,
            }),
          ]}
          interleaved
          getTooltip={({ object }) => object?.properties.name}
          getCursor={({ isHovering }) => (isHovering ? "pointer" : "default")}
        />
        <NavigationControl position='top-left' />

        <Card className='absolute top-3 right-3 p-3 z-5'>
          <CardContent>
            <div>
              <AutoComplete
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                data={name_list}
                width={350}
              />

              <div className='text-end'>
                <Button
                  onClick={handleChoosePolygon}
                  size='sm'
                  className='my-2'
                >
                  Choose
                </Button>
              </div>
            </div>
            <div>
              <CustomDatePicker
                date={to ? new Date(to) : new Date()}
                onChange={(date) => {
                  if (!date) return;
                  const from = new Date(date.getTime()).setHours(0, 0, 1);
                  const to = new Date(date.getTime()).setHours(23, 59, 59);
                  router.replace({ query: { ...router.query, from, to } });
                }}
              />
            </div>
            <div>
              Status: <b>{status}</b>
            </div>
            <div>
              Length: <b>{trajectories?.length}</b>
            </div>
            {!error ? null : <div>Error: {JSON.stringify(error)}</div>}
          </CardContent>
        </Card>
      </Map>
    </div>
  );
};

export default MapBox;

const MyInput: ForwardRefRenderFunction<
  any,
  { value: string; onClick: () => void }
> = (props, ref) => {
  return <Input {...props} ref={ref} />;
};
const CustomInput = forwardRef(MyInput);
