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
      checkTeams();
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
generateImages();


/////////////////// Scene selection
let TeamA, TeamB, BO, TeamAName, TeamBName;
let TeamNames = [];
let MapPool = [];
let Maps = [];
let MapNames = [];
let MapLinks = [];
let AgentBoolean = false;

function goToScene(from, sceneID) {
    if (sceneID === 'mapDraft') { // Validation for settings
        TeamA = document.getElementById('dropdown1').options[document.getElementById('dropdown1').selectedIndex].id;
        TeamB = document.getElementById('dropdown2').options[document.getElementById('dropdown2').selectedIndex].id;

        TeamAName = TeamNames[teams.findIndex(team => team === TeamA)];
        TeamBName = TeamNames[teams.findIndex(team => team === TeamB)];

        console.log("Team A:", TeamAName);
        console.log("Team B:", TeamBName);

        if (TeamA === TeamB || TeamA === -1 || TeamB === -1) {
            alert("Invalid Team Selection: Please select two different valid teams to play against each other.");
            return;
        }
        BO = document.getElementById('dropdown3').options[document.getElementById('dropdown3').selectedIndex].id;
        if (BO != 1 && document.getElementById('checkbox1').checked) {
            alert("You may not have Agent Vetos for a match that is not a BO1.  Please either uncheck Agent Vetos of select Bo1.")
            return;
        }
        if (document.getElementById('checkbox1').checked) {
            AgentBoolean = true;
        }

        const checkboxes = document.querySelectorAll('#image-container input[type="checkbox"]');
        let tempArray3 = []
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                tempArray3.push(0)
            }
        });
        if (tempArray3.length != 7) {
            alert("Invalid Map Selection: Please select seven total maps. (You currently have " + tempArray3.length + ")");
            Maps = [];
            return;
        }
        let tempArray01 = MapLinks.slice();
        let tempArray02 = MapNames.slice();
        let count = 1
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                Maps.push(checkbox.id);
                MapPool.push(checkbox.id);
            } else {
                var index = MapLinks.indexOf(tempArray01[checkbox.id]);
                MapLinks.splice(index, 1);
                index = MapNames.indexOf(tempArray02[checkbox.id]);
                MapNames.splice(index, 1);
            }
        });
        document.getElementById('bestOfLabel').innerHTML =  "Best of " + BO;
        document.getElementById('CurrentTeam').innerHTML = TeamAName + " vs. " + TeamBName;
        console.log("Maps:", Maps);
        console.log("MapNames:", MapNames);
        console.log("MapLinks:", MapLinks);
        document.getElementById('CurrentState').innerHTML = TeamAName + " ban: " + "<br>";
        renderMaps();
    }
    document.querySelectorAll('.level').forEach(level => {
        level.classList.remove('active');
        level.style.display = 'none'; // Hide all levels
    });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById(sceneID).classList.add('active');
    document.getElementById(sceneID).style.display = 'flex';
}


/////////////////// Settings Functions
let teams = [];
function addOptionToDropdown(dropdownID, optionValue, optionText) {
    const dropdown = document.getElementById(dropdownID);
    if (dropdown) {
        const newOption = document.createElement("option");
        newOption.id = optionValue;
        newOption.textContent = optionText;
        dropdown.appendChild(newOption);
    } else {
        console.error(`Dropdown with ID "${dropdownID}" not found.`);
    }
}

function resetDropdownOptions(dropdownID) {
    const dropdown = document.getElementById(dropdownID);
    if (dropdown) {
        dropdown.innerHTML = ''; 
    } else {
        console.error(`Dropdown with ID "${dropdownID}" not found.`);
    }
}

