#!/bin/bash
echo "** Started creating default DB and users"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- Create extensions
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE USER $POSTGRES_APP_USER WITH PASSWORD '$POSTGRES_APP_PASSWORD';

  grant usage on schema public to "$POSTGRES_APP_USER";
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, SELECT, UPDATE ON TABLES TO "$POSTGRES_APP_USER";

  SET search_path TO public;
EOSQL

echo "** Finished creating default DB and users"
