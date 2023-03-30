import {UserServiceError} from '@/users/errors'
import {PlaceServicepError} from '@/places/errors'

enum AppError {
  InternalError = 'internal-error'
}
type Code = UserServiceError | PlaceServicepError | AppError
export class ApiError extends Error {
    code: Code
    constructor(m: string = '', code?: Code) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiError.prototype);
        this.code = code || AppError.InternalError
    }
}
