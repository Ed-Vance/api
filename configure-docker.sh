#!/bin/bash

docker pull postgres:17.2

docker run --name edvance -e POSTGRES_PASSWORD=admin -d -p 5432:5432 postgres
