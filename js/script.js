const gamesPerPage = 5; // Adjust the number of games per page
let currentPage = 1;

const games = [
    "jump.html",
    "balloon.html",
    "solarsystem.html"
];

function displayGames() {
    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    const gamesOnPage = games.slice(start, end);

    // Display games
    const gamesList = document.getElementById("games-list");
    gamesList.innerHTML = ""; // Clear existing games
    gamesOnPage.forEach(game => {
        const gameButton = document.createElement("button");
        gameButton.textContent = `Play ${game}`;
        gameButton.onclick = () => loadGame(game);
        gamesList.appendChild(gameButton);
    });

    // Update pagination
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Clear existing pagination

    const totalPages = Math.ceil(games.length / gamesPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("a");
        pageLink.textContent = i;
        pageLink.href = "#";
        pageLink.onclick = (e) => {
            e.preventDefault();
            currentPage = i;
            displayGames();
        };

        const pageItem = document.createElement("li");
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
}

function displayError(error, errorInfo) {
    const gameFrame = document.getElementById("game-frame");
    const errorHTML = `
        <div style="padding: 20px; font-family: monospace; background: #ffebee; border: 2px solid #ef5350; border-radius: 4px; margin: 20px;">
            <h2 style="color: #c62828; margin-top: 0;">⚠️ Game Loading Error</h2>
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
                <strong>Error:</strong> ${error.message || error}<br>
                ${error.stack ? `<strong>Stack Trace:</strong><br><pre>${error.stack}</pre>` : ''}
                ${errorInfo ? `<strong>Additional Info:</strong><br>${errorInfo}` : ''}
            </div>
            <button onclick="goBack()" style="background: #ef5350; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                Return to Game Selection
            </button>
        </div>
    `;
    
    // Create a temporary container to hold the error content
    const errorContainer = document.createElement('div');
    errorContainer.innerHTML = errorHTML;
    
    // Clear the iframe and append the error display
    gameFrame.parentNode.replaceChild(errorContainer, gameFrame);
}

function loadGame(game) {
    const homeScreen = document.getElementById("home");
    const gameContainer = document.getElementById("game-container");
    const gameFrame = document.getElementById("game-frame");

    homeScreen.style.display = "none";
    gameContainer.style.display = "block";

    // Create a new iframe each time to ensure clean loading
    const newFrame = document.createElement('iframe');
    newFrame.id = 'game-frame';
    newFrame.style = gameFrame.style.cssText; // Copy existing styles
    
    // Add error handling for the iframe
    newFrame.onerror = (error) => {
        displayError(error, `Failed to load game: ${game}`);
    };

    // Handle errors within the iframe content
    newFrame.onload = () => {
        try {
            // Inject error handling into the iframe
            newFrame.contentWindow.onerror = (msg, url, lineNo, columnNo, error) => {
                const errorInfo = `
                    Location: ${url}<br>
                    Line: ${lineNo}<br>
                    Column: ${columnNo}
                `;
                displayError(error || msg, errorInfo);
                return true; // Prevents the error from propagating
            };

            // Inject unhandled promise rejection handling
            newFrame.contentWindow.onunhandledrejection = (event) => {
                displayError(event.reason, 'Unhandled Promise Rejection');
                return true;
            };
        } catch (error) {
            displayError(error, 'Error while setting up error handlers');
        }
    };

    // Replace the existing iframe
    gameFrame.parentNode.replaceChild(newFrame, gameFrame);
    
    // Set the src after adding error handlers
    try {
        newFrame.src = `games/${game}`;
    } catch (error) {
        displayError(error, `Failed to load game: ${game}`);
    }
}

function goBack() {
    const homeScreen = document.getElementById("home");
    const gameContainer = document.getElementById("game-container");
    const gameFrame = document.getElementById("game-frame");

    // Restore the iframe if it was replaced with error display
    if (!(gameFrame instanceof HTMLIFrameElement)) {
        const newFrame = document.createElement('iframe');
        newFrame.id = 'game-frame';
        gameFrame.parentNode.replaceChild(newFrame, gameFrame);
    }

    homeScreen.style.display = "block";
    gameContainer.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    displayGames(); // Initialize the game list and pagination
});
