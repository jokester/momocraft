CREATE TABLE hanko_users (
    user_id      UUID PRIMARY KEY,
    short_id     VARCHAR(20) UNIQUE,
    email        VARCHAR(100) UNIQUE,
    hashed_pass  VARCHAR(200),
    confirmed_at TIMESTAMP WITHOUT TIME ZONE,
    created_at   TIMESTAMP WITHOUT TIME ZONE,
    updated_at   TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE `hanko_user_auth` (

);

CREATE TABLE `hanko_user_oauth` (
);
