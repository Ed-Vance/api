# Running the App

## Configuring the DB

-   Run `configure-docker.sh`
-   Create a .env file
-   add `DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres`
-   add `JWT_SECRET=maxsecret`

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
npx drizzle-kit migrate

## Database design

I got to the point in the interface where I was doing the history and requests so I refactored the database design to have the environment, also changed customers to clients since I thought that would be better but I get that its double meaning so feel free to refactor back to customers, basically it became a hybrid of both our designs. 


## Change summary - 
1. Implemented the database and added all the crud functions (services, controllers and routes) for the tables. 
2. Added an auth route for validating passwords. 
3. Added in the environment history object, also allowed multiple accounts to be moderators to a client account (used to be customer account feel free to change it)
4. Added generated comments.
5. Tests were done using generated content with some modifications, thought it could be good but didnt want to put too much effort into them given the speed of which we want to get this application running.
6. We now have protected route here and the functionality I believe the front end requires, once back I plan to refactor and move stuff around to make it a bit more efficiently and better done, however as the time currently is 12am and I fly out at 6am I am done until I get back from holiday.

## Testing

Using jest for tests

## Packages I had to install:
bcrypt
--save-dev @types/bcrypt

## To do:
1. I suspect this should do for the back end for now, I can touch it up once I am back, the more notable thing is the auth pass where the only routes that can be accessed when not logged in are sign up and login (that took a bit of time). 
2. I want to implement the JWT token stuff a bit better to maintain the authentication better, I aim to have it refresh every 15 mins for some shorter term token and then have some longer term token that would require the user to log in for. Need to also look at how to manage these from the front end, but I have some vauge idea how to maintain this. 

## Notes:
This repo passes my tests and runs however I did have some random bug in one of the previous commits where it wouldnt pass the tests and wouldnt recognise the users table, this was fixed by the npx drizzle-kit migrate command.

You will also need to have a JWT_SECRET=maxsecret in your .env

As I write this note I notice that it might be a pain for you to write the code for the auth logic, thus feel free to comment out the middle ware I am fairly sure it should be fine once that is commented out. 