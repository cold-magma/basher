const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const specialKeys = [
    8, 9, 13, 16, 16, 17, 17, 18, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 44, 45, 46, 112, 113, 114, 115, 116,
    117, 118, 119, 120, 121, 122, 123, 144, 145, 173, 174, 175, 181, 182, 183,
];
const supportedCommands = [
    "basher reset",
    "clear",
    "cat",
    "cd",
    "date",
    "echo",
    "grep",
    "ls",
    "mkdir",
    "pwd",
    "rmdir",
    "touch",
    "vi",
];

var workingDirectory = "/home/basher";
//vim props
var isInsertMode = false;
var vimFileName = "";
var vimStatus = "";

function handleTextInput(event) {
    event.preventDefault();
    parseExpression(event.target.stdin.value);
    event.target.stdin.value = "";
}

function parseExpression(stdin) {
    var processedOutputString = "basher@hello_world > " + stdin + "<br/>";
    var expression = [];
    for (let i = 0; i < stdin.length; i++) {
        expression.push(stdin[i]);
    }
    if (expression.length == 0) {
        document.getElementById("terminal").innerHTML += processedOutputString;
        return;
    }
    console.log(stdin)
    processedOutputString += evaluateExpression(expression, stdin);
    if (!(stdin == "clear")) {
        document.getElementById("terminal").innerHTML += processedOutputString + "<br/>";
    } 
}

function evaluateExpression(expression) {
    var result = "";
    var leftEvalString = "";
    var rightEvalString = "";

    var openRedirect = false;
    var openPipe = false;

    while (!openPipe && !openRedirect && expression.length > 0) {
        var character = expression.pop();
        switch (character) {
            case ";":
                result = evaluateExpression(expression)
                break;

            case ">":
                openRedirect = true;
                break;

            case "|":
                openPipe = true;
                break;

            default:
                if (openPipe || openRedirect) leftEvalString = character + leftEvalString;
                else rightEvalString = character + rightEvalString;
                break;
        }
    }

    if (!openPipe && !openRedirect && !leftEvalString) {
        result = parseInput(rightEvalString.trim());
    }
    if (openPipe && !openRedirect) {
        result = parseInput(rightEvalString.trim() + " " + evaluateExpression(expression));
    }
    if (!openPipe && openRedirect) {
        createFileAndWriteContents(evaluateExpression(expression), rightEvalString.trim());
    }
    return result;
}

function parseInput(stdin) {
    var processedOutputString = "";
    var input = stdin.trim().split(" ");
    switch (input[0]) {
        case "":
            break;

        case "basher":
            processedOutputString;
            processBasherTools(input);
            break;

        case "cat":
            processedOutputString += cat(input);
            break;

        case "cd":
            cd(input);
            processedOutputString;
            break;

        case "clear":
            clear();
            break;

        case "date":
            processedOutputString += date(input);
            break;

        case "echo":
            processedOutputString += echo(input);
            break;

        case "grep":
            processedOutputString += grep(input);
            break;

        case "help":
            processedOutputString += help();
            break;

        case "ls":
            processedOutputString += ls(input);
            break;

        case "mkdir":
            mkdir(input);
            processedOutputString;
            break;

        case "pwd":
            processedOutputString += pwd(input);
            break;

        case "rmdir":
            rmdir(input);
            processedOutputString;
            break;

        case "touch":
            touch(input[1]);
            processedOutputString;
            break;

        case "vi":
            startVim(input);
            processedOutputString;
            break;

        default:
            processedOutputString += "Unrecognized command " + input[0];
    }
    return processedOutputString;
}

function processBasherTools(input) {
    if (input[1] == "reset") window.localStorage.clear();
}

function clear() {
    document.getElementById("terminal").innerHTML = "";
}

function cat(input) {
    var output = getItemFromLocalStorage(workingDirectory + "/" + input[1]);
    return output ? output : "";
}

function date(input) {
    const d = new Date();
    const time = d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });
    return (
        days[d.getDay()] +
        " " +
        d.getDate() +
        " " +
        months[d.getMonth()] +
        " " +
        d.getFullYear() +
        " " +
        time +
        " " +
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
}

