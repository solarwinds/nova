# rubber-duck

`rubber-duck` is a test harness for the nova UI framework. It was generated with [Angular CLI](https://github.com/angular/angular-cli) and consumes `solarwinds/nova-bits`
in the way, regular consumers will do.

<br>

## Development

The fastest and easiest way will be to use `docker-compose`. You can also run 
front-end and back-end part separately on your local environment. See the front-end and back-end sections
of this document.

## Using docker-compose

To start this way, you'll need docker and docker-compose to be installed on your dev box.
For prerequisites, please, read [Docker easy-entry guide](https://cp.solarwinds.com/display/NU/Docker+easy-entry+guide).

All the actions described below should be done in the `consumer` folder, where `docker-compose.yml` file is located.

### Building the 'build' docker image

Run `docker-compose build build`.

It will create an image with installed prerequisites, that you'll need for further developement (bash, vim, chromium, npm dependencies).
Now you can use this image to run any yarn/npm task. The only difference - it will all be done in docker.
Just run `docker-compose run build yarn run [task-name]` or its npm equivalent: `docker-compose run build npm run [task-name]`. 

*Note: we prefer **yarn**, as it proved to be faster. We use it for building this image as well as for our builds on Teamcity.*

#### Examples of useful commands

* To run unit tests `docker-compose run build yarn run test`
* To run unit tests once with code coverage `docker-compose run build yarn run test --no-watch --code-coverage`
* To start dev server with auto reload `docker-compose run build yarn start`

Your dev server will be running on port 4200 and can be accessed by navigating to `http://localhost:4200/`. 

<br>

### Running end-to-end tests

For running e2e tests locally, we recommend using the `docker-compose` approach which consists of: 

#### Setting up the e2e environment 

Run `docker-compose up -d --build db api web selenium-chrome-standalone`

*Note: `-d` is for running in detached mode. `--build` is for rebuilding images, if required.*

It will start services you'll need:
* **db** for mongo database.
* **api** for serving graphQL backend. Will be available on `http://localhost:4000/graphql`. (Be aware: 'watch' node doesn't work for ts-node in docker)
* **web** for serving production built application with nginx server. Requires `docker-compose run build yarn run build-docker` to be executed before.
* **selenium-chrome-standalone** for selenium driver and chrome instance. See [link](https://github.com/SeleniumHQ/docker-selenium) for more details.

#### Running e2e in docker

Run `docker-compose run build yarn run e2e-docker`.

### Shutting down

Run `docker-compose down`.

You may find additional keys, such as `-v` for removing name volumes or `--rmi="all"` for removing images, usefull as well. See more in [Docker documentation](https://docs.docker.com/compose/reference/down/).

<br>

## Front-end

* Go to `consumer/web`
* Run `npm install`
* Run `npm start` for a dev server
* Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files

**Note:** Before `npm install` will work, npm needs to be told where to grab solarwinds artifacts, so you'll need to run 
`npm config set @solarwinds:registry=http://dev-artifactory.dev.local:8081/artifactory/api/npm/npm`. Once you've 
configured the registry, you'll likely never need to run it again.

<br>

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Build will be 
done in production mode and will be using AOT.

<br>

### Code scaffolding using Angular CLI

In the command prompt, set the active directory to `consumer/web`. Run `ng generate component <component-name>` to 
generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module 
<dependency-name>`.

Additional information about Angular CLI can be found [here](https://cli.angular.io/).

<br>

### Available front-end npm commands

| Command | Description |
|   ---   |     ---     |
| config | Configure the environment |
| ng | The Angular CLI command |
| start | Configure the environment and run the Angular CLI serve command |
| start-aot | Configure the environment and run the Angular CLI serve command with AOT enabled |
| build | Configure the environment and build the frontend in production mode |
| lint | Run the Angular CLI lint command |
| test | Run the unit tests and automatically watch your files for changes. You can run tests a single time by adding
 `-- --watch=false` |

<br>

## Back-end

* Go to `consumer/server`
* Run `npm install`. (Setting registry is required, as usual)
* Run `npm start` or `npm run watch`.
* Navigate to `http://localhost:4000/graphql`

<br>

### Available back-end npm commands

| Command | Description |
|   ---   |     ---     |
| start | Run ts-node with type-check |
| watch | Run ts-node-dev with type-check and respawn |

<br>

## Running unit tests

*UNDER DEVELOPEMENT*

<br>

## Further help

To get more help on the Angular CLI use `ng help` or go check out the 
[Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

<br>

## FAQ

> On running the docker-compose command the first time, I get an error mounting the volume. What should I do?

1. Check that your docker can access the drive you are using. By default docker has only the C: drive available.
2. Try to restart the docker deamon. Sometimes that is the only way to make new volume mappings work.

---

