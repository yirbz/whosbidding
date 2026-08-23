# WhosBidding — Justfile Task Runner Configuration

# List all available recipes
default:
    @just --list

# Start local Next.js development server
dev:
    npm run dev

# Build standalone Next.js production bundle
build:
    npm run build

# Start production server from standalone bundle
start:
    npm run start

# Run unit and integration test suite once
test:
    npx vitest run

# Run test suite in watch mode
test-watch:
    npx vitest

# Build and start all services via Docker Compose
docker-up:
    docker compose up --build -d

# Stop and remove all Docker Compose containers
docker-down:
    docker compose down

# Tail logs from all Docker Compose services
docker-logs:
    docker compose logs -f

# Apply database migrations via Supabase CLI
db-push:
    npx supabase db push

# Reset local database and re-apply all migrations
db-reset:
    npx supabase db reset

# Clean build artifacts and dependencies
clean:
    rm -rf .next node_modules coverage
