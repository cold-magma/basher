const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
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
    8, 9, 13, 16, 16, 17, 17, 18, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39,
    40, 44, 45, 46, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
    144, 145, 173, 174, 175, 181, 182, 183,
];
const supportedCommands = [
    "basher reset",
    "clear",
    "cat",
    "cd",
    "date",
    "echo",
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
    parseInput(event.target.stdin.value);
    event.target.stdin.value = "";
}

function parseInput(stdin) {
    var processedOutputString = "basher@hello_world > " + stdin + "<br/>";
    var input = stdin.split(" ");
    switch (input[0]) {
        case "":
            break;

        case "basher":
            processBasherTools(input);
            processedOutputString += "<br/>";
            break;

        case "cat":
            processedOutputString += cat(input) + "<br/>";
            break;

        case "cd":
            cd(input);
            processedOutputString += "<br/>";
            break;

        case "clear":
            processedOutputString = "";
            clear();
            break;

        case "date":
            processedOutputString += date(input) + "<br/>";
            break;

        case "echo":
            processedOutputString += echo(input) + "<br/>";
            break;

        case "help":
            processedOutputString += help() + "<br/>";
            break;

        case "ls":
            processedOutputString += ls(input) + "<br/>";
            break;

        case "mkdir":
            mkdir(input);
            processedOutputString += "<br/>";
            break;

        case "pwd":
            processedOutputString += pwd(input) + "<br/>";
            break;

        case "rmdir":
            rmdir(input);
            processedOutputString += "<br/>";
            break;

        case "touch":
            touch(input);
            processedOutputString += "<br/>";
            break;

        case "vi":
            startVim(input);
            break;

        default:
            processedOutputString +=
                "Unrecognized command " + input[0] + "<br/>";
    }
    document.getElementById("terminal").innerHTML += processedOutputString;
}

function processBasherTools(input) {
    if (input[1] == "reset") window.localStorage.clear();
}

function clear() {
    document.getElementById("terminal").innerHTML = "";
}

function cat(input) {
    return window.localStorage.getItem(workingDirectory + "/" + input[1]);
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
    var helpString =
        "Basher is still very new and i am working on supporting more linux commands <br/>";
    helpString +=
        "Here is a list of commands currently supported by basher <br/>";
    for (let i = 0; i < supportedCommands.length; i++) {
        helpString += " " + (i + 1) + ". " + supportedCommands[i] + " <br/>";
    }
    helpString +=
        "<br/> Thanks for coming by and be sure to give your feedback over at the github repo <br/>";
    return helpString;
}

function ls(input) {
    var files = window.localStorage.getItem(workingDirectory);
    var folderContents = [];
    if (files) folderContents = JSON.parse("[" + files + "]");
    var longListFlag = false;
    if (
        input.length > 1 &&
        input[1].startsWith("-") &&
        input[1].includes("l")
    ) {
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
        var files = window.localStorage.getItem(workingDirectory);
        var folderContents = [];
        if (files) folderContents = JSON.parse("[" + files + "]");
        const d = new Date();
        const time = d.toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        });
        var object = {
            name: input[i],
            modifiedAt:
                d.getDate() +
                " " +
                months[d.getMonth()] +
                " " +
                d.getFullYear() +
                " " +
                time,
            modifiedBy: "basher",
            permissions: "",
        };
        if (input[i].includes(".")) {
            object.permissions = "-rw-rw-r--";
            folderContents.push(JSON.stringify(object));
        } else {
            object.permissions = "drwxr-xr-x";
            folderContents.push(JSON.stringify(object));
        }
        window.localStorage.setItem(workingDirectory, folderContents);
    }

    return "";
}

function echo(input) {
    var outputString = "";
    for (let i = 1; i < input.length; i++) {
        outputString += input[i] + " ";
    }
    outputString = outputString.replaceAll('"', "");
    return outputString;
}

