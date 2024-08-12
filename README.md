# questions_solver

## Development Environment

### Building and running the containers

To build the containers via the ```docker-compose.dev.yml``` file, use the command:

```
docker compose -f docker-compose.dev.yml build
```

After building, you can start and run the containers with the command:

```
docker-compose -f docker-compose.dev.yml up
```

> This Development Environment allows for hot reloading on the frontend.

### Installing new React dependencies

First, build and let the frontend container run with the previous steps.

After that, manually execute the installation of the dependency inside the frontend container with the command:


```
docker exec -it <container_name_or_id> npm install <name_of_dependence>
```

> Note that it will be needed the name or id of the container, which can be consulted with the command ```docker ps```

> Also note that, by the volumes configuration in the `docker-compose` file, the ```package.json``` and ```package-lock.json``` got updated inside the container as well as in the host.

### Accessing MongoDB

For development purposes, you might want to access MongoDB directly:

*   **MongoDB Shell**: Run `docker exec -it <mongo-container-name> mongosh` to access the MongoDB shell within the container.
*   **GUI Tools**: Connect GUI tools like MongoDB Compass to `localhost:27017` for local development.

> MongoDB Compass can be installed (on the [MongoDB official site](https://www.mongodb.com/try/download/shell)) and used in the host, as the ```docker-compose``` file maps the ```27017``` ports of the container and the host to reflect changes.

> It is important to note that the ```mongo-data``` volume defined in the ```docker-compose``` is the one that stores and persists the MongoDB data (even if the container stops or is removed).