function help() {
    var helpString = "Basher is still very new and i am working on supporting more linux commands <br/>";
    helpString += "Here is a list of commands currently supported by basher <br/>";
    for (let i = 0; i < supportedCommands.length; i++) {
        helpString += " " + (i + 1) + ". " + supportedCommands[i] + " <br/>";
    }
    helpString += "<br/> Thanks for coming by and be sure to give your feedback over at the github repo <br/>";
    return helpString;
}

function grep(input) {
    var searchString = input[1].trim();
    var lines = input.slice(2).join(" ").split("<br/>");
    var outString = "";
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(searchString)) {
            outString += lines[i] + "<br/>";
        }
    }
    return outString;
}

function ls(input) {
    var files = getItemFromLocalStorage(workingDirectory);
    var folderContents = [];
    if (files) folderContents = JSON.parse(files);
    var longListFlag = false;
    if (input.length > 1 && input[1].startsWith("-") && input[1].includes("l")) {
        longListFlag = true;
    }
    var filesString = "";
    if (folderContents.length > 0) {
        filesString = "." + "<br/>" + ".." + "<br/>";
        for (let i = 0; i < folderContents.length; i++) {
            if (longListFlag) {
                filesString +=
                    folderContents[i].permissions +
                    "    " +
                    folderContents[i].modifiedBy +
                    "    " +
                    folderContents[i].modifiedAt +
                    "    ";
            }
            filesString += folderContents[i].name + "<br/>";
        }
    } else {
        filesString = "." + "<br/>" + ".." + "<br/>";
    }
    return filesString;
}

function mkdir(input) {
    for (let i = 1; i < input.length; i++) {
        var files = getItemFromLocalStorage(workingDirectory);
        var folderContents = [];
        if (files) folderContents = JSON.parse(files);
        var object = initFileObject(input[1]);
        for (let j = 0; j < folderContents.length; j++) {
            if (folderContents[j].name == object.name) {
                return;
            }
        }
        if (input[i].includes(".")) {
            object.permissions = "-rw-rw-r--";
            folderContents.push(object);
        } else {
            object.permissions = "drwxr-xr-x";
            folderContents.push(object);
        }

        setItemInLocalStorage(workingDirectory, JSON.stringify(folderContents));
    }

    return "";
}

function echo(input) {
    var outputString = input.slice(1).join(" ").replaceAll('"', "");
    return outputString;
}

function cd(input) {
    if (input[1] == "..") {
        workingDirectory = workingDirectory.substring(0, workingDirectory.lastIndexOf("/"));
    } else if (input[1].startsWith("/")) {
        workingDirectory = input[1];
    } else if (input[1] != ".") {
        workingDirectory += "/" + input[1];
    }
}

function rmdir(input) {
    if (input.length >= 2) {
        for (let j = 1; j < input.length; j++) {
            if (input[j] != "." && input[j] != "..") {
                if (input[j].startsWith("/")) {
                    var files = getItemFromLocalStorage(input[j]);
                    var folderContents = [];
                    if (files) folderContents = JSON.parse(files);
                    var updatedFolderContents = [];
                    for (let i = 0; i < folderContents.length; i++) {
                        if (input[j] != folderContents[i].name) {
                            updatedFolderContents.push(folderContents[i]);
                        }
                    }
                    setItemInLocalStorage(input[j], updatedFolderContents);
                } else {
                    var files = getItemFromLocalStorage(workingDirectory);
                    var folderContents = [];
                    if (files) folderContents = JSON.parse(files);
                    var updatedFolderContents = [];
                    for (let i = 0; i < folderContents.length; i++) {
                        if (input[j] != folderContents[i].name) {
                            updatedFolderContents.push(folderContents[i]);
                        }
                    }
                    setItemInLocalStorage(workingDirectory, JSON.stringify(updatedFolderContents));
                }
            }
        }
    }
}

function pwd(input) {
    return workingDirectory;
}

function touch(filePath) {
    if (filePath.startsWith("/")) {
        let fileName = filePath.substring(0, filePath.lastIndexOf("/"));
        var files = getItemFromLocalStorage(fileName);
        var folderContents = [];
        if (files) folderContents = JSON.parse(files);
        var object = initFileObject(fileName);
        object.permissions = "-rw-rw-r--";
        for (let j = 0; j < folderContents.length; j++) {
            if (folderContents[j].name == object.name) {
                return;
            }
        }
        folderContents.push(object);
        setItemInLocalStorage(fileName, JSON.stringify(folderContents));
        setItemInLocalStorage(filePath, "");
    } else {
        var files = getItemFromLocalStorage(workingDirectory);
        var folderContents = [];
        if (files) folderContents = JSON.parse(files);
        var object = initFileObject(filePath);
        object.permissions = "-rw-rw-r--";
        for (let j = 0; j < folderContents.length; j++) {
            if (folderContents[j].name == object.name) {
                return;
            }
        }
        folderContents.push(object);
        setItemInLocalStorage(workingDirectory, JSON.stringify(folderContents));
        setItemInLocalStorage(workingDirectory + "/" + filePath, "");
    }
}

