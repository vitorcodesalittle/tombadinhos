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
import { IAuthService } from "./auth/types";


export const getPlacesService = (): IPlaceService => {
  const placesDb = new PlacesDbElastic(getEsConfig(config));
  const googlePlaces = new GooglePlacesApi(config.googleApiKey)
  const service= new PlacesService(placesDb, googlePlaces)
  return service
}
export const getAuthService = (): IAuthService => {
  const authService = new AuthService(getEsConfig(config))
  return authService;

}
export const getUserService = (): IUserService => {
  const userDb = new UserDbElastic(getEsConfig(config))
  const authService = getAuthService()
  const emailService = new EmailService()
  const service = new UserService(userDb, authService, config, emailService)
  return service
}
