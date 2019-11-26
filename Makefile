SHELL:=/bin/bash
BASEDIR=$(CURDIR)
OUTPUTDIR=public

.PHONY: all
all: clean get_repository build deploy

.PHONY: clean
clean:
	@echo "Removing public directory"
	rm -rf $(BASEDIR)/$(OUTPUTDIR)

.PHONY: get_repository
get_repository:
	@echo "Getting public repository"
	git clone https://github.com/gh-username/gh-username.github.io.git public

.PHONY: build
build:
	@echo "Generating site"
	hugo --gc --minify

.PHONY: deploy
deploy:
	@echo "Preparing commit"
	@cd $(OUTPUTDIR) \
	&& git config user.email "you@youremail.com" \
	&& git config user.name "Your Name" \
	&& git add . \
	&& git status \
	&& git commit -m "Deploy via Makefile" \
	&& git push -f -q https://$(GITHUB_TOKEN)@github.com/gh-username/gh-username.github.io.git master

	@echo "Pushed to remote"
