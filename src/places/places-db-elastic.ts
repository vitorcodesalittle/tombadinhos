import fs from "fs";
import { Client, ClientOptions, errors } from "@elastic/elasticsearch";
import { SearchResponse } from "@elastic/elasticsearch/lib/api/typesWithBodyKey";
import { ApiConfig } from "@/config";
import { IPlacesDB } from "./types";
import { EnrichedPlace } from "@/common";

export const PLACES_INDEX_NAME = "places-00001";

export const getEsConfig = (config: ApiConfig): ClientOptions => {

  const esConfig = {
    "node": {
      "url": new URL(config.elastic.url)
    },
    "tls": {
      "ca": fs.readFileSync(config.elastic.caPath),
      "rejectUnauthorized": false
    },
    "auth": {
      "username": config.elastic.username,
      "password": config.elastic.password
    }
  };
  return esConfig;

};

export class PlacesDbElastic implements IPlacesDB {

  client: Client;

  constructor(clientOpts: ClientOptions) {

    this.client = new Client(clientOpts);

  }

  setupIndexes = async (): Promise<void> => {

    try {

      const result = await this.client.indices.create({
        "index": PLACES_INDEX_NAME,
        "mappings": {
          "properties": {
            "location": {
              "type": "geo_point"
            }
          }
        }
      });
      if (!result.acknowledged) {
        throw new Error("Failed to acknowledge places index creation");
      }
    } catch (err) {

      if (err instanceof errors.ResponseError && err.body.error.type === "resource_already_exists_exception") {
        console.info(`Index ${err.body.error.index} already setup ✅`);
        return;
      } else if (err instanceof errors.ResponseError) {
        console.error(err.body);
      }
      throw err;
    }
  };

  private convertSearchResultToHit = <T,>(response: SearchResponse<T>): (T & { _id: string })[] =>
    (response.hits.hits
      .map((hit) => ({ _id: hit._id, ...hit._source })) as (T & { _id: string })[])
      .filter((item) => Boolean(item));

  getPlaces: IPlacesDB["getPlaces"] = async ({ limit, skip, lat, lon, query }) => {

    let from = 0;
    if (skip) {

      from = skip;

    }

    const places = await this.client.search<EnrichedPlace>({
      from,
      "size": limit || 10000,
      "query": {
        "bool": {
          "should": [
            {
              "match": {
                "name": {
                  "query": query || "",
                  "fuzziness": "AUTO"
                }
              }
            },
            {
              "match": {
                "description": {
                  "query": query || "",
                  "fuzziness": "AUTO"
                }
              }
            }
          ],
          "filter": {
            "geo_distance": {
              "distance": "900000000km",
              "location": {
                lat,
                lon
              }
            }
          }
        }
      }
    });
    return this.convertSearchResultToHit(places);
  };

  count: IPlacesDB["count"] = async ({ lat, lon, query }) => {

    const places = await this.client.count({
      "index": PLACES_INDEX_NAME,
      "query": {
        "bool": {
          "should": [
            {
              "match": {
                "name": query
              }
            },
            {
              "match": {
                "description": query
              }
            }
          ],
          "filter": {
            "geo_distance": {
              "distance": "20000km",
              "location": {
                lat,
                lon
              }
            }
          }
        }
      }
    });
    return places.count;

  };

  writePlace: IPlacesDB["writePlace"] = (info, refresh = false) => this.client.index({
    "index": PLACES_INDEX_NAME,
    "document": info,
    refresh
  });

  getPlaceById: IPlacesDB['getPlaceById'] = async (placeId) => {
    try {
      const place = await this.client.get<Omit<EnrichedPlace, '_id'>>({
        index: PLACES_INDEX_NAME,
        id: placeId,
        refresh: true,
      })

      if (place?.found)
        return { _id: place._id, ...(place._source as Omit<EnrichedPlace, '_id'>) }

      return undefined
    } catch (err) {
      if (err instanceof errors.ResponseError) {
        // when error is from missing document return undefined
        if (! err.body.found || err.body.error.type === 'index_not_found_exception' || err.body.error.type === 'document_missing_exception')
          return undefined
      }
      throw err
    }
  }
}

