#!/bin/bash

copyEnvs() {
  cp ../postgres/example.env ../postgres/.env
  cp ../auth/example.env ../auth/.env
  cp ../notification/example.env ../notification/.env
  cp ../docs/example.env ../docs/.env
  cp ../migration_module/example.env ../migration_module/.env
  cp ../minio-local/example.env ../minio-local/.env
  cp ../user/example.env ../user/.env
}