function cd(input) {
    if (input[1] == "..") {
        workingDirectory = workingDirectory.substring(
            0,
            workingDirectory.lastIndexOf("/")
        );
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
                    var files = window.localStorage.getItem(input[j]);
                    var folderContents = [];
                    if (files) folderContents = JSON.parse("[" + files + "]");
                    var updatedFolderContents = [];
                    for (let i = 0; i < folderContents.length; i++) {
                        if (input[j] != folderContents[i].name) {
                            updatedFolderContents.push(
                                JSON.stringify(folderContents[i])
                            );
                        }
                    }
                    window.localStorage.setItem(
                        input[j],
                        updatedFolderContents
                    );
                } else {
                    var files = window.localStorage.getItem(workingDirectory);
                    var folderContents = [];
                    if (files) folderContents = JSON.parse("[" + files + "]");
                    var updatedFolderContents = [];
                    for (let i = 0; i < folderContents.length; i++) {
                        if (input[j] != folderContents[i].name) {
                            updatedFolderContents.push(
                                JSON.stringify(folderContents[i])
                            );
                        }
                    }
                    window.localStorage.setItem(
                        workingDirectory,
                        updatedFolderContents
                    );
                }
            }
        }
    }
}

function pwd(input) {
    return workingDirectory;
}

function touch(input) {
    if (input[1].startsWith("/")) {
        var files = window.localStorage.getItem(
            input[1].substring(0, input[1].lastIndexOf("/"))
        );
        var folderContents = [];
        if (files) folderContents = JSON.parse("[" + files + "]");
        const d = new Date();
        const time = d.toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        });
        var object = {
            name: input[1],
            modifiedAt:
                d.getDate() +
                " " +
                months[d.getMonth()] +
                " " +
                d.getFullYear() +
                " " +
                time,
            modifiedBy: "basher",
            permissions: "-rwxr-xr--",
        };
        folderContents.push(JSON.stringify(object));
        window.localStorage.setItem(
            input[1].substring(0, input[1].lastIndexOf("/")),
            folderContents
        );
        window.localStorage.setItem(input[1], folderContents);
    } else {
        var files = window.localStorage.getItem(workingDirectory);
        var folderContents = [];
        if (files) folderContents = JSON.parse("[" + files + "]");
        const d = new Date();
        const time = d.toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        });
        var object = {
            name: input[1],
            modifiedAt:
                d.getDate() +
                " " +
                months[d.getMonth()] +
                " " +
                d.getFullYear() +
                " " +
                time,
            modifiedBy: "basher",
            permissions: "-rwxr-xr--",
        };
        folderContents.push(JSON.stringify(object));
        window.localStorage.setItem(workingDirectory, folderContents);
        window.localStorage.setItem(
            workingDirectory + "/" + input[1],
            folderContents
        );
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

    var data = window.localStorage.getItem(
        workingDirectory + "/" + vimFileName
    );
    if (data) viminput.innerHTML = data;
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
                document.getElementById("viminput").innerHTML = text.substring(
                    0,
                    text.length - 1
                );
            }
        case 73:
            if (isInsertMode && !checkSpecial(which)) {
                document.getElementById("viminput").innerHTML +=
                    String.fromCharCode(event.key);
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
    if (
        vimStatus.startsWith(":") &&
        (vimStatus.includes("wq") || vimStatus.includes("q"))
    ) {
        var root = document.getElementById("root");
        var vim = document.getElementById("vim");
        var viminput = document.getElementById("viminput");

        root.style.display = "flex";
        vim.style.display = "none";
        var data = viminput.innerHTML;

        var files = window.localStorage.getItem(workingDirectory);
        var folderContents = [];
        if (files) folderContents = JSON.parse("[" + files + "]");
        const d = new Date();
        const time = d.toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        });
        var object = {
            name: vimFileName,
            modifiedAt:
                d.getDate() +
                " " +
                months[d.getMonth()] +
                " " +
                d.getFullYear() +
                " " +
                time,
            modifiedBy: "basher",
            permissions: "-rw-rw-r--",
        };
        folderContents.push(JSON.stringify(object));
        window.localStorage.setItem(workingDirectory, folderContents);
        window.localStorage.setItem(workingDirectory + "/" + vimFileName, data);

        viminput.innerHTML = "";
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
