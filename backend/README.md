# hanko

An API-only microservice for user authentiate.

## Modules / APIs

### UserModule

```
AuthController:

- POST /auth/oauth/google
- POST /auth/oauth/facebook TODO
- POST /auth/oauth/twitter  TODO

```

<!--
POST /auth/email/signup
POST /auth/email/confirm
POST /auth/email/signin
-->

```
UserController:

- GET /user/id/:userId
- GET /user/self      (requires auth)
- PUT /user/self      (requires auth)
```


## Models

```
- User
    - email / password / email reset
    - has_many OAuthAuthorization
    - has_many UserSession
    <!-- - has_one UserMeta -->
- UserSession
- OAuthAuthiencation
- UserMeta
```