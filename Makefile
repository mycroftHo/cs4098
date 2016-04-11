PROJECT = "PML Editor"

all: 

install: ; 
	npm install express body-parser passport passport-facebook passport-google-oauth2 jade jsonfile vis; \
	javac -cp .:swimlaneDrawer swimlaneDrawer/SocialDrawer.java; \
	javac -cp .:swimlaneDrawer swimlaneDrawer/SwimlaneDrawer.java; \
	mkdir ~/bin; \
	mv swimlaneDrawer/*.class ~/bin; \
	$(MAKE) -C pml;
	sudo apt-get install python-pip python-dev build-essential
	sudo pip install --upgrade pip
	sudo pip install --upgrade virtualenv


clean: ;
	rm -rf node_modules; \
	rm ~/bin/Agent.class; \
	rm ~/bin/Canvas.class; \
	rm ~/bin/CSVReader.class; \
	rm ~/bin/SwimlaneDrawer.class; \
	rm swimlaneCanvas.html; \
	rm swimData.csv; \
	rm swimlaneCanvas.html; \
	rm *.png \ 
	$(MAKE) -C pml clean;

.PHONY: install clean
