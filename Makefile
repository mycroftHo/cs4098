PROJECT = "PML Editor"

all: 

install: ; 
	npm install express body-parser passport passport-facebook passport-google-oauth2 jade jsonfile; \
	javac -cp .:swimlaneDrawer swimlaneDrawer/SwimlaneDrawer.java; \
	mkdir ~/bin; \
	mv swimlaneDrawer/*.class ~/bin; \
	$(MAKE) -C pml;

clean: ;
	rm -rf node_modules; \
	rm ~/bin/Agent.class; \
	rm ~/bin/Canvas.class; \
	rm ~/bin/CSVReader.class; \
	rm ~/bin/SwimlaneDrawer.class; \
	$(MAKE) -C pml clean;

.PHONY: install clean
