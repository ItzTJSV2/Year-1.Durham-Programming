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

// Form Functions
const form = document.getElementById('teamForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const teamName = document.getElementById('name').value;
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    const player3 = document.getElementById('player3').value;
    const player4 = document.getElementById('player4').value;
    const player5 = document.getElementById('player5').value;

    playerString = player1 + "|" + player2 + "|" + player3 + "|" + player4 + "|" + player5;
    const teamData = {
        Name: teamName,
        Players: playerString
    };
    fetch('http://127.0.0.1:8080/api/addTeam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamData)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Successful connection: ", data);
        window.location.href = 'AllTeams.html';
    })
    .catch(error => {
        console.error('Error:', error); // Log any error
        alert("An error occurred. Please try again later.");
    });

});