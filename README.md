# Running the App

## Configuring the DB

-   Run `configure-docker.sh`
-   Create a .env file
-   add `DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres`

## Running backend

-   Run npm run dev

## Reinitialising the database

docker stop edvance
docker rm edvance
docker run --name edvance \
  -e POSTGRES_PASSWORD=admin \
  -p 5432:5432 \
  -d postgres

docker ps
rm -rf ./drizzle
npx drizzle-kit generate

## Database design

I got to the point in the interface where I was doing the history and requests so I refactored the database design to have the environment, also changed customers to clients since I thought that would be better but I get that its double meaning so feel free to refactor back to customers, basically it became a hybrid of both our designs. 


## Change summary - 
1. Implemented the database and added all the crud functions (services, controllers and routes) for the tables. 
2. Added an auth route for validating passwords. 
3. Added in the environment history object, also allowed multiple accounts to be moderators to a client account (used to be customer account feel free to change it)
4. Added generated comments.
5. Tests were done using generated content with some modifications, thought it could be good but didnt want to put too much effort into them given the speed of which we want to get this application running.

## Testing

Using jest for tests