import { config } from "@/config";
import { GooglePlacesApi } from "@/google/placesApi";
import { PlacesDbElastic, getEsConfig } from "@/places/places-db-elastic";
import { PlacesService } from "@/places/places-service";
import { IPlaceService } from "@/places/types";
import { IUserService } from "./users/types";
import { UserService } from "./users/users-service";
import { UserDbElastic } from "./users/users-db-elastic";
import { EmailService } from "./email";
import { AuthService } from "./auth/auth-service";


export const placesService = (): IPlaceService => {
  const placesDb = new PlacesDbElastic(getEsConfig(config));
  const googlePlaces = new GooglePlacesApi(config.googleApiKey)
  const service= new PlacesService(placesDb, googlePlaces)
  return service
}
export const usersService = (): IUserService => {
  const userDb = new UserDbElastic(getEsConfig(config))
  const authService = new AuthService(getEsConfig(config))
  const emailService = new EmailService()
  const service = new UserService(userDb, authService, config, emailService)
  return service
}
