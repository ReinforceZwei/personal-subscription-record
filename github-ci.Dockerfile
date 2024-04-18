# Skip building inside docker, use Github CI to build
FROM spectado/pocketbase:latest

WORKDIR ./dist
COPY . /pb_public
WORKDIR ./pocketbase
COPY . /pb_migrations

ENTRYPOINT ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:80", "--dir=/pb_data", "--publicDir=/pb_public", "--migrationsDir=/pb_migrations"]