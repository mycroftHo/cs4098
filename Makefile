PROJECT = "PML Editor"

all: 

install: ; 
	npm install express body-parser; \
	$(MAKE) -C pml;

clean: ;
	rm -rf node_modules; \
	$(MAKE) -C pml clean;

.PHONY: install clean
