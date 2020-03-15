# hanko

An API-only microservice for user authentiate.

## Public APIs

### Email + Password auth

`/auth/email/signup`

`/auth/email/confirm`

`/auth/email/signin`

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
- UserSession
- OAuthAuthiencation
- UserMeta
- Service
```
