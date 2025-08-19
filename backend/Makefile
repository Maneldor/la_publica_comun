# ===================================
# LA PÚBLICA - MAKEFILE
# ===================================

.PHONY: help dev build start stop clean logs shell db-migrate db-seed test lint

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Default target
help: ## Show this help message
	@echo "$(BLUE)La Pública Backend - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
dev: ## Start development environment
	@echo "$(YELLOW)Starting development environment...$(NC)"
	docker-compose up --build

dev-detached: ## Start development environment in background
	@echo "$(YELLOW)Starting development environment in background...$(NC)"
	docker-compose up -d --build

# Production commands
build: ## Build production images
	@echo "$(YELLOW)Building production images...$(NC)"
	docker-compose build --no-cache

start: ## Start production environment
	@echo "$(GREEN)Starting production environment...$(NC)"
	docker-compose up -d

stop: ## Stop all services
	@echo "$(RED)Stopping all services...$(NC)"
	docker-compose down

restart: ## Restart all services
	@echo "$(YELLOW)Restarting all services...$(NC)"
	docker-compose restart

# Monitoring commands
logs: ## Show logs from all services
	docker-compose logs -f

logs-api: ## Show API logs only
	docker-compose logs -f api

logs-worker: ## Show worker logs only
	docker-compose logs -f worker

logs-db: ## Show database logs
	docker-compose logs -f postgres

# Database commands
db-migrate: ## Run database migrations
	@echo "$(YELLOW)Running database migrations...$(NC)"
	docker-compose exec api npx prisma migrate deploy

db-seed: ## Seed database with initial data
	@echo "$(YELLOW)Seeding database...$(NC)"
	docker-compose exec api npm run db:seed

db-reset: ## Reset database (WARNING: This will delete all data)
	@echo "$(RED)WARNING: This will delete all data!$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec api npx prisma migrate reset --force; \
	fi

db-studio: ## Open Prisma Studio
	@echo "$(BLUE)Opening Prisma Studio...$(NC)"
	docker-compose exec api npx prisma studio

# Shell access
shell: ## Access API container shell
	docker-compose exec api sh

shell-db: ## Access database shell
	docker-compose exec postgres psql -U lapublica -d lapublica_db

shell-redis: ## Access Redis shell
	docker-compose exec redis redis-cli

# Maintenance commands
clean: ## Clean up containers, images, and volumes
	@echo "$(RED)Cleaning up Docker resources...$(NC)"
	docker-compose down -v --remove-orphans
	docker system prune -f

clean-all: ## Clean everything including volumes (WARNING: Data loss)
	@echo "$(RED)WARNING: This will delete ALL data including volumes!$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v --remove-orphans; \
		docker system prune -af --volumes; \
	fi

# Testing commands
test: ## Run tests
	@echo "$(YELLOW)Running tests...$(NC)"
	docker-compose exec api npm test

test-watch: ## Run tests in watch mode
	@echo "$(YELLOW)Running tests in watch mode...$(NC)"
	docker-compose exec api npm run test:watch

lint: ## Run linter
	@echo "$(YELLOW)Running linter...$(NC)"
	docker-compose exec api npm run lint

lint-fix: ## Fix linting issues
	@echo "$(YELLOW)Fixing linting issues...$(NC)"
	docker-compose exec api npm run lint:fix

# Backup commands
backup: ## Create database backup
	@echo "$(YELLOW)Creating database backup...$(NC)"
	mkdir -p ./backups
	docker-compose exec postgres pg_dump -U lapublica lapublica_db > "./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql"
	@echo "$(GREEN)Backup created successfully$(NC)"

restore: ## Restore database from backup (requires BACKUP_FILE variable)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)Error: BACKUP_FILE variable is required$(NC)"; \
		echo "$(YELLOW)Usage: make restore BACKUP_FILE=./backups/backup_20240101_120000.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring database from $(BACKUP_FILE)...$(NC)"
	docker-compose exec -T postgres psql -U lapublica lapublica_db < $(BACKUP_FILE)
	@echo "$(GREEN)Database restored successfully$(NC)"

# Status commands
status: ## Show status of all services
	@echo "$(BLUE)Service Status:$(NC)"
	docker-compose ps

health: ## Check health of services
	@echo "$(BLUE)Health Check:$(NC)"
	@curl -s http://localhost:3001/api/v1/health || echo "$(RED)API not responding$(NC)"

# Monitoring with profiles
monitor-start: ## Start monitoring stack (Prometheus + Grafana)
	@echo "$(YELLOW)Starting monitoring stack...$(NC)"
	docker-compose --profile monitoring up -d prometheus grafana

monitor-stop: ## Stop monitoring stack
	@echo "$(RED)Stopping monitoring stack...$(NC)"
	docker-compose stop prometheus grafana

# Quick setup commands
setup: ## Complete setup for new environment
	@echo "$(BLUE)Setting up La Pública Backend...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "$(YELLOW).env file created from template$(NC)"; fi
	@echo "$(YELLOW)Building and starting services...$(NC)"
	docker-compose up -d --build
	@echo "$(YELLOW)Waiting for services to be ready...$(NC)"
	sleep 10
	@echo "$(YELLOW)Running migrations...$(NC)"
	docker-compose exec api npx prisma migrate deploy
	@echo "$(YELLOW)Seeding database...$(NC)"
	docker-compose exec api npm run db:seed
	@echo "$(GREEN)Setup completed! API available at http://localhost:3001$(NC)"

# Development setup
setup-dev: ## Setup for development
	@echo "$(BLUE)Setting up development environment...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "$(YELLOW).env file created$(NC)"; fi
	npm install
	npx prisma generate
	@echo "$(GREEN)Development setup completed!$(NC)"
	@echo "$(YELLOW)Run 'make dev' to start the development server$(NC)"