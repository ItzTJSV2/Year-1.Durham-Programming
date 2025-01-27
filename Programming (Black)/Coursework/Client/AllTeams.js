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

// Cards Functions
let teams = [];

function createCard(teamName, players, teamID) {
    const card = document.createElement('div');
    card.classList.add('card'); 
    card.id = `${teamID}`;

    const teamNameElement = document.createElement('h3');
    teamNameElement.textContent = teamName;
    card.appendChild(teamNameElement);

    const playersList = document.createElement('ul');
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        playersList.appendChild(listItem);
    });
    card.appendChild(playersList);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Team';
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

function createAllTeams(teamNames, playersArray, teamIDs) {
    for (let i = 0; i < teamNames.length; i++) {
        createCard(teamNames[i], playersArray[i], teamIDs[i]);
    }
}

async function checkTeams() {
    try {
        console.log("Sending!");
        const response = await fetch('http://127.0.0.1:8080/api/getAllTeams');
        if (!response.ok) {
            throw new Error('Failed to fetch teams');
        }

        const teamsArray = await response.json();
        let tempArray1 = []; // Names
        let tempArray2 = []; // Players
        let tempArray3 = []; // TeamIDs

        teamsArray.forEach((team) => {
            if (team.Players != undefined) {
                tempArray1.push(team.Name);
                const playersArray = team.Players.split('|');
                tempArray2.push(playersArray);
                tempArray3.push(team.TeamID);
            }
        });

        if (JSON.stringify(tempArray3) !== JSON.stringify(teams)) {
            teams = tempArray3;
            clearCards(); 
            createAllTeams(tempArray1, tempArray2, tempArray3);
        }
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

function deleteCard(cardID) {
    console.log("Deleting card with ID:", cardID);
    const card = document.getElementById(cardID);
    if (card) {
        let userConfirmed = window.confirm('Are you sure you want to delete this team?');
        if (userConfirmed) {
            const teamData = {
                TeamID: cardID.toString(),
            };
            fetch('http://127.0.0.1:8080/api/deleteTeam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teamData)
            })
            .then(response => response.text())
            .then(data => {
                console.log("Successful Deletion: ", data);
                checkTeams();
            })
            .catch(error => {
                console.error('Error:', error); // Log any error
                alert("An error occurred. Please try again later.");
            });
         }
    } else {
        console.log('Card not found');
    }
}

function clearCards() {
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
}
