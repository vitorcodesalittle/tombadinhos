
// All tests entrypoint
export default async function() {
  const dotenv = require('dotenv')
  dotenv.config({
    debug: true,
    path: '.env.local',
    encoding: 'utf-8',
    override: true
  })
  const { config } = require("@/config")
  const { PlacesDbElastic, getEsConfig } = require("@/places/places-db-elastic")
  new PlacesDbElastic(getEsConfig(config)).setupIndexes()
}
