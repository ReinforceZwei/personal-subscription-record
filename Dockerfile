FROM node:lts AS builder

WORKDIR /app
COPY . .

RUN npm ci && npm run build


FROM spectado/pocketbase:latest

COPY --from=builder /app/dist/ /pb_public
COPY --from=builder /app/pocketbase/migrations/ /pb_migrations

ENTRYPOINT ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:80", "--dir=/pb_data", "--publicDir=/pb_public", "--migrationsDir=/pb_migrations"]