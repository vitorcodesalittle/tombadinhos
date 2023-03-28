import { AssertionError } from "assert"
import { GooglePlacesApi, GoogleStatus } from "./placesApi"

describe('GooglePlacesApi#', () => {
  const api = new GooglePlacesApi(process.env.GOOGLE_API_KEY || '')
  describe('findPlace', () => {
    it('returns place details given building name', async () => {
      const response = await api.findPlace({
        input: 'Marco Zero'
      })
      expect(response).toBeDefined()
      if (response.status !== GoogleStatus.OK) {
        throw new AssertionError({ message: "Request to Google Places API failed: " + response.error_message, actual: response.status, expected: GoogleStatus.OK})
      }
      expect(response.candidates.length).toBeGreaterThan(0);
    })
  })
})
