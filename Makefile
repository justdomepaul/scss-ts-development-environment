# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
all: help
.PHONY: all

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

build-client: ## build client server
	npm install
	npm install -g webpack webpack-cli
	webpack --mode development

build-caddy: ## build caddy image
	docker build -f ./env/DockerfileCaddy --tag builder-caddy:v0.0.0 --rm .

clena: ## clean
	docker rmi builder-caddy:v0.0.0

up: build-caddy ## up system
	docker-compose -f ./env/docker-compose.yaml up -d node
	docker-compose -f ./env/docker-compose.yaml up -d caddy

rebuild: ## rebuild
	webpack --mode development
	docker-compose -f ./env/docker-compose.yaml restart caddy

down: ## down system
	docker-compose -f ./env/docker-compose.yaml down
