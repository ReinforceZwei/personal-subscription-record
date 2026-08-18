# syntax=docker/dockerfile:1

ARG APP_VERSION=dev
ARG COMMIT=unknown
ARG BUILD_DATE=unknown

# ── Client build ─────────────────────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM node:lts AS client-builder

ARG COMMIT
ENV VITE_COMMIT_HASH=${COMMIT}

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Server build ─────────────────────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM golang:1.25-alpine AS server-builder

ARG APP_VERSION
ARG COMMIT
ARG BUILD_DATE
ARG TARGETOS
ARG TARGETARCH

WORKDIR /app/server

COPY server/go.mod server/go.sum ./
RUN go mod download

COPY server/ ./

RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build \
    -ldflags "-s -w \
              -X main.version=${APP_VERSION} \
              -X main.commit=${COMMIT} \
              -X main.date=${BUILD_DATE}" \
    -o /app/ssrs-server \
    .

# ── Final image ──────────────────────────────────────────────────────────────
FROM alpine:3.21

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=server-builder /app/ssrs-server ./server
COPY --from=client-builder /app/dist ./pb_public

VOLUME /app/pb_data

# Overridable at runtime, e.g. -e PB_PORT=8090
ENV PB_PORT=80
EXPOSE 80

ENTRYPOINT ["/bin/sh", "-c", "exec /app/server serve --http=0.0.0.0:${PB_PORT} --dir=/pb_data --publicDir=/pb_public"]
