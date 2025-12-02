#!/bin/bash
set -e
source ./sub-scripts/env.sh
source ./sub-scripts/msg.sh

startMsg

copyEnvs

docker build -t nnk:latest ../auth/auth
docker build -t nnk:latest ../migration_module
docker build -t nnk:latest ../notification
docker build -t nnk:latest ../migration_module

docker compose -f docker-compose.prod.yml up -d

endMsg
