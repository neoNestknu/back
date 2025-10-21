FROM python:3.11-slim

RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir psycopg2-binary alembic

COPY . .

ENTRYPOINT ["python", "migrate.py"]
CMD ["up"]