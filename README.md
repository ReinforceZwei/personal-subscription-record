# SSRS - Spending and Subscription Record

A place for your spending records. It doesn't fetch anything from your bank. You input your spending into the app.

The app is mobile first, focusing on record daily spending at instant.

## Deploy

### Pre-built Docker Image

The Docker image is bundled with Pocketbase. 

```bash
docker run -p 8083:80 -d ghcr.io/reinforcezwei/ssrs:latest
```

Docker compose
```yml
version: "3.9"
services:
  ssrs:
    image: ghcr.io/reinforcezwei/ssrs:latest
    container_name: ssrs
    ports:
      - "8083:80"
    volumes:
      - ./data:/pb_data
```

For pre-built image, it is impossible to change the Pocketbase URL (i.e. cannot put frontend and backend in different host). You have to rebuild the image.

### Build Docker Image

With Docker compose
```bash
git clone https://github.com/ReinforceZwei/personal-subscription-record.git
cp .env.example .env
# Edit .env to change VITE_PB_URL, if needed
docker compose build
# or docker only
docker build .
```


## Development

### Stacks

The app is written in React, use Vite for building. [Pocketbase](https://pocketbase.io/) as database, and [Pocketbase JS-SDK](https://github.com/pocketbase/js-sdk) for interacting with the PocketBase API.

### Local Development

Frontend
```bash
git clone https://github.com/ReinforceZwei/personal-subscription-record.git
cd personal-subscription-record
cp .env.example .env.local
npm install
npm run dev
```

To install Pocketbase, please see [Pocketbase offical document](https://pocketbase.io/docs/).

Copy migration files from `personal-subscription-record/pocketbase/migrations` to `pb_migrations` folder next to the Pocketbase binary file.

There is no default login account. Go to Pocketbase admin panel and create one.