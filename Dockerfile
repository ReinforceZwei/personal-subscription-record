# syntax=docker/dockerfile:1

ARG APP_VERSION=dev
ARG COMMIT=unknown
ARG BUILD_DATE=unknown

# ── Client build ─────────────────────────────────────────────────────────────
# Pinned to a fixed Node version so upstream tag updates don't bust the cache
FROM --platform=$BUILDPLATFORM node:22-alpine AS client-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

COPY . .

# ARG/ENV values that change on every commit must come *after* the dependency
# layer, otherwise they bust the layer cache for `npm ci` on every build.
ARG COMMIT
ENV VITE_COMMIT_HASH=${COMMIT}
RUN npm run build

# ── Server build ─────────────────────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM golang:1.25-alpine AS server-builder

ARG TARGETOS
ARG TARGETARCH

WORKDIR /app/server

COPY server/go.mod server/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY server/ ./

# Version metadata changes on every build; declare it late so the layers
# above stay cacheable.
ARG APP_VERSION
ARG COMMIT
ARG BUILD_DATE

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build \
    -ldflags "-s -w \
              -X main.version=${APP_VERSION} \
              -X main.commit=${COMMIT} \
              -X main.date=${BUILD_DATE}" \
    -o /app/ssrs-server \
    .

# ── Runtime data files (arch-independent, built once natively) ──────────────
FROM --platform=$BUILDPLATFORM alpine:3.21 AS runtime-files

RUN apk add --no-cache ca-certificates tzdata

# ── Final image ──────────────────────────────────────────────────────────────
FROM alpine:3.21

WORKDIR /app

# Copy certs/timezones from the native stage instead of running apk under
# QEMU emulation for every target platform
COPY --from=runtime-files /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=runtime-files /usr/share/zoneinfo /usr/share/zoneinfo

COPY --from=server-builder /app/ssrs-server ./server
COPY --from=client-builder /app/dist ./pb_public

VOLUME /pb_data

# Overridable at runtime, e.g. -e PB_PORT=8090
ENV PB_PORT=80
EXPOSE 80

ENTRYPOINT ["/bin/sh", "-c", "exec /app/server serve --http=0.0.0.0:${PB_PORT} --dir=/pb_data"]
