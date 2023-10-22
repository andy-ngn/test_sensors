import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import React from "react";
import dynamic from "next/dynamic";
import { client2 } from "@/lib/elastic";
import { FeatureCollection, Polygon, Properties } from "@turf/helpers";
const Mapbox = dynamic(() => import("@/components/MapBox"), { ssr: false });

export const getServerSideProps: GetServerSideProps<{
  data: FeatureCollection<Polygon, Properties & { name: string }> | null;
}> = async ({ query }) => {
  if (!query.from || !query.to) {
    const to = new Date().setHours(23, 59, 59);
    const from = new Date().setHours(0, 0, 1);

    return {
      redirect: {
        destination: `/map?from=${from}&to=${to}`,
        permanent: false,
      },
    };
  }
  const floor = "0";
  const org_id = "ikea_villesse";

  const aoi_id = org_id + "_" + floor;

  try {
    const {
      body: { _source },
    } = await client2.get<{
      geojson: FeatureCollection<Polygon, Properties & { name: string }>;
    }>({ index: "interest_area", id: aoi_id });
    const data = _source?.geojson!!;
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
      },
    };
  }
};
const Page: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
  return <div>{data ? <Mapbox data={data} /> : "Loading..."}</div>;
};

export default Page;
