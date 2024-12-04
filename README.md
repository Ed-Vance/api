# Running the App

## Configuring the DB

-   Run `configure-docker.sh`
-   Create a .env file
-   add `DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres`

## Running backend

-   Run npm run dev

## To reinitalise

-   docker stop edvance
-   docker rm edvance
-   docker run --name edvance \
  -e POSTGRES_PASSWORD=admin \
  -p 5432:5432 \
  -d postgres

-   docker ps
-   rm -rf ./drizzle
-   npx drizzle-kit generate

