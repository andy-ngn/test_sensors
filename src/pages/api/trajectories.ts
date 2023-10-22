import { client2 } from "@/lib/elastic";
import type { NextApiRequest, NextApiResponse } from "next";
import type { FeatureCollection, Polygon, Properties } from "@turf/helpers";
const time_zone = "Europe/Rome";
const floor = "0";
const org_id = "ikea_villesse";
const index = org_id + "_interpolated_trajectories";
const aoi_id = org_id + "_" + floor;
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { polygon, from, to } = req.query;
  if (!polygon || !from || !to)
    return res.status(400).json({ message: "Missing params" });
  const polygon_name = String(polygon);
  const gte = Number(from);
  const lte = Number(to);

  try {
    const {
      body: { _source },
    } = await client2.get<{
      geojson: FeatureCollection<Polygon, Properties & { name: string }>;
    }>({ index: "interest_area", id: aoi_id });
    if (!_source) throw { status: 404, message: "geojson not found" };
    const geo_data = _source.geojson;
    const polygon_coords = geo_data.features.find(
      ({ properties }) =>
        makeCompatible(properties.name) === makeCompatible(polygon_name)
    )?.geometry.coordinates;

    if (!polygon_coords?.length)
      throw { status: 404, message: "geojson not found" };

    const { body: trajectories } = await client2.search({
      index,
      size: 50000,
      body: {
        query: {
          bool: {
            must: {
              match_all: {},
            },
            filter: [
              {
                geo_shape: {
                  coordinate: {
                    shape: {
                      type: "polygon",
                      coordinates: polygon_coords,
                    },
                    relation: "intersects",
                  },
                },
              },
              {
                range: {
                  timestamp: {
                    gte,
                    lte,
                    time_zone,
                    format: "epoch_millis",
                  },
                },
              },
            ],
          },
        },
      },
    });

    return res.status(200).json(trajectories.hits.hits.map((x) => x._source));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export default handler;

function makeCompatible(str: string) {
  return str.trim().toLowerCase();
}
