<h1 align="center">
  [Task Tracker](https://app.screencastify.com/v3/watch/Cbe8rQ7hthBm6e9tflY4)
</h1>

## Prerequisites

- [Node.js](https://nodejs.org/en/download/package-manager)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [NPM](https://docs.npmjs.com/getting-started/installing-node)
- [MySQL](https://www.mysql.com/downloads/)

## Setup
```sh
$ git clone git@github.com:Prabeg29/prithak-task.git <application-name>
$ cd <application-name>
$ rm -rf .git
$ cd ./backend # or ./frontend
$ yarn   # or npm i
```

### Backend
Make a copy of `.env.example` as `.env` and update your application details (if you are using docker, use the default database credentials). Now, run the migrations and seed the database.

```sh
$ cd ./backend
$ yarn migrate
$ yarn seed
```

Start the application.
```sh
$ yarn start:dev
```

Navigate to http://localhost:8848/api/ping to verify installation.

#### Creating new Migrations and Seeds

These are the commands to create a new migration and corresponding seed file.
```
$ yarn make:migration <name>
$ yarn make:seed <name>
```

#### Testing

Create a database for testing and use the following command
```
$ yarn test
```

### Frontend
Start the application.
```sh
$ yarn start
```

Navigate to http://localhost:5173/auth/login to verify installation.


## Using Docker
Use [docker-compose](https://docs.docker.com/compose/) to spin up docker-containers. 

```
$ docker-compose up
```
Navigate to http://localhost:5173/auth/login to verify frontend application is running
Navigate to http://localhost:8848/api/ping to verify backend application is running 

Bring down stack,
```sh
$ docker-compose down
```

### Tests
```sh
$ docker compose exec backend yarn test
```