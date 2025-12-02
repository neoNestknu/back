#!/bin/bash
set -e
source ./sub-scripts/env.sh
source ./sub-scripts/msg.sh

startMsg

copyEnvs

docker build -t nnk-auth:latest ../auth
docker build -t nnk-migration:latest ../migration_module
docker build -t nnk-notification:latest ../notification
docker build -t nnk-user:latest ../user
docker build -t nnk-auction:latest ../auction

docker compose -f docker-compose.prod.yml up -d

endMsg
