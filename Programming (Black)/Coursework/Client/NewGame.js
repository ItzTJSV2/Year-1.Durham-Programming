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
let Maps = [];
let MapNames = [];
let MapLinks = [];
let AgentBoolean = false;
function goToScene(from, sceneID) {
    if (sceneID === 'mapDraft') { // Validation for settings
        console.log("Checking settings");
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
        const checkboxes = document.querySelectorAll('#image-container input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                Maps.push(checkbox.id);
            } else {
                MapLinks.pop(checkbox.id);
                MapNames.pop(checkbox.id);
            }
        });
        BO = document.getElementById('dropdown3').options[document.getElementById('dropdown3').selectedIndex].id;
        if (document.getElementById('checkbox1').checked) {
            AgentBoolean = True;
        }
        console.log("Selected maps:")
        console.log(Maps);
        if (Maps.length != 7) {
            alert("Invalid Map Selection: Please select seven total maps. (You currently have " + Maps.length + ")");
            Maps = [];
            return;
        }
        document.getElementById('bestOfLabel').innerHTML =  "Best of " + BO;
        document.getElementById('CurrentTeam').innerHTML = TeamAName + " vs. " + TeamBName;
        console.log("Valid Settings selection.")
        console.log("Maps:", Maps);
        console.log("MapNames:", MapNames);
        console.log("MapLinks:", MapLinks);
        UserSelection(BO, 0);
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
function MapVetoManager(BestOf, Stage) {
    if (Stage == 7) {
        console.log("Map Veto Complete!");
        console.log("Map Order:", MapOrder);
        console.log("Agent Selection:", AgentBoolean);
    }
    if (Stage == 0) {
        document.getElementById('VetoState').value = TeamAName + " Ban:";
    }
    UserSelection(BestOf);
}

function UserSelection(BestOf) {
    let banner = document.getElementById('VetoState');
    const mapcontainer = document.getElementById('map-container');
    mapcontainer.innerHTML = ''; 
    function handleCheckboxSelection(checkbox, index) {
        if (checkbox.checked) {
            console.log("Selected Map: ", MapNames[index]); 
            MapOrder.push(Maps[index])
            banner.value += '\n';

            Maps.pop(index)
            MapLinks.pop(index)
            MapNames.pop(index)

            // Best of 1
            if (BestOf == 1) {
                if (MapOrder.length == 1) {
                    document.getElementById('CurrentTeam').innerHTML = TeamAName + " Banned " + MapNames[index] + "\n" + TeamBName + " Bans: ";
                    MapVetoManager(BestOf, MapOrder.length);
                }
            }

            MapVetoManager(BestOf, MapOrder.length);
        }
    }

    for (let i = 0; i < Maps.length; i++) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        const image = document.createElement('img');
        const checkbox = document.createElement('input');
        const label = document.createElement('label');

        checkbox.type = 'checkbox';
        checkbox.id = Maps[i];
        image.src = MapLinks[i];
        image.alt = MapNames[i];
        label.innerHTML = MapNames[i];

        image.onerror = () => {
            image.src = 'Client/Assets/Error.jpeg';
        };

        image.style.height = '200px';
        image.style.objectFit = 'cover';

        image.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            handleCheckboxSelection(checkbox, i);
        });

        checkbox.addEventListener('change', () => {
            handleCheckboxSelection(checkbox, i);
        });
        imageItem.appendChild(image);
        imageItem.appendChild(label);
        imageItem.appendChild(checkbox);
        mapcontainer.appendChild(imageItem);
    }
}

