import {range} from "@/common/util";
import {IPlaceService} from "./types";
import {PLACES_INDEX_NAME, PlacesDbElastic, getEsConfig} from "./places-db-elastic";
import {PlacesService} from "./places-service";
import {MockGooglePlacesApi, deleteAll, mockEnrichedPlace} from "test/utils";
import {config} from "../config";

describe(
  "PlaceService#",
  () => {

    let db: PlacesDbElastic,
      service: IPlaceService;


    beforeAll(() => {

      db = new PlacesDbElastic(getEsConfig(config));
      service = new PlacesService(
        db,
        new MockGooglePlacesApi()
      );

    });

    beforeEach(async () => {

      await deleteAll(
        PLACES_INDEX_NAME
      );
      await Promise.all(range(5).map(() => db.writePlace(
        mockEnrichedPlace(),
        true
      )));

    });

    describe(
      "getPlaces",
      () => {

        it(
          "returns a paginated list of places from the database",
          async () => {

            const places = await service.searchPlaces();
            expect(places).toHaveProperty("data");
            expect(places).toHaveProperty("total");
            expect(places.data).toHaveLength(5);
            expect(places.total).toBe(5);

          }
        );

      }
    );

    describe(
      "getPlaceById",
      () => {

        it(
          "returns the correct place when it exists",
          async () => {
            const places = await service.searchPlaces();
            const placeId = places.data[0]._id;
            console.info({placeId})
            const place = await service.getPlace({placeId});
            expect(place).toHaveProperty("_id");
            expect(place._id).toBe(placeId);

          }
        );

      }
    );
  }
);
