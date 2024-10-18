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

function parseInput(input) {
    var processedOutputString = "basher@hello_world > " + input + "<br/>";
    switch (input.split(" ")[0]) {
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
                "Unrecognized command " + input.split(" ")[0] + "<br/>";
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
    var files = window.localStorage.getItem(workingDirectory);
    console.log(files);
    var filesString = "";
    if (files) {
        filesString = "." + "<br/>" + ".." + "<br/>";
        var list = files.split(",");
        for (let i = 0; i < list.length; i++) {
            filesString += list[i] + "<br/>";
        }
    } else {
        filesString = "." + "<br/>" + ".." + "<br/>";
    }
    return filesString;
}

function mkdir(input) {
    var inputs = input.split(" ");
    for (let i = 1; i < inputs.length; i++) {
        var list = window.localStorage.getItem(workingDirectory);
        var files = [];
        if (list) files.push(list);
        files.push(inputs[i]);
        window.localStorage.setItem(workingDirectory, files);
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
