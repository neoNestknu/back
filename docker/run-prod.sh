#!/bin/bash
set -e
source ./sub-scripts/env.sh
source ./sub-scripts/msg.sh

startMsg

copyEnvs

docker build -t pi-knu-auth:latest ../auth

docker compose -f docker-compose.prod.yml up -d

endMsg
