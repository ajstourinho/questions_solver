# questions_solver

## Description

QuestionsSolver is a complete website to help students solve old exams using AI.

---

## Table of Contents

- [Development Environment](#development-environment)
  - [DEV: Environment Configuration](#dev-environment-configuration)
    - [Frontend: `.env` File](#frontend-env-file)
    - [Backend: `.env` File](#backend-env-file)
  - [DEV: Build and run the containers](#dev-build-and-run-the-containers)
  - [DEV: Install new React dependencies](#dev-install-new-react-dependencies)
- [Production Environment](#production-environment)
  - [PROD: Environment Configuration](#prod-environment-configuration)
  - [PROD: Build and run the containers](#prod-build-and-run-the-containers)

---

## Development Environment

### DEV: Environment Configuration

To run the application properly, you need to set up environment variables in two separate `.env` files: one for the frontend and one for the backend. Below is a description of the environment variables used in this project.

#### Frontend: `.env` File

The frontend environment variables should be defined in a `.env` file located inside the `/frontend` directory.

- **REACT_APP_ENV**: This variable defines if the environment is `development` or `production`.
- **REACT_APP_REAIS_PER_QUESTION**: This variable defines the amount charged for solving one question of the exam, in Reais (the Brazilian currency).

An example of this `.env` file can be found inside the `/frontend` directory, by the name `.env.example`.

#### Backend: `.env` File

The backend environment variables should be defined in a `.env` file located inside the `backend` directory. These variables are necessary for configuring the secure connection to the Pix API and to the Mail API.

- **ENV**: This variable defines if the environment is `development` or `production`.
- Pix API variables:
  - **CLIENT_ID**: The login string for the Pix provider.
  - **CLIENT_SECRET**: The password string for the Pix provider.
  - **KEY_PEM_PATH**: The file path to the certificate required for authentication with the Pix API.
  - **PIX_RECEIVER_KEY**: The receiving key for the desired account to handle Pix transactions.
- Mail API variables:
  - **MAIL_SERVER**: The mail SMTP server.
  - **MAIL_PORT**: The mail port.
  - **MAIL_USE_TLS**: A boolean do define secure TLS mail connection.
  - **MAIL_USERNAME**: The username of the mail account in use.
  - **MAIL_PASSWORD**: The password of the mail account in use. 
  - **MAIL_DEFAULT_SENDER**: The e-mail of the sender account.

An example of this `.env` file can be found inside the `/backend` directory, by the name `.env.example`.

### DEV: Build and run the containers

To build the containers via the ```docker-compose.dev.yml``` file, use the command:

```
docker compose -f docker-compose.dev.yml build --no-cache
```
> The `--no-cache` is recommended to ensure a clear build of the image.

After building, you can start and run the containers with the command:

```
docker-compose -f docker-compose.dev.yml up
```

> This Development Environment allows for hot reloading on the frontend.

### DEV: Install new React dependencies

First, build and let the frontend container run with the previous steps.

After that, manually execute the installation of the dependency inside the frontend container with the command:

```
docker exec -it <container_name_or_id> npm install <name_of_dependence>
```

> Note that it will be needed the name or id of the container, which can be consulted with the command ```docker ps```

> Also note that, by the volumes configuration in the `docker-compose.dev.yml` file, the ```package.json``` and ```package-lock.json``` got updated inside the container as well as in the host.

## Production Environment

### PROD: Environment Configuration

To run the application properly, you need to set up environment variables in the exact same way as in the [Development Environment](#development-environment).
The main change is to set the `REACT_APP_ENV` and `ENV` variables to `production`, on the `.env` files of the `/frontend` and `/backend` respectively.

### PROD: Build and run the containers

To build the containers via the ```docker-compose.prod.yml``` file, use the command:

```
docker compose -f docker-compose.prod.yml build --no-cache
```
> The `--no-cache` is recommended to ensure a clear build of the image.

After building, you can start and run the containers with the command:

```
docker-compose -f docker-compose.prod.yml up
```

---

### Legacy README

#### Accessing MongoDB

For development purposes, you might want to access MongoDB directly:

*   **MongoDB Shell**: Run `docker exec -it <mongo-container-name> mongosh` to access the MongoDB shell within the container.
*   **GUI Tools**: Connect GUI tools like MongoDB Compass to `localhost:27017` for local development.

> MongoDB Compass can be installed (on the [MongoDB official site](https://www.mongodb.com/try/download/shell)) and used in the host, as the ```docker-compose``` file maps the ```27017``` ports of the container and the host to reflect changes.

> It is important to note that the ```mongo-data``` volume defined in the ```docker-compose``` is the one that stores and persists the MongoDB data (even if the container stops or is removed).

