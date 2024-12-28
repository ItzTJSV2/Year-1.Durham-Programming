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