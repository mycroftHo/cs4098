
# CS4098 - Group Design Project

###Acknowledgements

Implements features from CodeMirror (https://codemirror.net/)

### Build Instructions

This project requires node.js (https://nodejs.org/) to function; to install node.js, run the following commands:

```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm install -g npm
```

To install dependencies for the PML Checker, run `sudo apt-get install -y byacc flex`

To build the project, run `make install` in the project's root directory; this will build the required pml dependences, which can be found under the `/pml` directory along with the external dependencies required by the node server; these will be stored in the `/node_modules` directory.

To uninstall, run `make clean`

### Running the Editor

Firstly, the run the server; execute `nodejs server.js` in a terminal window; it should then inform you that the server is running on port 6500.

To run the editor; open Chrome/Chromium or Firefox and navigate to *localhost:6500/pmledit.html*, enter the code in the code editor and select compile. The server will then compile the code and return the output.
