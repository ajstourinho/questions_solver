# questions_solver

## Development Environment

### Environment Configuration

To run the application properly, you need to set up environment variables in two separate `.env` files: one for the frontend and one for the backend. Below is a description of the environment variables used in this project.

#### Frontend: `.env` File

The frontend environment variables should be defined in a `.env` file located inside the `frontend` folder.

- **REAIS_PER_PAGE**: This variable defines the number of "REAIS" (likely a unit of measure or a specific item) that should be displayed per page in the frontend application.

#### Backend: `.env` File

The backend environment variables should be defined in a `.env` file located inside the `backend` folder. These variables are necessary for configuring the connection to the Pix API and handling secure transactions.

- **CLIENT_ID**: The login string for the Pix provider.
- **CLIENT_SECRET**: The password string for the Pix provider.
- **KEY_PEM_PATH**: The file path to the certificate required for authentication with the Pix API.
- **PIX_RECEIVER_KEY**: The receiving key for the desired account to handle Pix transactions.

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

