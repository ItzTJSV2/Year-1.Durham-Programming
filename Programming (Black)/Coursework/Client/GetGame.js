let interval = 5000;
async function checkServer() {
    console.log("Attempting to connect to server!")
    try {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('Server not responding.');
        console.log("Server has been found.")
        setTimeout(checkServer, interval);
      } catch (error) {
        console.error(error);
        // Update the UI with an error message and show the retry button
        console.log('Connection to server lost. Please check your connection.');
        await toggleModal();
      }
}

function toggleModal() {
    let remainingSeconds = 5;
    const modalBackdrop = document.getElementById('modalBackdrop');
    const countdownElement = document.getElementById('countdown');

    if (modalBackdrop.style.display === 'flex') {
        modalBackdrop.style.display = 'none';
    } else {
        modalBackdrop.style.display = 'flex';

        // Start countdown
        const interval = setInterval(() => {
            remainingSeconds -= 1;
            countdownElement.textContent = remainingSeconds;

            // If countdown reaches 0, stop the interval and hide the modal
            if (remainingSeconds <= 0) {
                clearInterval(interval);
                countdownElement.textContent = 5;
                modalBackdrop.style.display = 'none';
                checkServer();
            }
        }, 1000);
    }
}
checkServer();

let pickedMaps = [];
let pickedMapSides = [];
let AgentBoolean = false;
let TeamAName, TeamBName;
let pickedAgentNames = [];
let BestOF, MapPool, MapOrder, AgentOrder, Teams;
getGameDetails();



// Check what given game value it is
function getGameID() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('GameID') == undefined) {
        window.location.href = 'main.html';
    }
    console.log("GameID: ", urlParams.get('GameID'));
    return urlParams.get('GameID');
}

async function getGameDetails() {
    let GameID = getGameID();
    console.log("Sending!");
    try {
        let response = await fetch('http://127.0.0.1:8080/api/getGame?id=' + GameID);
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }
        let gamesArray = await response.json();
        if (gamesArray.length == 0) {
            window.location.href = 'main.html';
        }
        MapPool = gamesArray.MapPool.split("|");
        MapOrder = gamesArray.MapOrder.split("|");
        AgentOrder = gamesArray.AgentOrder.split("|");
        Teams = gamesArray.Teams.split("|");

        response = await fetch('http://127.0.0.1:8080/api/getAllTeams');
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }
        let teamsArray = await response.json();
        TeamAName = teamsArray[Teams[0]].Name;
        TeamBName = teamsArray[Teams[1]].Name;

        let tempValue;
        for (let i = 0; i < MapOrder.length; i++) {
            if (MapOrder[i].includes("/")) {
                tempValue = MapOrder[i].split("/");
                pickedMaps.push(tempValue[0]);
                pickedMapSides.push(tempValue[1]);
            }
        }
        response = await fetch('http://127.0.0.1:8080/api/maps');
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }
        let mapsArray = await response.json();
        for (let i = 0; i < pickedMaps.length; i++) {
            pickedMaps[i] = mapsArray[pickedMaps[i]].Name;
        }

        if (AgentOrder.length > 0) {
            AgentBoolean = true;
            response = await fetch('http://127.0.0.1:8080/api/agents');
            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }
            let agentsArray = await response.json();
            for (let i = 0; i < AgentOrder.length; i++) {
                if ((i > 5 && i < 12) || (i > 15)) {
                    pickedAgentNames.push(agentsArray[AgentOrder[i]].name);
                }
            }
        }
        generateSummary();
    } catch (error) {
        console.error(error);
    }
}

async function generateSummary() {
    const summaryMapContainer = document.getElementById('summary-map-container');
    summaryMapContainer.innerHTML = '';
    for (let i = 0; i < pickedMaps.length; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        const image = document.createElement('img');
        const label = document.createElement('label');

        image.src = `http://127.0.0.1:8080/api/getImage?FileName=${pickedMaps[i]}`;
        image.alt = pickedMaps[i];
        label.innerHTML = "Map " + (i+1) + "<br>";
        label.innerHTML += pickedMaps[i] + "<br>";
        if (pickedMapSides[i] === "B") {
            label.innerHTML += TeamAName + " on Defense";
        } else {
            label.innerHTML += TeamAName + " on Attack";
        }
        image.onerror = () => {
            image.src = 'Client/Assets/Error.jpeg';
        };

        image.style.width = '333px'
        image.style.height = '187px';
        image.style.objectFit = 'cover';

        imageItem.appendChild(image);
        imageItem.appendChild(label);
        summaryMapContainer.appendChild(imageItem);
    }
    if (AgentBoolean == false) {
        document.getElementById('AgentVetoDisplay').style.display = 'none'
        document.getElementById('AgentVetoTable').style.display = 'none'
    }

    document.getElementById('TeamADisplay').innerHTML = "<strong>" + TeamAName + "</strong>";
    document.getElementById('TeamBDisplay').innerHTML = "<strong>" + TeamBName + "</strong>";
    const summaryAgentContainer1 = document.getElementById('summary-agent-container1');
    summaryAgentContainer1.innerHTML = '';
    const summaryAgentContainer2 = document.getElementById('summary-agent-container2');
    summaryAgentContainer2.innerHTML = '';
    for (let i = 0; i < pickedAgentNames.length; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        const image = document.createElement('img');
        const label = document.createElement('label');
        
        image.src = `http://127.0.0.1:8080/api/getImage?FileName=${pickedAgentNames[i]}`;
        image.alt = pickedAgentNames[i];
        label.innerHTML = pickedAgentNames[i];
        image.onerror = () => {
            image.src = 'Client/Assets/Error.jpeg';
        };

        image.style.height = '150px';
        image.style.objectFit = 'cover';

        imageItem.appendChild(image);
        imageItem.appendChild(label);
        if (i < 5) {
            summaryAgentContainer1.appendChild(imageItem);
        } else {
            summaryAgentContainer2.appendChild(imageItem);
        }
    }
}
