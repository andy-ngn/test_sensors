```typescript

//@ts-check

import { getTypedEsClient } from 'src/utilities/elasticHelpers'

/** @type {import("next").NextApiHandler} */
export default async (req, res) => {
  try {
    /** @type {import('@turf/helpers').Feature<import('@turf/helpers').Polygon>} */
    const geojson = {
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.431889, 45.865945],
            [13.431919, 45.865937],
            [13.43189, 45.865891],
            [13.431943, 45.865874],
            [13.431936, 45.865863],
            [13.431874, 45.865769],
            [13.431869, 45.865762],
            [13.431768, 45.865795],
            [13.43174, 45.865752],
            [13.431711, 45.865761],
            [13.431733, 45.865795],
            [13.431752, 45.865825],
            [13.431759, 45.865823],
            [13.431854, 45.865792],
            [13.431884, 45.865837],
            [13.431902, 45.865863],
            [13.431855, 45.865878],
            [13.431847, 45.865881],
            [13.431854, 45.865892],
            [13.431889, 45.865945]
          ]
        ]
      },
      id: '8baecf8f2eb17601bf80392d6a184ba2796ceb0499fb6f82412f52572e0743a9',
      properties: {
        geodesic_area: 94.0354,
        labels: '',
        max_distance: 0,
        max_duration: 0,
        min_duration: 0,
        min_max_coords: {
          lat_min: 45.865752,
          lat_max: 45.865945,
          lng_min: 13.431711,
          lng_max: 13.431943
        },
        name: 'Corridor HFB12',
        opening: [0, 0, 0, 0],
        parent_1: 'HFB12',
        parent_2: 'Markethall',
        passers_by_polygon: false,
        status: true
      },
      type: 'Feature'
    }
    const { body: traj } = await getTypedEsClient('eu-cluster').search({
      index: 'ikea_villesse_interpolated_trajectories',
      size: 100,
      body: {
        query: {
          bool: {
            must: {
              match_all: {}
            },
            filter: {
              geo_shape: {
                coordinate: {
                  shape: {
                    type: 'polygon',
                    coordinates: geojson.geometry.coordinates
                  },
                  relation: 'intersects'
                }
              }
            }
          }
        }
      }
    })
    return res.status(200).json(traj)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
///


 reuseMaps
            styleDiffing
            mapboxAccessToken='pk.eyJ1IjoiaWI5OCIsImEiOiJjbGhhbTRuaXUwOGliM2Ruc3h2YTFoMG9yIn0.YtRfHX0vI6aXB6WBD6hajg'
            mapStyle={`mapbox://styles/mapbox/${isDarkMode ? 'dark' : 'light'}-v11`}
            preserveDrawingBuffer
            antialias
            dragPan={editMode === ViewMode}
            onMove={onViewStateChangeMap}

```
