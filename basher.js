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

function handleTextInput(event) {
    event.preventDefault();
    parseInput(event.target.stdin.value);
    event.target.stdin.value = "";
}

function parseInput(stdin) {
    var processedOutputString = "basher@hello_world > " + stdin + "<br/>";
    var input = stdin.split(" ");
    switch (input[0]) {
        case "clear":
            processedOutputString = "";
            clear();
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

        default:
            processedOutputString +=
                "Unrecognized command " + input[0] + "<br/>";
            break;
    }
    document.getElementById("terminal").innerHTML += processedOutputString;
}

function clear() {
    document.getElementById("terminal").innerHTML = "";
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
        input[1].includes("-")
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

function cd(input) {
    if (input.startsWith("/")) {
        workingDirectory = input;
    } else {
        workingDirectory += "/" + input.split(" ")[1];
    }
}

function pwd(input) {
    return workingDirectory;
}