function startVim(input) {
    var root = document.getElementById("root");
    var vim = document.getElementById("vim");
    var viminput = document.getElementById("viminput");

    root.style.display = "none";
    vim.style.display = "flex";
    viminput.disabled = true;
    vimFileName = input[1].includes(".") ? input[1] : input[1] + ".txt";

    var data = getItemFromLocalStorage(workingDirectory + "/" + vimFileName);
    if (data) viminput.value = data;
}

function handleVimKeyDown(event) {
    if (event.which == 13) {
        closeVim();
    }
    switch (event.which) {
        case 27:
            disableInsertMode();
            break;

        default:
            handleVimInput(event);
    }
    document.getElementById("statusbar").innerHTML = vimStatus;
}

function handleVimInput(event) {
    var which = event.which;
    switch (which) {
        case 8:
            if (isInsertMode) {
                var text = document.getElementById("viminput").innerHTML;
                document.getElementById("viminput").innerHTML = text.substring(0, text.length - 1);
            }
        case 73:
            if (isInsertMode && !checkSpecial(which)) {
                document.getElementById("viminput").innerHTML += String.fromCharCode(event.key);
            } else {
                document.getElementById("viminput").disabled = false;
                vimStatus = "--INSERT--";
                isInsertMode = true;
            }
            break;
        case 186:
        case 59:
            if (!isInsertMode && event.shiftKey) {
                vimStatus = ":";
            }
            break;
        default:
            if (isInsertMode && !checkSpecial(which)) {
                document.getElementById("viminput").innerHTML += event.key;
            } else if (vimStatus != "" && !checkSpecial(which)) {
                vimStatus += event.key;
            }
            break;
    }
}

function disableInsertMode() {
    document.getElementById("viminput").disabled = true;
    vimStatus = "";
    isInsertMode = false;
}

function closeVim() {
    if (vimStatus.startsWith(":") && (vimStatus.includes("wq") || vimStatus.includes("q"))) {
        var root = document.getElementById("root");
        var vim = document.getElementById("vim");
        var viminput = document.getElementById("viminput");
        var vimstatus = document.getElementById("statusbar");

        root.style.display = "flex";
        vim.style.display = "none";
        var data = viminput.value.replaceAll("\n", "<br/>");

        var files = getItemFromLocalStorage(workingDirectory);
        var folderContents = [];
        if (files) folderContents = JSON.parse(files);
        var object = initFileObject(vimFileName);
        for (let j = 0; j < folderContents.length; j++) {
            if (folderContents[j].name == object.name) {
                return;
            }
        }
        object.permissions = "-rw-rw-r--";
        folderContents.push(object);
        setItemInLocalStorage(workingDirectory, JSON.stringify(folderContents));
        setItemInLocalStorage(workingDirectory + "/" + vimFileName, data);

        viminput.value = "";
        vimstatus.innerHTML = "";
        vimStatus = "";
        vimFileName = "";
    }
}

function checkSpecial(which) {
    return specialKeys.includes(which);
}

function focusterminal() {
    document.getElementById("terminal_input").focus();
}

function focusvim() {
    document.getElementById("viminput").focus();
}

function getItemFromLocalStorage(key) {
    return window.localStorage.getItem(key);
}

function setItemInLocalStorage(key, value) {
    return window.localStorage.setItem(key, value);
}

function initFileObject(name) {
    const d = new Date();
    const time = d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
    });
    var object = {
        name: name,
        modifiedAt: d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear() + " " + time,
        modifiedBy: "basher",
        permissions: "",
    };
    return object;
}

function createFileAndWriteContents(result, filePath) {
    touch(filePath);
    if (filePath.startsWith("/")) {
        setItemInLocalStorage(filePath, result);
    } else {
        setItemInLocalStorage(workingDirectory + "/" + filePath, result);
    }
}
