# Docker and Kubernetes

## Docker Basics

**Why use Docker?** Because it makes it very easy to install and run software without worrying about setup or dependencies.

**What is Docker?** Docker is a platform or ecosystem around creating and running containers.

**********Image**********: A single file with all the deps and config required to run a program.

******************Container******************: An instance of an image. Runs the program.

**************************Docker Client**************************: A CLI tool that we use to issue Docker commands

**************************Docker Server**************************: A tool that is responsible for creating images, running containers, etc. The CLI interfaces with the server.

********************Docker Hub********************: A repository of free public images that you can freely run and download.

`docker run hello-world`: This command reaches out to Docker Hub, downloads the hello-world image, then creates a container and runs it. The second time this runs docker will pull the image out of its cache.

************Kernel************: A running software in an operating system that facilitates communication between running applications and hardware. The applications issue what are called “System Calls”. The Kernel exposes different endpoints that applications can interface with.

A dependency of Docker is *Linux*. If docker is running its running because of Linux.

`docker run <image> <command>`:   Tries to create and run a container for <image>. <command> is the default command override that is issued directly to the container. Example: `docker run busybox ls`. 

`docker ps`: A command that shows the running containers on a machine

`--all`: Shows all containers that have ever been created

**Container Lifecycle**: `docker run` is a composition between `docker create` and `docker start`. Docker create preps a container to be run by sort of initializing the file system snapshot. Docker run actually runs the container.

`docker create <image name>`: Attempts to create a container with the given image name

`docker start <container id>`: Runs a container with the provided ID

`-a`: will show us the output from running start

`docker system prune`: deletes all containers from the workspace

`docker logs <container id>`: retrieves and prints all information that has been emitted from given container

`docker stop <container id>`: will “stop” a running container. It stops the primary process running in a container. It’s a more graceful shutdown signal.

`docker kill <container id>`: Terminates a container immediately. Stop is preferred over kill.

`docker run redis`: This will start up an instance of Redis, but how can you use the instance from the command line?

`docker exec -it <container id> <command>`: Allows you to issue commands to a container.

`-it`: `-i` and `-t` are two different flags. 

`-i`: attach our terminal to the STDIN of the command we are issuing

`-t`: makes sure that all text channels are being formatted correctly

- `docker exec -it <redis container id> redis-cli` gives access to the redis cli in a running container
- `docker exec -it <container id> sh` allows us full terminal access inside the context of a container that is good for debugging. `sh` is a command shell. Some containers make use of `bash` as a command shell.

Containers are completely isolated from each other. Super important to understand.

## Installing Docker (For Windows)

1. Create a DockerHub account
2. Make sure Windows is updated
3. Run the WSL install script in PowerShell `wsl --install`
4. Restart your computer
5. Install Docker Desktop
6. Enable WSL integration in settings
7. Open your distro (Ubuntu) then use `docker login`

## Building a Dockerfile

1. Create a Dockerfile
    1. Use an existing docker image as a base image
    2. Download and install a dependency
    3. Tell the image what to do when it start as a container
        
        ```docker
        # Use an existing docker image as a base
        FROM alpine
        
        # Download and install a dependency
        RUN apk add --update redis
        
        # Tell the image what to do when it starts as a container
        CMD ["redis-server"]
        ```
        
2. Run Docker commands
    1. `docker build .` (returns image id)
    2. `docker run <image_id>`

### What’s a Base Image?

Writing a Dockerfile is like being given a computer with no OS and then being asked to install Google Chrome on it. First step would be installing an operating system. That’s like installing a base image. A base image comes with a preinstalled set of programs that are useful.

What is `alpine`? Because we wanted `apk`. This allowed us to install and run Redis.

### Build Process

1. Reach out to DockerHub or cache to download base image.
2. Start up a temporary container out of base image and installed Redis then shut down container.
3. Start up a temporary container which now has Redis. This tells the container what should be the primary command. In this case, `redis-server`. Then the container gets shutdown and final image is generated.

Each step in the process is generating temporary images. These temporary images get cached for performance. If you ever want to change your Dockerfile, you should put those changes as far down the file as possible to maintain cache performance.

Neat command: `docker build -t <docker_id>/<project_name>:latest` This is called tagging.

Now you can use: `docker run <docker_id>/<project_name>` 

## Node & Docker

```
FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
```

- Port Mapping: docker run -p 8080:8080 <image_id>

## Docker Compose

A tool that is used to start up multiple docker containers at the same time.

In the app above, we may want the node container to interface with Redis that is running in its own container. So we define a docker-compose.yml file to define that.

```yaml
version: '3' # version of docker-compose
services:
  redis-server:
    image: 'redis'
  node-app:
    restart: on-failure # always restart the container if it stops
    build: . # use the Dockerfile in the current directory
    ports:
      - '4001:8081' # map port 4001 on the host to port 8081 in the container
```

| docker-compose up --build  | Runs a docker compose file and builds any custom images |
| --- | --- |
| docker-compose up -d | Runs a docker compose file in the backgrond |
| docker-compose down | Shuts down containers associated with a docker image |
| docker-compose ps | Prints information  |