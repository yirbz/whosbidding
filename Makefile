# WhosBidding — Developer Automation Makefile

AURA_ARENA_DIR := /home/yvniel/Projects/web/aura-arena

.PHONY: help dev build start test test-watch docker-up docker-down docker-logs db-push db-reset db-stop clean

# Default target
.DEFAULT_GOAL := help

help: ## Show this help menu
	@echo "WhosBidding Developer Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start local Next.js development server
	npm run dev

build: ## Build standalone Next.js production bundle
	npm run build

start: ## Start production server from standalone bundle
	npm run start

test: ## Run unit and integration test suite once
	npx vitest run

test-watch: ## Run test suite in watch mode
	npx vitest

docker-up: ## Build and start ALL projects (whosbidding + aura-arena)
	@echo "\033[1;34m▶ Starting whosbidding...\033[0m"
	docker compose up --build -d
	@echo "\033[1;34m▶ Starting aura-arena...\033[0m"
	docker compose -f $(AURA_ARENA_DIR)/docker-compose.yml up --build -d
	@echo "\033[1;32m✔ All services are up.\033[0m"

docker-down: ## Stop ALL projects (whosbidding + aura-arena)
	@echo "\033[1;34m▶ Stopping whosbidding...\033[0m"
	docker compose down
	@echo "\033[1;34m▶ Stopping aura-arena...\033[0m"
	docker compose -f $(AURA_ARENA_DIR)/docker-compose.yml down
	@echo "\033[1;32m✔ All services stopped.\033[0m"

docker-logs: ## Tail logs from ALL projects
	@echo "\033[1;34m[whosbidding logs]\033[0m"
	docker compose logs -f &
	@echo "\033[1;34m[aura-arena logs]\033[0m"
	docker compose -f $(AURA_ARENA_DIR)/docker-compose.yml logs -f

db-push: ## Apply database migrations via Supabase CLI
	npx supabase db push

db-reset: ## Reset local database and re-apply all migrations
	npx supabase db reset

db-stop: ## Shut down local Supabase infrastructure
	npx supabase stop

clean: ## Clean build artifacts and dependencies
	rm -rf .next node_modules coverage
