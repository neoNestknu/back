#!/bin/bash
set -e
source ./sub-scripts/env.sh
source ./sub-scripts/msg.sh

startMsg

copyEnvs

docker build -t pi-knu-auth:latest ../auth/auth

docker build -t pi-knu-migration:latest ../migration-module

docker compose -f docker-compose.prod.yml up -d

endMsg
