#!/bin/bash
set -e
source ./sub-scripts/env.sh
source ./sub-scripts/msg.sh

startMsg

copyEnvs

docker compose -f docker-compose.dev.yml up -d

endMsg
