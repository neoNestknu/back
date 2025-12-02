# 🚀 Guide for newcomer:

## 📚 Table of Contents

1. 🏃 **Run**
    - **Unix** — [Go to section](#-for-unix-systems)
        - **Dev**
            - [Script](#-development-mode)
            - [Manual](#-development)
        - **Prod**
            - [Script](#-production-mode)
            - [Manual](#-production)
2. 📖 **See Documentation**
    - [API](#api-documentation)
    - [S3](#s3)

---

## 🐧 For Unix Systems

### 🔧 Development Mode

```bash
cd ./docker
chmod +x ./run-dev.sh
./run-dev.sh
```

### 🏗️ Production Mode

```bash
cd ./docker
chmod +x ./run-prod.sh
./run-prod.sh
```

---

## ⚙️ Manual Run (Alternative Way)

### 🧩 Development

> **Note:** Make sure to add SMTP credentials to `notification/.env`

#### 1. Copy environment files:

```bash
cp ../postgres/example.env ../postgres/.env
cp ../auth/example.env ../auth/.env
cp ../notification/example.env ../notification/.env
cp ../docs/example.env ../docs/.env
cp ../migration_module/example.env ../migration_module/.env
cp ../minio-local/example.env ../minio-local/.env
```

#### 2. Start containers:

```bash
docker compose -f docker-compose.dev.yml up -d
```

---

### 🚢 Production

> **Note:** Make sure to add SMTP credentials to `notification/.env`

#### 1. Copy environment files:

```bash
cp ../postgres/example.env ../postgres/.env
cp ../auth/example.env ../auth/.env
cp ../notification/example.env ../notification/.env
cp ../docs/example.env ../docs/.env
cp ../migration_module/example.env ../migration_module/.env
```

#### 2. Build Docker images:

```bash
docker build -t nnk-auth:latest ../auth
docker build -t nnk-migration:latest ../migration_module
docker build -t nnk-notification:latest ../notification
```

#### 3. Deploy containers:

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

---

## 📘 Documentation

### 📑 API Documentation (Swagger)

To access the Swagger documentation, navigate to:
➡️ [`docs`](docs)

### 🚀 How to Run

1. Start the `nginx` and `docs` services from
   [`docker-compose.dev.yml`](docker/docker-compose.dev.yml)

2. Once the services are running, open in your browser:
   👉 [http://localhost/docs](http://localhost/docs)

### 📄 Alternative

You can also view the Swagger YAML files directly in:
➡️ [`docs/docs`](docs/docs)

---

# S3

## 🗂 MinIO

### ⚙️ Development Mode

> **Note:**
>
> * Make sure to start all required services using [`docker-compose.dev.yml`](#-development-mode)
> * The **WebUI is available directly** (not proxied through Nginx).
> *  The **API is not served through Nginx** in development mode.
> * Already created basic bucket **data**

### 🔗 Access Points

* **API:**
  [http://minio:9000](http://minio:9000)

* **WebUI (Console):**
  - [http://172.21.0.2:9001](http://172.21.0.2:9001)
  - [http://127.0.0.1:9001](http://127.0.0.1:9001)

### ⚙️ Production Mode

> **Note:**
>
> * Work only with cloud S3
---
