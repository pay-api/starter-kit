SHELL := bash

.DELETE_ON_ERROR:
.DEFAULT_GOAL := ci

very-clean: clean
	rm -rf dist target node_modules/ package-lock.json
.PHONY: very-clean

clean:
	rm -rf dist target/lint target/test target/build
.PHONY: clean

install: | target/install
target/install:
	npm ci
	mkdir -p $(@D) && touch $@
.PHONY: install

lint: | install target/lint
target/lint:
	npm run lint
	mkdir -p $(@D) && touch $@
.PHONY: lint

build: | install target/build
target/build:
	npm run build
	npm run depcheck
	mkdir -p $(@D) && touch $@
.PHONY: build

# --- ci
ci: | install lint build
.PHONY: ci
