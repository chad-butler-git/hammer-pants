.PHONY: up build down logs

up:   ## Build & start app using docker compose
	docker compose -f grocery-infra/docker-compose.yml up --build -d

build: ## Build images
	docker compose -f grocery-infra/docker-compose.yml build

down: ## Stop containers
	docker compose -f grocery-infra/docker-compose.yml down

logs: ## Tail logs
	docker compose -f grocery-infra/docker-compose.yml logs -f