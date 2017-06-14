#!/usr/bin/env bash

# --build: Build images before starting containers.
# --abort-on-container-exit: Stops all containers if any container is stopped
docker-compose -f 'docker-compose.test.yml' -p ci up --build --abort-on-container-exit
exit $(docker wait ci_express-mongoose-es6-rest-api_1)
