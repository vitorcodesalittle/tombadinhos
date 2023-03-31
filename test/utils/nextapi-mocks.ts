import { NextApiRequest, NextApiResponse, req } from "next"

export const mockNextApiRequest = (req: Partial<NextApiRequest> = {}): NextApiRequest => {
  return {
    query: {},
    cookies: {},
    body: undefined,
    headers: {},
    method: "GET",
    url: "/",
    env: {},
    aborted: false,
    httpVersion: 'http',
    httpVersionMajor: 2,
    httpVersionMinor: 1,
    complete: false,
    ...req,
  } as NextApiRequest
}

export const mockNextApiResponse = (res: Partial<NextApiResponse> = {}) => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    ...res
  }
}
