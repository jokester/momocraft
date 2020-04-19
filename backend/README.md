# hanko

An API-only microservice for user authentiate.

## Public APIs

### Email + Password auth


### Google OAuth

`/auth/oauth/google`

### FB OAuth

`/auth/oauth/facebook`

## Private APIs

### Session validation

### User Metadata

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

## Modules / HTTP APIs

UserModule:

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
- PUT /user/self/meta (requires auth)
```
