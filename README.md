
# CS4098 - Group Design Project

###Acknowledgements

Implements features from CodeMirror (https://codemirror.net/)

### Build Instructions

This project requires node.js (https://nodejs.org/) and Java to function; to install node.js and Java, run the following commands:

```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm install -g npm
sudo apt-get install default-jdk
```

To install dependencies for the PML Checker, run `sudo apt-get install -y byacc flex`

To build the project, run `make install` in the project's root directory; this will build the required pml dependences, which can be found under the `/pml` directory along with the external dependencies required by the node server; these will be stored in the `/node_modules` directory.

To uninstall, run `make clean`

### Running the Editor

Firstly, to run the server; execute `nodejs server.js` in a terminal window; it should then inform you that the server is running on port 1337.

To run the editor; open Chrome/Chromium or Firefox and navigate to *localhost:1337*, enter the code in the code editor and select compile. The server will then compile the code and return the output.

## Features

### Basic Editor Interface

##### Uploading Files

To upload a file to the text editor; click on `Choose File`; once you have selected your desired file click `open`.

![Select File](/Readme Pics/fileSelect.png)

Once you have selected a file, you need to load it into the text editor; this is done by clicking on `Load selected file`.

![Select File](/Readme Pics/loaded.png)

##### Syntax Analysis

Once we have pml code which we wish to evaluate, click on `Compile`;

![Compile Code](/Readme Pics/compile.png)

As a result we can that our code has been compiled and a syntax analysis has been done; This is shown in the output box below.

![Compilation Output](/Readme Pics/compiled.png)

##### Saving Files

Firstly, when we want to save the contents of the text editor we click `Save`; We are then prompted to enter a name for our file; Once happy, click `Ok`.

![File Save](/Readme Pics/fileSave.png)

Once filename is entered successfully, an output message appears to inform the user that the filed has been saved successfully.

![File Save](/Readme Pics/isSaved.png)

##### Authentication

Firstly, in order for a user to authenticate theirself to the server they must have either a facebook or google account; The user then should select their log-in of choice as seen below;

![Homepage](/Readme Pics/homepage.png)

For Facebook, the user is redirected to the facebook login screen where email and password must be entered.

![Facebook Login](/Readme Pics/fbLogin.png)

For Google, the user is redirected to the google login screen when again email and password must be entered.

![Google Login](/Readme Pics/googleLogin.png)

In addition, with google the user must allow for the app permissions before being redirected to the main *pml editor* screen.

![File Save](/Readme Pics/permissions.png)

##### Code Editor

###### Find

To find a specific sequence of characters in the text editor, press `CTRL + f`; The user then should enter the sequence of characters their looking for.

![Find](/Readme Pics/find.png)

###### Search & Replace

To search for and replace a sequence of characters in the text editor, press `SHIFT + CTRL + f`; Similar to find the user must enter the sequence of characters their looking to replace; The user then must enter the sequence of characters to take the current sequences place.

![Search & Replace](/Readme Pics/replace.png)

###### Jump to Line

To jump to a desired line in the text editor, press `ALT + g`; The user is then prompted to enter the row and column of the position in the text editor they wish to jump to respectively.

![Jump to Line](/Readme Pics/jumpLine.png)

###### Replace All

To Replace All in the text editor, press `SHIFT + CTRL + r`. Unlike Search and Replace which is iterative, this function will immediately replace all in the text editor which contain the users input.

![Replace All](/Readme Pics/replaceAll.png)

###### Code Folding

In order to fold code, their must be an arrow beside the row number; Vertical arrow signifies unfolded code, whilst a horizontal arrow signifies folded code.

![Folded Code](/Readme Pics/folded.png)

##### Syntax Highlighting

This is highlighting of keywords that are inputted into the text editor. Keywords such as *process*,*action*,*iteration* and *sequence* are highted in purple.

##### Code Completion

##### Resource Completion

Once a variable or keyword has been used once, it is remebered by the server. Firstly the user presses `CTRL + space`; if there is only one possible word it is automatically entered; otherwise the user is given a choice of words, as seen below.

![Resource Completion](/Readme Pics/resourceComp.png)

##### Editor Keybinding Emulation

Basic Vim Commands Available -- Refer to http://www.keyxl.com/aaa8263/290/VIM-keyboard-shortcuts.htm <br />

Some execute commands (commands beginning with ':') are not supported.
##### Error Highlighting

Firstly, the user tries to compile their code; if their are no errors, the user will receive no prompt from the server; if errors exist, the user is shown where in the text editor that the error has occured along with the error itself.

![Error Highlighting](/Readme Pics/folded.png)

### Graphical Designer

##### TODO

### Diagrams

##### TODO

### Analysis

##### TODO