async function checkTeams() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/getAllTeams');
        if (!response.ok) {
            throw new Error('Failed to fetch teams');
        }

        const teamsArray = await response.json();
        let tempArray1 = []; // Names
        let tempArray2 = []; // TeamIDs

        teamsArray.forEach((team) => {
            if (team.Players != undefined) {
                tempArray1.push(team.Name);
                tempArray2.push(team.TeamID);
            }
        });
        if (tempArray1.length < 2) {
            alert("Error: There are not enough sufficient teams to start a game.  You will be redirected to the 'Create Team' page.");
            window.location.href = 'NewTeam.html';
        }

        if (JSON.stringify(tempArray2) !== JSON.stringify(teams)) {
            TeamNames = tempArray1;
            teams = tempArray2;
            resetDropdownOptions('dropdown1');
            resetDropdownOptions('dropdown2');
            addOptionToDropdown('dropdown1', -1, "");
            addOptionToDropdown('dropdown2', -1, "");
            tempArray1.forEach((name, index) => {
                addOptionToDropdown('dropdown1', tempArray2[index], name+ "["+tempArray2[index]+"]");
                addOptionToDropdown('dropdown2', tempArray2[index], name+ "["+tempArray2[index]+"]");
            });
        }
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}
async function generateImages() {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';
    let imageNames = [];
    let autoPool = [];

    try {
        const response = await fetch('http://127.0.0.1:8080/api/maps');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            imageNames.push(data[i].Name);
            if (data[i].Comp === "True") { 
                autoPool.push(data[i].Name); 
            }
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        return;
    }
    let o = 0;
    imageNames.forEach((name) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const image = document.createElement('img');
        const checkbox = document.createElement('input');
        const label = document.createElement('label');
        checkbox.type = 'checkbox';
        checkbox.id = o;
        if (autoPool.includes(name)) {
            checkbox.checked = true;
        }
        MapNames.push(name);
        MapLinks.push(`http://127.0.0.1:8080/api/getImage?FileName=${name}`);
        image.src = `http://127.0.0.1:8080/api/getImage?FileName=${name}`;
        image.alt = name;
        image.onerror = () => {
            image.src = 'Client/Assets/Error.jpeg'; // Fallback image if the original one fails
        };
        label.innerHTML = name;
    
        image.style.height = '200px';
        image.style.objectFit = 'cover';
        image.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
        });
        imageItem.appendChild(image);
        imageItem.appendChild(label);
        imageItem.appendChild(checkbox);
        imageContainer.appendChild(imageItem);
        o++;
    });    
}


/////////////////// Map Veto
let MapOrder = [];
let mapcontainer = document.getElementById('map-container');
let pickedMaps = [];
let pickedMapLinks = [];
let pickedMapSides = [];

