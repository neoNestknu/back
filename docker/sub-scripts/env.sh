#!/bin/bash

copyEnvs() {
  cp ../postgres/example.env ../postgres/.env
  cp ../auth/example.env ../auth/.env
}
