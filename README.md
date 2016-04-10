
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
Java is also needed, to install `sudo apt-get install default-jdk`

To install dependencies for the PML Checker, run `sudo apt-get install -y byacc flex`

For testing, Phantom.js is required. To install `sudo npm install -g phantomjs`

To build the project, run `make install` in the project's root directory; this will build the required pml dependences, which can be found under the `/pml` directory along with the external dependencies required by the node server; these will be stored in the `/node_modules` directory.

To uninstall, run `make clean`

### Running the Editor

Firstly, to run the server; execute `nodejs server.js` in a terminal window; it should then inform you that the server is running on port 1337.

To run the editor; open Chrome/Chromium or Firefox and navigate to *localhost:1337*, enter the code in the code editor and select compile. The server will then compile the code and return the output.

## Features

### Basic Editor Interface

##### Uploading Files

To upload a file to the text editor; click on `File` and select `Browse`

![Select File](/Readme Pics/fileSelect1.png)

After the file has been selected, it will be loaded directly into the editor.

![Select File](/Readme Pics/fileOpen.png)

##### Syntax Analysis

Once we have pml code which we wish to evaluate, click on `Run` and select `Compile`:

![Compile Code](/Readme Pics/compile1.png)

As a result we can that our code has been compiled and a syntax analysis has been done; This is shown in the console window below.

![Compilation Output](/Readme Pics/compiled1.png)

##### Saving File Locally

To save files to the local disk, click on `File` > `Save Locally`

![Save Locally](/Readme Pics/localSave.png)

From there, a dialog box will be opened asking for the name of the file.

![Save Local Dialog](/Readme Pics/localSaveDialog.png)
If successful, the web browser should download the file normally

![Save Local Downloaded](/Readme Pics/localSaveDownload.png)

##### Saving Files Remotely

To save files remotely, click on `File` > `Save Remotely`. This requires that the user be authenitcated with an external service (Facebook, Google). 

![File Save](/Readme Pics/remoteSaveMenu.png)

Once filename is entered successfully, an output message appears in the console to inform the user that the filed has been saved successfully. The file also appears on a quick access button on the sidebar

![File Save](/Readme Pics/remoteSaveSidebar.png)

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

![Find](/Readme Pics/ceFind.png)

The output will highlight the both on the screen and the sroll bar

![Find](/Readme Pics/ceFindResult.png)


###### Search & Replace

To search for and replace a sequence of characters in the text editor, press `SHIFT + CTRL + f`; Similar to find the user must enter the sequence of characters their looking to replace; The user then must enter the sequence of characters to take the current sequences place.

![Search & Replace](/Readme Pics/ceFindReplace.png)

###### Jump to Line

To jump to a desired line in the text editor, press `ALT + g`; The user is then prompted to enter the row and column of the position in the text editor they wish to jump to respectively.

![Jump to Line](/Readme Pics/ceJumpLine.png)

###### Replace All

To Replace All in the text editor, press `SHIFT + CTRL + r`. Unlike Search and Replace which is iterative, this function will immediately replace all in the text editor which contain the users input.

![Replace All](/Readme Pics/ceReplaceAll.png)

###### Code Folding

In order to fold code, their must be an arrow beside the row number; Vertical arrow signifies unfolded code, whilst a horizontal arrow signifies folded code.

![Folded Code](/Readme Pics/ceCodeFolding.png)

##### Syntax Highlighting

This is highlighting of keywords that are inputted into the text editor. Keywords such as *process*,*action*,*iteration* and *sequence* are highted in purple.

##### Code Completion

##### Resource Completion

Once a variable or keyword has been used once, it is remebered by the server. Firstly the user presses `CTRL + space`; if there is only one possible word it is automatically entered; otherwise the user is given a choice of words, as seen below.

![Resource Completion](/Readme Pics/ceResourceCompletion.png)

##### Editor Keybinding Emulation

Basic Vim Commands Available -- Refer to http://www.keyxl.com/aaa8263/290/VIM-keyboard-shortcuts.htm <br />

Some execute commands (commands beginning with ':') are not supported.

To change the keybinding, navigate to `Tools` > `Change Key Bindings`

![KeybindingMenu](/Readme Pics/ceKeyBindings.png)

##### Error Highlighting

Firstly, the user tries to compile their code; if their are no errors, the user will receive no prompt from the server; if errors exist, the user is shown where in the text editor that the error has occured along with the error itself.

![Error Highlighting](/Readme Pics/ceErrorHandling.png)

### Diagrams

##### Swim Lanes

To draw a Social Network - a visualization of how actions are divided among agents, click on `Run` > `Draw Swim Lanes`

![DrawSwimLane](/Readme Pics/drawSL.png)

The code will then compile and a new window will be opened showing the swimlane visualization.

##### Social Networks

To draw a Social Network - a visualization of how all nodes are connected together, click on `Run` > `Draw Social Network`

![DrawSocialNetwork](/Readme Pics/drawSN.png)

The code will then compile and a new window will be opened showing the social network visualization.

![SocialNetwork](/Readme Pics/socialNetwork.png)