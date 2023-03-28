import { PLACES_INDEX_NAME, PlacesDbElastic, getEsConfig } from "./places-db-elastic";
import { deleteAll, mockEnrichedPlace } from "test/utils";
import { config } from "../config";
import { EnrichedPlace } from "@/common";


const examples: Omit<EnrichedPlace, '_id'>[] = [
  {
    "name": "AAABBBCCC",
    "description": "only lowercase stuff"
  },
  {
    "name": "Only Upper Case Here",
    "description": "Only Upper Case"
  },
  {
    "name": "Some Stuff",
    "description": "Some Stuff"
  }
].map(({ name, description }) => ({
  ...mockEnrichedPlace(),
  name,
  description
}));

describe(
  "PlacesDbElastic",
  () => {

    let db: PlacesDbElastic;
    let mockedPlaces: EnrichedPlace[]
    beforeAll(async () => {

      db = new PlacesDbElastic(getEsConfig(config));
      await db.setupIndexes();

    });
    beforeEach(async () => {

      await deleteAll(
        db,
        PLACES_INDEX_NAME
      );
      mockedPlaces = []
      for (const example of examples) {
        const result = await db.writePlace(
          example,
          true
        );
        mockedPlaces.push({ ...example, _id: result._id })
      }
    });
    describe(
      "getPlaces(...)",
      () => {

        it(
          "works",
          async () => {

            const result = await db.getPlaces({
              "query": "",
              "lat": -3,
              "lon": -42
            });
            expect(result.length).toBeGreaterThan(0);

          }
        );


        it(
          "search works on terms regardless of the casing",
          async () => {

            for (const example of examples) {

              const result = await db.getPlaces({
                "query": example.name.toLowerCase(),
                "lon": -32,
                "lat": -8
              });
              expect(result.length).toBeGreaterThan(0);
              expect(result[0].name).toBe(example.name);
              expect(result[0].description).toBe(example.description);

            }

          }
        );

        it(
          "search works on terms that don't match exactly",
          async () => {

            for (const example of examples) {

              const query = example.name.toLowerCase().split(" ").
                map((str) => str.substring(
                  0,
                  str.length - 1
                )).
                join(" "),
                result = await db.getPlaces({
                  query,
                  "lon": -32,
                  "lat": -8
                });
              expect(result.length).toBeGreaterThan(0);
              expect(result[0].name).toBe(example.name);
              expect(result[0].description).toBe(example.description);

            }

          }
        );

        it(
          "search works on terms that don't match exactly (1)",
          async () => {

            for (const example of examples) {

              const query = example.name.toLowerCase().split(" ").
                map((str) => `hh ${str.substring(
                  0,
                  str.length - 1
                )}`).
                join(" "),
                result = await db.getPlaces({
                  query,
                  "lon": -32,
                  "lat": -8
                });
              expect(result.length).toBeGreaterThan(0);
              expect(result[0].name).toBe(example.name);
              expect(result[0].description).toBe(example.description);

            }

          }
        );

        it(
          "search works on terms that don't match exactly (2)",
          async () => {

            for (const example of examples) {

              const query = example.name.toLowerCase().split(" ").
                map((str) => `${str.substring(
                  0,
                  str.length - 1
                )}d`).
                join(" "),
                result = await db.getPlaces({
                  query,
                  "lon": -32,
                  "lat": -8
                });
              expect(result.length).toBeGreaterThan(0);
              expect(result[0].name).toBe(example.name);
              expect(result[0].description).toBe(example.description);

            }

          }
        );

      }
    );

    describe("getPlaceById", () => {

      it('Finds place by id', async () => {
        const place = mockedPlaces[0];
        const result = await db.getPlaceById(place._id);
        expect(result).toBeDefined();
        expect(result?._id).toBe(place._id);
      })

      it("Returns undefined for missing place", async () => {
        const result = await db.getPlaceById('-3');
        expect(result).toBeUndefined();
      })

    })
    it(
      "writePlace(...)",
      async () => {

        const enrichedPlace = mockEnrichedPlace(),
          result = await db.writePlace(enrichedPlace);
        expect(result).toBeDefined();

      }
    );

  }
);
