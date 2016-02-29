PROJECT = "PML Editor"

all: 

install: ; 
	npm install express body-parser passport passport-facebook passport-google-oauth2 jade; \
	$(MAKE) -C pml;

clean: ;
	rm -rf node_modules; \
	$(MAKE) -C pml clean; \
	rm test.pml;

.PHONY: install clean
