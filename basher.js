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

        default:
            processedOutputString +=
                "Unrecognized command " + input.split(" ")[0] + "<br/>";
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
