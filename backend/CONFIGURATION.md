## typeorm

### dev

```
cp .env.dev.sample .env           # and fill in secrets
yarn build
yarn typeorm:dev migration:create # would create files in ./src/db/
yarn typeorm:dev migration:run    # would use files in ./src/db/
yarn start
```

### prod

```
cp .env.prod.sample .env   # and fill in secrets
yarn build
yarn typeorm migration:run # would use compiled entities/migrations in ./dist/db/
yarn start
```

