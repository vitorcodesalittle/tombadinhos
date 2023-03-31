describe('/api/verify-code', () => {
  it('returns jwt token if code and email match and code is not expired', async () => {
    throw 'not implemented'

  })

  it('when code is expired returns ApiError with CodeExpired', async () => {

    throw 'not implemented'
  })

  it('returns invalid request when email does not match code or code is missing', async () => {
    throw 'not implemented'
  })
})
