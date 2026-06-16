async function askAI() {
    const userInput = document.getElementById("userInput").value;
    const outputDiv = document.getElementById("output");

    outputDiv.innerText = "Thinking...";

    try {
        // Fetch calls your Python backend, NOT Google directly
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: userInput })
        });

        const data = await response.json();
        
        if (data.response) {
            outputDiv.innerText = data.response; // Display AI response
        } else {
            outputDiv.innerText = "Error: " + data.error;
        }

    } catch (error) {
        console.error("Failed to connect to backend:", error);
        outputDiv.innerText = "Could not connect to the Python backend.";
    }
}