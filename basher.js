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
var workingDirectory = "/home/basher";
//vim props
var isInsertMode = false;
var vimFileName = ""
var vimStatus = ""

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

        case "clear":
            processedOutputString = "";
            clear();
            break;

        case "cat":
            processedOutputString += cat(input) + "<br/>";
            break;

        case "echo":
            processedOutputString += echo(input) + "<br/>";
            break;


        case "date":
            processedOutputString += date(input) + "<br/>";
            break;

        case "ls":
            processedOutputString += ls(input) + "<br/>";
            break;

        case "mkdir":
            mkdir(input);
            processedOutputString += "<br/>";
            break;

        case "cd":
            cd(input);
            processedOutputString += "<br/>";
            break;

        case "pwd":
            processedOutputString += pwd(input) + "<br/>";
            break;

        case "vi":
            startVim(input)
            break;

        case "rmdir":
            rmdir(input)
            processedOutputString += "<br/>";
            break;

        default:
            processedOutputString +=
                "Unrecognized command " + input[0] + "<br/>";
    }
    document.getElementById("terminal").innerHTML += processedOutputString;
}

function clear() {
    document.getElementById("terminal").innerHTML = "";
}

function cat(input){
    return window.localStorage.getItem(workingDirectory+"/"+input[1])
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

function ls(input) {
    var files = window.localStorage.getItem(workingDirectory)
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
        var files = window.localStorage.getItem(workingDirectory)
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
    var outputString = ""
    for (let i = 1; i < input.length; i++) {
        outputString += input[i] + " "
    }
    outputString = outputString.replaceAll("\"", "")
    return outputString
}

function cd(input) {
    if (input[1] == "..") {
        workingDirectory = workingDirectory.substring(0, workingDirectory.lastIndexOf("/"))
    }
    else if (input[1].startsWith("/")) {
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
                    var files = window.localStorage.getItem(input[j])
                    var folderContents = [];
                    if (files) folderContents = JSON.parse("[" + files + "]");
                    var updatedFolderContents = []
                    for (let i = 0; i < folderContents.length; i++) {
                        if (input[j] != folderContents[i].name) {
                            updatedFolderContents.push(JSON.stringify(folderContents[i]))
                        }
                    }
                    window.localStorage.setItem(input[j], updatedFolderContents)
                } else {
                    var files = window.localStorage.getItem(workingDirectory)
                    var folderContents = [];
                    if (files) folderContents = JSON.parse("[" + files + "]");
                    var updatedFolderContents = []
                    for (let i = 0; i < folderContents.length; i++) {
                        if (input[j] != folderContents[i].name) {
                            updatedFolderContents.push(JSON.stringify(folderContents[i]))
                        }
                    }
                    window.localStorage.setItem(workingDirectory, updatedFolderContents)
                }
            }
        }
    }
}

function pwd(input) {
    return workingDirectory;
}

function startVim(input) {
    var root = document.getElementById("root")
    var vim = document.getElementById("vim")
    var viminput = document.getElementById("viminput")
    var statusbar = document.getElementById("statusbar")

    root.style.display = "none"
    vim.style.display = "flex"
    viminput.disabled = true
    vimFileName = input[1].includes(".") ? input[1] : input[1] + ".txt"
}

function handleVimKeyDown(event) {
    if (event.which == 13) {
        closeVim()
    }
    switch (event.which) {
        case 27:
            disableInsertMode()
            break;

        default:
            handleVimInput(event)
    }
    document.getElementById("statusbar").innerHTML = vimStatus
}

function handleVimInput(event) {
    var which = event.which
    switch (which) {
        case 73:
            if (isInsertMode && which != 16) {
                document.getElementById("viminput").innerHTML = String.fromCharCode(which) + document.getElementById("viminput").innerHTML
            }
            else {
                document.getElementById("viminput").disabled = false
                vimStatus = "--INSERT--"
                isInsertMode = true
            }
            break;
        case 59:
            if (!isInsertMode && event.shiftKey) {
                vimStatus = ":"
            }
            break;
        default:
            if (isInsertMode && which != 16) document.getElementById("viminput").innerHTML = String.fromCharCode(which) + document.getElementById("viminput").innerHTML
            else if (vimStatus != "") vimStatus += String.fromCharCode(which).toLocaleLowerCase()
            break;
    }
}

function disableInsertMode() {
    document.getElementById("viminput").disabled = true
    vimStatus = ""
    isInsertMode = false
}

function closeVim() {
    var root = document.getElementById("root")
    var vim = document.getElementById("vim")
    var viminput = document.getElementById("viminput")

    root.style.display = "flex"
    vim.style.display = "none"
    var data = viminput.innerHTML
    viminput.innerHTML = ""


    var files = window.localStorage.getItem(workingDirectory)
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
    folderContents.push(JSON.stringify(object))
    window.localStorage.setItem(workingDirectory, folderContents)
    window.localStorage.setItem(workingDirectory + "/" + vimFileName, data)
}