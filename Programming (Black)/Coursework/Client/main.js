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
      checkGames();
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

// Getting all games.
let games = [];
let MapNames = [];
let TeamNames = [];

function createCard(TeamA, TeamB, Maps, gameID) {
    const card = document.createElement('a');
    card.classList.add('card'); 
    card.id = `${gameID}`;

    card.href = `GetGame.html?GameID=${gameID}`;
    card.style.display = 'block';

    const titleCard = document.createElement('h3');
    titleCard.textContent = TeamA + " vs. " + TeamB;
    card.appendChild(titleCard);

    const mapsList = document.createElement('ul');
    Maps.forEach(map => {
        const listItem = document.createElement('li');
        listItem.textContent = map;
        mapsList.appendChild(listItem);
    });
    for (let i = 0; i < 5 - Maps.length; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = "&nbsp;";
        mapsList.appendChild(listItem);
    }
    card.appendChild(mapsList);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Game';
    deleteButton.onclick = () => deleteCard(card.id);

    deleteButton.style.padding = '8px 16px';
    deleteButton.style.backgroundColor = '#ff4d4d';
    deleteButton.style.color = '#fff';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.transition = 'background-color 0.3s';
    
    deleteButton.addEventListener('mouseover', () => {
        deleteButton.style.backgroundColor = '#ff1a1a';
    });

    deleteButton.addEventListener('mouseout', () => {
        deleteButton.style.backgroundColor = '#ff4d4d';
    });

    card.appendChild(deleteButton);

    document.getElementById('cardContainer').appendChild(card);
}

async function createAllTeams(teamAs, teamBs, MapObjects, gameIDs) {
    await GenerateMapNames();
    await GenerateTeamNames();
    console.log("TeamNames: ", TeamNames);
    console.log("MapNames: ", MapNames);
    for (let i = 0; i < teamAs.length; i++) {
        let MapsSelected = [];
        for (let j = 0; j < MapObjects[i].length; j++) {
            MapsSelected.push(MapNames[MapObjects[i][j]]);
        }
        createCard(TeamNames[teamAs[i]], TeamNames[teamBs[i]], MapsSelected, gameIDs[i]);
    }
}

async function checkGames() {
    try {
        console.log("Sending!");
        const response = await fetch('http://127.0.0.1:8080/api/getAllGames');
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }

        const gamesArray = await response.json();
        let tempArray1 = []; // teamAs
        let tempArray2 = []; // teamBs
        let tempArray3 = []; // MapObjects
        let tempArray4 = []; // gameIDs

        gamesArray.forEach((game) => {
            if (game.GameID != undefined) {
                tempArray1.push((game.Teams).split("|")[0]);
                tempArray2.push((game.Teams).split("|")[1]);
                let tempValue = game.MapOrder.split('|');
                let MapObject = []
                for (let i = 0; i < tempValue.length; i++) {
                    if (tempValue[i].includes("/")) {
                        MapObject.push(tempValue[i].split("/")[0])
                    }
                }
                tempArray3.push(MapObject);
                tempArray4.push(game.GameID);
            }
        });
        console.log("Found GameIDs: ", tempArray4)

        if (JSON.stringify(tempArray4) !== JSON.stringify(games)) {
            games = tempArray4;
            clearCards(); 
            createAllTeams(tempArray1, tempArray2, tempArray3, tempArray4);
        } else if (tempArray4.length === 0) {
            clearCards();
            console.log("No Games.")
            const card = document.createElement('div');
            card.classList.add('card');
            card.textContent = 'There are currently no games stored, click the "New Draft" button above to add a game.';
            document.getElementById('cardContainer').appendChild(card);
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

function clearCards() {
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
}

async function GenerateTeamNames() {
    try {
        console.log("Sending getallteams request!");
        const response = await fetch('http://127.0.0.1:8080/api/getAllTeams');
        if (!response.ok) {
            throw new Error('Failed to fetch teams');
        }

        const teamsArray = await response.json();
        TeamNames = [];
        console.log("Teams: ", teamsArray);
        teamsArray.forEach((team) => {
            TeamNames.push(team.Name);
        });
        
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

async function GenerateMapNames() {
    try {
        console.log("Sending maps request!");
        const response = await fetch('http://127.0.0.1:8080/api/maps');
        if (!response.ok) {
            throw new Error('Failed to fetch maps');
        }

        const MapArray = await response.json();
        MapNames = [];

        MapArray.forEach((map) => {
            MapNames.push(map.Name);
        });
        
    } catch (error) {
        console.error('Error fetching maps:', error);
    }
}