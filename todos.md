# Tokens
- Add tests for security of routes that requires auth
- Implement email service
- Add cypress tests for user authentication


# Routes
A brief spec of the api endpoints needed

## Gets user data from token
```
USER       CLIENT      API
     getMe
     ----> 
                POST /api/me
                 ---->
```



## User attempts login with valid email
```
USER       CLIENT      API        AuthService
     verifyEmail(validEmail)
     ----> 
                POST /api/login
                 ---->
                           createVerificationCode
                            ----->
                            <-----
                            is_email_sent
```

## User attemps login with invalid email: 
```
USER       CLIENT      API        AuthService
     verifyEmail(invalidEmail)
     ----> 
                POST /api/login
                 ---->
                           createVerificationCode
                            ----->
                            <-----
                            invalid_email

```
