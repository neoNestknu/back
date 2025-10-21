# How to run Docker containers

## If you have unix:

### Dev:
```bash
$ chmod +x ./docker/run-dev.sh
$ ./docker/run-dev.sh
```

### Prod:
```bash
$ chmod +x ./docker/run-prod.sh
$ ./docker/run-prod.sh
```

## Or run
### Dev:
```bash
$ cp ../postgres/example.env ../postgres/.env

$ docker compose -f docker-compose.dev.yml up -d
```

### Prod:
```bash
$ cp ../postgres/example.env ../postgres/.env

$ docker compose -f docker-compose.prod.yml up -d
```
