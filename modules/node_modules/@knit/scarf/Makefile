PROJECT = "BuildJS"

export FDT_DIR ?= .
PATH  := $(FDT_DIR)/node_modules/.bin:$(PATH)
SHELL := /bin/bash

ifndef VERBOSE
	Q := @
	NIL := > /dev/null 2>&1
endif

NO_COLOR=\033[0m
OK_COLOR=\033[32;01m
OK_STRING=$(OK_COLOR)[OK]$(NO_COLOR)
AWK_CMD = awk '{ printf "%-30s %-10s\n",$$1, $$2; }'
PRINT_OK = printf "$@ $(OK_STRING)\n" | $(AWK_CMD)
NODE_ENV_STRING = $(OK_COLOR)[$(NODE_ENV)]$(NO_COLOR)
PRINT_ENV = printf "$@ $(NODE_ENV_STRING)\n" | $(AWK_CMD)


all: install lint test-once build
.PHONY: all

.PHONY: server-stage
server-stage: export NODE_ENV=stage
server-stage: export BABEL_ENV=production
server-stage: build docker-build docker-run

.PHONY: server-prod
server-prod: export NODE_ENV=production
server-prod: build docker-build docker-run

.PHONY: server
server: export NODE_ENV=development
server:
	$(Q) node ${FDT_DIR}-dev-server

.PHONY: schema
schema:
	$(Q) node ${FDT_DIR}/bin/updateRelaySchema

.PHONY: install
install:
	$(Q) npm install --loglevel error
	@$(PRINT_OK)

.PHONY: build
build: export NODE_ENV?=stage
build: export BABEL_ENV=production
build: clean-dist
	@$(PRINT_ENV)
	$(Q) webpack --config ${FDT_DIR}-scripts/bin/webpack.config.js
	@$(PRINT_OK)

.PHONY: build-umd
build-umd: export NODE_ENV?=stage
build-umd: export BABEL_ENV=production
build-umd: clean-dist
	@$(PRINT_ENV)
	$(Q) webpack --config ${FDT_DIR}-scripts/bin/webpack.lib.config.js
	@$(PRINT_OK)

.PHONY: test-watch
test-watch: export TEST_ENV=watch
test-watch: test

.PHONY: test-ci
test-ci: export TEST_ENV=ci
test-ci: test

.PHONY: test-once
test-once: export TEST_ENV=single
test-once: test

.PHONY: test
test: export BABEL_ENV=test
test: export NODE_ENV=development
test:
	$(Q) node ${FDT_DIR}-scripts/bin/runTests
	@$(PRINT_OK)

.PHONY: lint
lint:
	$(Q) eslint packages --ext .js,.jsx
	@$(PRINT_OK)

.PHONY: flow
flow:
	$(Q) flow check

.PHONY: clean
clean: clean-dist clean-lerna clean-npm
	@$(PRINT_OK)

.PHONY: clean-lerna
clean-lerna:
	$(Q) lerna clean --yes
	@$(PRINT_OK)

.PHONY: clean-npm
clean-npm:
	$(Q) rm -rf node_modules
	@$(PRINT_OK)

.PHONY: clean-dist
clean-dist:
	$(Q) rm -rf dist
	@$(PRINT_OK)

.PHONY: update
update:
	$(Q) npm-check --skip-unused
	@$(PRINT_OK)

.PHONY: upgrade
upgrade:
	$(Q) npm-check -u
	@$(PRINT_OK)

safetag = $(subst /,-,${1})
dockertag = docker tag ${DOCKER_IMAGE} quay.io/ncigdc/${DOCKER_IMAGE}:$(call safetag,${1})
dockerpush = docker push quay.io/ncigdc/${DOCKER_IMAGE}:$(call safetag,${1})
dockerbuild = docker build -t ${DOCKER_IMAGE} .
dockerlogin = docker login -e=${DOCKER_EMAIL} -u=${DOCKER_USERNAME} -p=${DOCKER_PASSWORD} quay.io
define dockerupload
	$(call dockertag,${1})
	$(call dockerpush,${1})
endef

.PHONY: docker-build
docker-build:
	$(Q) $(call dockerbuild)
	@$(PRINT_OK)

.PHONY: docker-run
docker-run:
	$(Q) docker run -p 8080:80 ${DOCKER_IMAGE}
	@$(PRINT_OK)

.PHONY: travis-before-script
travis-before-script:
	NODE_ENV=production $(MAKE) build

.PHONY: travis-script
travis-script: lint test-ci

.PHONY: travis-after-success
travis-after-success:
	bash <(curl -s https://codecov.io/bash)

.PHONY: travis-docker-upload
travis-docker-upload:
ifdef DOCKER_IMAGE
	$(call dockerlogin)
	$(call dockerbuild)
ifeq ($(TRAVIS_PULL_REQUEST), false)
ifeq ($(TRAVIS_BRANCH), master)
	$(call dockerupload,stable)
else ifeq ($(TRAVIS_BRANCH), develop)
	$(call dockerupload,latest)
else
	$(call dockerupload,${TRAVIS_BRANCH})
endif
ifdef TRAVIS_TAG
	$(call dockerupload,${TRAVIS_TAG})
endif
endif
endif

.PHONY: preflight
preflight:
	$(Q) node ${FDT_DIR}-scripts/bin/release/preflight

.PHONY: version
version:
	$(Q) node ${FDT_DIR}-scripts/bin/release/version

.PHONY: changelog
changelog:
	$(Q) node ${FDT_DIR}-scripts/bin/release/changelog

.PHONY: tag
tag:
	$(Q) node ${FDT_DIR}-scripts/bin/release/tag

.PHONY: publish
publish:
	$(Q) node ${FDT_DIR}-scripts/bin/release/publish

.PHONY: release
release: export NODE_ENV?=production
release: export RELEASE=1
release:
	$(Q) node ${FDT_DIR}-scripts/bin/release/release
