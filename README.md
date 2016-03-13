
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

Basic Vim Commands Available:

{ keys: '<Left>'->'keyToKey', toKeys: 'h' },
{ keys: '<Right>'->'keyToKey', toKeys: 'l' },
{ keys: '<Up>'->'keyToKey', toKeys: 'k' },
{ keys: '<Down>'->'keyToKey', toKeys: 'j' },
{ keys: '<Space>'->'keyToKey', toKeys: 'l' },
{ keys: '<BS>'->'keyToKey', toKeys: 'h', context: 'normal'},
{ keys: '<C-Space>'->'keyToKey', toKeys: 'W' },
{ keys: '<C-BS>'->'keyToKey', toKeys: 'B', context: 'normal' },
{ keys: '<S-Space>'->'keyToKey', toKeys: 'w' },
{ keys: '<S-BS>'->'keyToKey', toKeys: 'b', context: 'normal' },
{ keys: '<C-n>'->'keyToKey', toKeys: 'j' },
{ keys: '<C-p>'->'keyToKey', toKeys: 'k' },
{ keys: '<C-[>'->'keyToKey', toKeys: '<Esc>' },
{ keys: '<C-c>'->'keyToKey', toKeys: '<Esc>' },
{ keys: '<C-[>'->'keyToKey', toKeys: '<Esc>', context: 'insert' },
{ keys: '<C-c>'->'keyToKey', toKeys: '<Esc>', context: 'insert' },
{ keys: 's'->'keyToKey', toKeys: 'cl', context: 'normal' },
{ keys: 's'->'keyToKey', toKeys: 'xi', context: 'visual'},
{ keys: 'S'->'keyToKey', toKeys: 'cc', context: 'normal' },
{ keys: 'S'->'keyToKey', toKeys: 'dcc', context: 'visual' },
{ keys: '<Home>'->'keyToKey', toKeys: '0' },
{ keys: '<End>'->'keyToKey', toKeys: '$' },
{ keys: '<PageUp>'->'keyToKey', toKeys: '<C-b>' },
{ keys: '<PageDown>'->'keyToKey', toKeys: '<C-f>' },
{ keys: '<CR>'->'keyToKey', toKeys: 'j^', context: 'normal' },
-- Motions
keys: 'H'->moveToTopLine',
keys: 'M'->'moveToMiddleLine', motionArgs: { linewise: true, toJumplist: true }},
{ keys: 'L'-'moveToBottomLine', motionArgs: { linewise: true, toJumplist: true }},
{ keys: 'h'->'moveByCharacters', motionArgs: { forward: false }},
{ keys: 'l'->'moveByCharacters', motionArgs: { forward: true }},
{ keys: 'j'->'moveByLines', motionArgs: { forward: true, linewise: true }},
{ keys: 'k'->'moveByLines', motionArgs: { forward: false, linewise: true }},
{ keys: 'gj'->'moveByDisplayLines', motionArgs: { forward: true }},
{ keys: 'gk'->'moveByDisplayLines', motionArgs: { forward: false }},
{ keys: 'w'->'moveByWords', motionArgs: { forward: true, wordEnd: false }},
{ keys: 'W'->'moveByWords', motionArgs: { forward: true, wordEnd: false, bigWord: true }},
{ keys: 'e'->'moveByWords', motionArgs: { forward: true, wordEnd: true, inclusive: true }},
{ keys: 'E'->'moveByWords', motionArgs: { forward: true, wordEnd: true, bigWord: true, inclusive: true }},
{ keys: 'b'->'moveByWords', motionArgs: { forward: false, wordEnd: false }},
{ keys: 'B'->'moveByWords', motionArgs: { forward: false, wordEnd: false, bigWord: true }},
{ keys: 'ge'->'moveByWords', motionArgs: { forward: false, wordEnd: true, inclusive: true }},
{ keys: 'gE'->'moveByWords', motionArgs: { forward: false, wordEnd: true, bigWord: true, inclusive: true }},
{ keys: '{'->'moveByParagraph', motionArgs: { forward: false, toJumplist: true }},
{ keys: '}'->'moveByParagraph', motionArgs: { forward: true, toJumplist: true }},
{ keys: '<C-f>'->'moveByPage', motionArgs: { forward: true }},
{ keys: '<C-b>'->'moveByPage', motionArgs: { forward: false }},
{ keys: '<C-d>'->'moveByScroll', motionArgs: { forward: true, explicitRepeat: true }},
{ keys: '<C-u>'->'moveByScroll', motionArgs: { forward: false, explicitRepeat: true }},
{ keys: 'gg'->'moveToLineOrEdgeOfDocument', motionArgs: { forward: false, explicitRepeat: true, linewise: true, toJumplist: true }},
{ keys: 'G'->'moveToLineOrEdgeOfDocument', motionArgs: { forward: true, explicitRepeat: true, linewise: true, toJumplist: true }},
{ keys: '0'->'moveToStartOfLine' },
{ keys: '^'->'moveToFirstNonWhiteSpaceCharacter' },
{ keys: '+'->'moveByLines', motionArgs: { forward: true, toFirstChar:true }},
{ keys: '-'->'moveByLines', motionArgs: { forward: false, toFirstChar:true }},
{ keys: '_'->'moveByLines', motionArgs: { forward: true, toFirstChar:true, repeatOffset:-1 }},
{ keys: '$'->'moveToEol', motionArgs: { inclusive: true }},
{ keys: '%'->'moveToMatchedSymbol', motionArgs: { inclusive: true, toJumplist: true }},
{ keys: 'f<character>'->'moveToCharacter', motionArgs: { forward: true , inclusive: true }},
{ keys: 'F<character>'->'moveToCharacter', motionArgs: { forward: false }},
{ keys: 't<character>'->'moveTillCharacter', motionArgs: { forward: true, inclusive: true }},
{ keys: 'T<character>'->'moveTillCharacter', motionArgs: { forward: false }},
{ keys: ';'->'repeatLastCharacterSearch', motionArgs: { forward: true }},
{ keys: ','->'repeatLastCharacterSearch', motionArgs: { forward: false }},
{ keys: '\'<character>'->'goToMark', motionArgs: {toJumplist: true, linewise: true}},
{ keys: '`<character>'->'goToMark', motionArgs: {toJumplist: true}},
{ keys: ']`'->'jumpToMark', motionArgs: { forward: true } },
{ keys: '[`'->'jumpToMark', motionArgs: { forward: false } },
{ keys: ']\''->'jumpToMark', motionArgs: { forward: true, linewise: true } },
{ keys: '[\''->'jumpToMark', motionArgs: { forward: false, linewise: true } },
// the next two aren't motions but must come before more general motion declarations
{ keys: ']p'->'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true, matchIndent: true}},
{ keys: '[p'->'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true, matchIndent: true}},
{ keys: ']<character>'->'moveToSymbol', motionArgs: { forward: true, toJumplist: true}},
{ keys: '[<character>'->'moveToSymbol', motionArgs: { forward: false, toJumplist: true}},
{ keys: '|'->'moveToColumn'},
{ keys: 'o'->'moveToOtherHighlightedEnd', context:'visual'},
{ keys: 'O'->'moveToOtherHighlightedEnd', motionArgs: {sameLine: true}, context:'visual'},
// Operators
{ keys: 'd'->'operator', operator: 'delete' },
{ keys: 'y'->'operator', operator: 'yank' },
{ keys: 'c'->'operator', operator: 'change' },
{ keys: '>'->'operator', operator: 'indent', operatorArgs: { indentRight: true }},
{ keys: '<'->'operator', operator: 'indent', operatorArgs: { indentRight: false }},
{ keys: 'g~'->'operator', operator: 'changeCase' },
{ keys: 'gu'->'operator', operator: 'changeCase', operatorArgs: {toLower: true}, isEdit: true },
{ keys: 'gU'->'operator', operator: 'changeCase', operatorArgs: {toLower: false}, isEdit: true },
{ keys: 'n'->'findNext', motionArgs: { forward: true, toJumplist: true }},
{ keys: 'N'->'findNext', motionArgs: { forward: false, toJumplist: true }},
// Operator-Motion dual commands
{ keys: 'x'->'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorMotionArgs: { visualLine: false }},
{ keys: 'X'->'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: false }, operatorMotionArgs: { visualLine: true }},
{ keys: 'D'->'operatorMotion', operator: 'delete', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
{ keys: 'D'->'operator', operator: 'delete', operatorArgs: { linewise: true }, context: 'visual'},
{ keys: 'Y'->'operatorMotion', operator: 'yank', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
{ keys: 'Y'->'operator', operator: 'yank', operatorArgs: { linewise: true }, context: 'visual'},
{ keys: 'C'->'operatorMotion', operator: 'change', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
{ keys: 'C'->'operator', operator: 'change', operatorArgs: { linewise: true }, context: 'visual'},
{ keys: '~'->'operatorMotion', operator: 'changeCase', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorArgs: { shouldMoveCursor: true }, context: 'normal'},
{ keys: '~'->'operator', operator: 'changeCase', context: 'visual'},
{ keys: '<C-w>'->'operatorMotion', operator: 'delete', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }, context: 'insert' },
// Actions
{ keys: '<C-i>'->'action', action: 'jumpListWalk', actionArgs: { forward: true }},
{ keys: '<C-o>'->'action', action: 'jumpListWalk', actionArgs: { forward: false }},
{ keys: '<C-e>'->'action', action: 'scroll', actionArgs: { forward: true, linewise: true }},
{ keys: '<C-y>'->'action', action: 'scroll', actionArgs: { forward: false, linewise: true }},
{ keys: 'a'->'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'charAfter' }, context: 'normal' },
{ keys: 'A'->'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'eol' }, context: 'normal' },
{ keys: 'A'->'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'endOfSelectedArea' }, context: 'visual' },
{ keys: 'i'->'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'inplace' }, context: 'normal' },
{ keys: 'I'->'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'firstNonBlank'}, context: 'normal' },
{ keys: 'I'->'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'startOfSelectedArea' }, context: 'visual' },
{ keys: 'o'->'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: true }, context: 'normal' },
{ keys: 'O'->'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: false }, context: 'normal' },
{ keys: 'v'->'action', action: 'toggleVisualMode' },
{ keys: 'V'->'action', action: 'toggleVisualMode', actionArgs: { linewise: true }},
{ keys: '<C-v>'->'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
{ keys: '<C-q>'->'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
{ keys: 'gv'->'action', action: 'reselectLastSelection' },
{ keys: 'J'->'action', action: 'joinLines', isEdit: true },
{ keys: 'p'->'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true }},
{ keys: 'P'->'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true }},
{ keys: 'r<character>'->'action', action: 'replace', isEdit: true },
{ keys: '@<character>'->'action', action: 'replayMacro' },
{ keys: 'q<character>'->'action', action: 'enterMacroRecordMode' },
// Handle Replace-mode as a special case of insert mode.
{ keys: 'R'->'action', action: 'enterInsertMode', isEdit: true, actionArgs: { replace: true }},
{ keys: 'u'->'action', action: 'undo', context: 'normal' },
{ keys: 'u'->'operator', operator: 'changeCase', operatorArgs: {toLower: true}, context: 'visual', isEdit: true },
{ keys: 'U'->'operator', operator: 'changeCase', operatorArgs: {toLower: false}, context: 'visual', isEdit: true },
{ keys: '<C-r>'->'action', action: 'redo' },
{ keys: 'm<character>'->'action', action: 'setMark' },
{ keys: '"<character>'->'action', action: 'setRegister' },
{ keys: 'zz'->'action', action: 'scrollToCursor', actionArgs: { position: 'center' }},
{ keys: 'z.'->'action', action: 'scrollToCursor', actionArgs: { position: 'center' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
{ keys: 'zt'->'action', action: 'scrollToCursor', actionArgs: { position: 'top' }},
{ keys: 'z<CR>'->'action', action: 'scrollToCursor', actionArgs: { position: 'top' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
{ keys: 'z-'->'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }},
{ keys: 'zb'->'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
{ keys: '.'->'action', action: 'repeatLastEdit' },
{ keys: '<C-a>'->'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: true, backtrack: false}},
{ keys: '<C-x>'->'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: false, backtrack: false}},
// Text object motions
{ keys: 'a<character>'->'textObjectManipulation' },
{ keys: 'i<character>'->'textObjectManipulation', motionArgs: { textObjectInner: true }},
// Search
{ keys: '/'->'search', searchArgs: { forward: true, querySrc: 'prompt', toJumplist: true }},
{ keys: '?'->'search', searchArgs: { forward: false, querySrc: 'prompt', toJumplist: true }},
{ keys: '*'->'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
{ keys: '#'->'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
{ keys: 'g*'->'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', toJumplist: true }},
{ keys: 'g#'->'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', toJumplist: true }},
// Ex command
keys: ':'->'ex'

##### Error Highlighting

Firstly, the user tries to compile their code; if their are no errors, the user will receive no prompt from the server; if errors exist, the user is shown where in the text editor that the error has occured along with the error itself.

![Error Highlighting](/Readme Pics/folded.png)

### Graphical Designer

##### TODO

### Diagrams

##### TODO

### Analysis

##### TODO
