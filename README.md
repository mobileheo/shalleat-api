# Shall Eat?

Node Web API SSL server that fetches restuarnts data using Google place API and provide the data to any front end application that has permission to access to this server (server access restricted by cors).

## Demo

> 👇 Send sign in request to the server.

> <img src="./gifs/signin_demo.gif" width="500" height="300" />

> 👇 Send sign up request to the server.

> <img src="./gifs/signup_demo.gif" width="500" height="300" />

> 👇 Send request to get restaurants within 1.5km

> <img src="./gifs/find_nearby_demo.gif" width="500" height="300" />

> 👇 Send request to get restaurant detail

> <img src="./gifs/get_detail_demo.gif" width="500" height="300" />

## Getting Started

This server needs front end application to render the fetched JSON from google place api

### Prerequisites

1.  You need to install npm or yarn.
2.  You need to get Google Place API here is link (https://cloud.google.com/maps-platform/)
3.  After you get place api key, then follow next instruction.

### Installing

1.  This command to set up REST API server. (100% JavaScript)

```
$ git clone git@github.com:sunny-heo/ShallEat-API.git
```

2.  Assign google place api key to `GOOGLE_PLACE_API`. You can find this variable by typing 👇 commands in terminal after you clone this repository.

```
$ cd ShallEat-API

$ mv config/authConfigExample.js config/authConfig.js

$ open src/requests/authConfig.js
```

3.  After you store place api key, then follow next instruction.

4)  Install packages with npm or yarn

```
$ npm install
or
$ yarn install
```

Run server

```
$ npm start
or
$ yarn start
```

\*\* Since this application has nothing to do with rendering restaurants on map, if you want to render this data on Google map, you need to set upt and run React server. You cna get this server from here: https://github.com/sunny-heo/ShallEat-React

## Deployment

This application has not been deployed yet, but will be deployed soon on AWS and Heroku.

## Built With

- node
- knex
- objection
- passport
- jsonwebtoken
- express-promise-router