function handleCheckboxSelection(checkbox, i) {
    if (checkbox.checked) {
        index = Maps.indexOf(i);
        console.log("Selected map:", i);
        console.log("Index is ", index)
        console.log("Removing: ", MapNames[index]);
        MapOrder.push(i);
        if (BO == 1) {
            if (MapOrder.length == 1) {
                document.getElementById('VetoState').innerHTML += TeamAName + " bans " + MapNames[index] + "<br>";
                document.getElementById('CurrentState').innerHTML = TeamBName + " ban: " + "<br>";
            } else if (MapOrder.length == 2) {
                document.getElementById('VetoState').innerHTML += TeamBName + " bans " + MapNames[index] + "<br>";
                document.getElementById('CurrentState').innerHTML = TeamBName + " ban: " + "<br>";
            } else if (MapOrder.length == 3) {
                document.getElementById('VetoState').innerHTML += TeamBName + " bans " + MapNames[index] + "<br>";
                document.getElementById('CurrentState').innerHTML = TeamAName + " ban: " + "<br>";
            } else if (MapOrder.length == 4) {
                document.getElementById('VetoState').innerHTML += TeamAName + " bans " + MapNames[index] + "<br>";
                document.getElementById('CurrentState').innerHTML = TeamBName + " ban: " + "<br>";
            } else if (MapOrder.length == 5) {
                document.getElementById('VetoState').innerHTML += TeamBName + " bans " + MapNames[index] + "<br>";
                document.getElementById('CurrentState').innerHTML = TeamAName + " pick: " + "<br>";
            } else {
                const side = confirm((TeamBName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                if (side) { // Attack
                    MapOrder[MapOrder.length-1] += "/B";
                    document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + " with " + TeamBName + " on Attack." + "<br>";
                    pickedMaps.push(MapNames[index])
                    pickedMapLinks.push(MapLinks[index])
                    pickedMapSides.push("B")
                } else { // Defense
                    MapOrder[MapOrder.length-1] += "/A";
                    document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + + " with " + TeamBName + " on Defense." + "<br>";
                    pickedMaps.push(MapNames[index])
                    pickedMapLinks.push(MapLinks[index])
                    pickedMapSides.push("A")
                }
            }
        } else if (BO == 3) {
                if (MapOrder.length == 1) {
                    document.getElementById('VetoState').innerHTML += TeamAName + " bans " + MapNames[index] + "<br>";
                    document.getElementById('CurrentState').innerHTML = TeamBName + " ban: " + "<br>";
                } else if (MapOrder.length == 2) {
                    document.getElementById('VetoState').innerHTML += TeamBName + " bans " + MapNames[index] + "<br>";
                    document.getElementById('CurrentState').innerHTML = TeamAName + " pick: " + "<br>";
                } else if (MapOrder.length == 3) {
                    const side = confirm((TeamBName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                    if (side) { // Attack
                        MapOrder[MapOrder.length-1] += "/B";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + " with " + TeamBName + " on Attack." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("B")
                    } else { // Defense
                        MapOrder[MapOrder.length-1] += "/A";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + + " with " + TeamBName + " on Defense." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("A")
                    document.getElementById('CurrentState').innerHTML = TeamBName + " pick: " + "<br>";
                    }
                } else if (MapOrder.length == 4) {
                    const side = confirm((TeamAName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                    if (side) { // Attack
                        MapOrder[MapOrder.length-1] += "/A";
                        document.getElementById('VetoState').innerHTML += TeamBName + " picks " + MapNames[index] + " with " + TeamAName + " on Attack." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("A")
                    } else { // Defense
                        MapOrder[MapOrder.length-1] += "/B";
                        document.getElementById('VetoState').innerHTML += TeamBName + " picks " + MapNames[index] + + " with " + TeamAName + " on Defense." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("B")
                    document.getElementById('CurrentState').innerHTML = TeamAName + " ban: " + "<br>";
                    }
                } else  if (MapOrder.length == 5) {
                    document.getElementById('VetoState').innerHTML += TeamAName + " bans " + MapNames[index] + "<br>";
                    document.getElementById('CurrentState').innerHTML = TeamBName + " pick: " + "<br>";
                } else {
                    const side = confirm((TeamBName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                    if (side) { // Attack
                        MapOrder[MapOrder.length-1] += "/B";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + " with " + TeamBName + " on Attack." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("B")
                    } else { // Defense
                        MapOrder[MapOrder.length-1] += "/A";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + + " with " + TeamBName + " on Defense." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("A")
                    }
                }
            }
            else if (BO == 5) {
                if (MapOrder.length == 1) {
                    document.getElementById('VetoState').innerHTML += TeamAName + " bans " + MapNames[index] + "<br>";
                    document.getElementById('CurrentState').innerHTML = TeamBName + " ban: " + "<br>";
                } else if (MapOrder.length == 2) {
                    document.getElementById('VetoState').innerHTML += TeamBName + " bans " + MapNames[index] + "<br>";
                    document.getElementById('CurrentState').innerHTML = TeamAName + " pick: " + "<br>";
                } else if (MapOrder.length == 3) {
                    const side = confirm((TeamBName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                    if (side) { // Attack
                        MapOrder[MapOrder.length-1] += "/B";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + " with " + TeamBName + " on Attack." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("B")
                    } else { // Defense
                        MapOrder[MapOrder.length-1] += "/A";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + + " with " + TeamBName + " on Defense." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("A")
                    document.getElementById('CurrentState').innerHTML = TeamBName + " pick: " + "<br>";
                    }
                } else if (MapOrder.length == 4) {
                    const side = confirm((TeamAName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                    if (side) { // Attack
                        MapOrder[MapOrder.length-1] += "/A";
                        document.getElementById('VetoState').innerHTML += TeamBName + " picks " + MapNames[index] + " with " + TeamAName + " on Attack." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("A")
                    } else { // Defense
                        MapOrder[MapOrder.length-1] += "/B";
                        document.getElementById('VetoState').innerHTML += TeamBName + " picks " + MapNames[index] + + " with " + TeamAName + " on Defense." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("B")
                    document.getElementById('CurrentState').innerHTML = TeamAName + " ban: " + "<br>";
                    }
                } else if (MapOrder.length == 5) {
                    const side = confirm((TeamBName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                    if (side) { // Attack
                        MapOrder[MapOrder.length-1] += "/B";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + " with " + TeamBName + " on Attack." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("B")
                    } else { // Defense
                        MapOrder[MapOrder.length-1] += "/A";
                        document.getElementById('VetoState').innerHTML += TeamAName + " picks " + MapNames[index] + + " with " + TeamBName + " on Defense." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("A")
                    document.getElementById('CurrentState').innerHTML = TeamBName + " pick: " + "<br>";
                    }
                } else {
                    const side = confirm((TeamAName + ", what side do you wish to start on? \n OK = Attack | Cancel = Defense"));
                    if (side) { // Attack
                        MapOrder[MapOrder.length-1] += "/A";
                        document.getElementById('VetoState').innerHTML += TeamBName + " picks " + MapNames[index] + " with " + TeamAName + " on Attack." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("A")
                    } else { // Defense
                        MapOrder[MapOrder.length-1] += "/B";
                        document.getElementById('VetoState').innerHTML += TeamBName + " picks " + MapNames[index] + + " with " + TeamAName + " on Defense." + "<br>";
                        pickedMaps.push(MapNames[index])
                        pickedMapLinks.push(MapLinks[index])
                        pickedMapSides.push("B")
                    }
                }
            }
        Maps.splice(index, 1);
        MapLinks.splice(index, 1);
        MapNames.splice(index, 1);
        if ((MapOrder.length === 6) && ((BO == 1) || BO == 3) || (MapOrder.length == 7)) { // Finished
            console.log("Finished.");
            console.log("Order:", MapOrder);
            console.log("Picked Maps:", pickedMaps);
            console.log("Picked Map Links:", pickedMapLinks);
            console.log("Picked Map Sides:", pickedMapSides);
            if (!AgentBoolean) {
                goToScene('mapDraft', 'summary');
                generateSummary();
            } else {
                goToScene('mapDraft', 'agentDraft');
                document.getElementById('CurrentTeam1').innerHTML = TeamAName + " vs. " + TeamBName;
                document.getElementById('CurrentState').innerHTML = TeamAName + " ban: " + "<br>";
                renderAgents();
            }
        } else {
            renderMaps();
        }
    }
}

function renderMaps() {
    mapcontainer.innerHTML = '';
    for (let i = 0; i < Maps.length; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        const image = document.createElement('img');
        const checkbox = document.createElement('input');
        const label = document.createElement('label');

        checkbox.type = 'checkbox';
        checkbox.id = Maps[i];
        checkbox.style.display = 'none';
        image.src = MapLinks[i];
        image.alt = MapNames[i];
        label.innerHTML = MapNames[i];

        image.onerror = () => {
            image.src = 'Client/Assets/Error.jpeg';
        };

        image.style.height = '300px';
        image.style.objectFit = 'cover';

        image.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            handleCheckboxSelection(checkbox, Maps[i]);
        });

        checkbox.addEventListener('change', () => {
            handleCheckboxSelection(checkbox, Maps[i]);
        });
        imageItem.appendChild(image);
        imageItem.appendChild(label);
        imageItem.appendChild(checkbox);
        mapcontainer.appendChild(imageItem);
    }
}


/////////////////// Agent Veto

let AgentOrder = [];
let agentcontainer = document.getElementById('agent-container');
let agentIDs = [];
let agentNames = [];

let pickedAgentNames = []
let pickedAgentLinks = [];
let stageType = "Ban: <br>";

function handleAgentSelection(checkbox, i) {
    if (checkbox.checked) {
        index = agentIDs.indexOf(i);
        console.log("Selected map:", i);
        console.log("Index is ", index)
        console.log("Removing: ", agentNames[index]);
        pickedAgentNames.push(agentNames[index]);
        AgentOrder.push(agentIDs[index]);
        pickedAgentLinks.push(`http://127.0.0.1:8080/api/getImage?FileName=${agentNames[index]}`);
        if ((AgentOrder.length < 6) && (AgentOrder.length % 2 == 1)) { // Team A Ban Stage1
            document.getElementById('TeamABans').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamBName + " ban: ";
        } else if ((AgentOrder.length < 7) && (AgentOrder.length % 2 == 0)) { // Team B Ban Stage1
            document.getElementById('TeamBBans').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " ban: ";
        }  else if (AgentOrder.length == 7) { // Team A Pick Stage1 1/2
            document.getElementById('TeamAPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamBName + " pick: ";
        } else if (AgentOrder.length == 8) { // Team B Pick Stage 1 1/2
            document.getElementById('TeamBPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamBName + " pick: ";
        } else if (AgentOrder.length == 9) {
            document.getElementById('TeamBPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " pick: ";
        } else if (AgentOrder.length == 10) {
            document.getElementById('TeamAPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " pick: ";
        } else if (AgentOrder.length == 11) {
            document.getElementById('TeamAPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamBName + " pick: ";
        } else if (AgentOrder.length == 12) {
            document.getElementById('TeamBPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " ban: ";
        } else if ((AgentOrder.length < 16) && (AgentOrder.length % 2 == 1)) { // Team A Ban Stage2
            document.getElementById('TeamABans').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamBName + " ban: ";
        } else if (AgentOrder.length == 14) { // Team B Ban Stage2 1/2
            document.getElementById('TeamBBans').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " ban: ";
        } else if (AgentOrder.length == 16) { // Team B Ban Stage2 2/2
            document.getElementById('TeamBBans').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " pick: ";
        } else if (AgentOrder.length == 17) {
            document.getElementById('TeamBPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " pick: ";
        } else if (AgentOrder.length == 18) {
            document.getElementById('TeamAPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamAName + " pick: ";
        } else if (AgentOrder.length == 19) {
            document.getElementById('TeamAPicks').innerHTML += agentNames[index] + "<br>";
            document.getElementById('CurrentState1').innerHTML = TeamBName + " pick: ";
        } else if (AgentOrder.length == 20) {
            document.getElementById('TeamBPicks').innerHTML += agentNames[index] + "<br>";
        }
        agentIDs.splice(index, 1);
        agentNames.splice(index, 1);
        if (pickedAgentNames.length == 20) { // Finished
            goToScene('agentDraft', 'summary');
            generateSummary();
        } else {
            renderAgents();
        }
    }
}

async function renderAgents() {
    agentcontainer.innerHTML = '';
    if (agentIDs.length === 0) {
        document.getElementById('CurrentState1').innerHTML = TeamAName + " ban: ";
        document.getElementById('TeamAName').innerHTML = "<strong>" + TeamAName + "</strong>";
        document.getElementById('TeamBName').innerHTML = "<strong>" + TeamBName + "</strong>";
        await generateAgentImages();
    }
    for (let i = 0; i < agentIDs.length; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const image = document.createElement('img');
        const checkbox = document.createElement('input');
        const label = document.createElement('label');
        checkbox.type = 'checkbox';
        checkbox.id = agentIDs[i];
        checkbox.style.display = 'none';
        image.src = `http://127.0.0.1:8080/api/getImage?FileName=${agentNames[i]}`;
        image.alt = agentNames[i];
        image.onerror = () => {
            image.src = 'Client/Assets/Error.jpeg'; // Fallback image if the original one fails
        };
        label.innerHTML = agentNames[i];
    
        image.style.height = '150px';
        image.style.width = '150px';
        image.style.objectFit = 'cover';

        image.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            handleAgentSelection(checkbox, agentIDs[i]);
        });

        checkbox.addEventListener('change', () => {
            handleAgentSelection(checkbox, agentIDs[i]);
        });

        imageItem.appendChild(image);
        imageItem.appendChild(label);
        imageItem.appendChild(checkbox);
        agentcontainer.appendChild(imageItem);
    }  
}

async function generateAgentImages() {
    agentcontainer.innerHTML = '';
    try {
        const response = await fetch('http://127.0.0.1:8080/api/agents');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            agentIDs.push(data[i].agentid);
            agentNames.push(data[i].name);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        return;
    }  
}

/////////////////// Summary

function generateSummary() {
    const summaryMapContainer = document.getElementById('summary-map-container');
    summaryMapContainer.innerHTML = '';
    for (let i = 0; i < pickedMaps.length; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        const image = document.createElement('img');
        const label = document.createElement('label');

        image.src = pickedMapLinks[i];
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
    console.log("PickedAgentLinks: ", pickedAgentLinks)
    for (let i = 0; i < pickedAgentNames.length; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        const image = document.createElement('img');
        const label = document.createElement('label');
        
        image.src = pickedAgentLinks[i];
        image.alt = pickedAgentNames[i];
        label.innerHTML = pickedAgentNames[i];
        image.onerror = () => {
            image.src = 'Client/Assets/Error.jpeg';
        };

        image.style.height = '150px';
        image.style.objectFit = 'cover';

        imageItem.appendChild(image);
        imageItem.appendChild(label);
        if (i == 6 || i == 9 || i == 10 || i == 17 || i == 18) {
            summaryAgentContainer1.appendChild(imageItem);
        } else if (i == 7 || i == 8 || i == 11 || i == 16 || i == 19) {
            summaryAgentContainer2.appendChild(imageItem);
        }
    }
}

// Add it to the database
function AddGame() {
    let AgentString = "";
    if (AgentOrder.length != 0) {
        AgentString = AgentOrder.join('|')
    }
    let gameData = {
        BO: BO,
        MapPool: MapPool.join('|'),
        MapOrder: MapOrder.join('|'),
        AgentOrder: AgentString,
        Teams: TeamA + "|" + TeamB
    }
    console.log(gameData)
    fetch('http://127.0.0.1:8080/api/addGame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Successful connection: ", data);
        window.location.href = 'main.html';
    })
    .catch(error => {
        console.error('Error:', error); // Log any error
        alert("An error occurred. Please try again later.");
    });
}