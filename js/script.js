const gamesPerPage = 5; // Adjust the number of games per page
let currentPage = 1;

const games = [
    "/games/jump.html"
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

function loadGame(game) {
    const homeScreen = document.getElementById("home");
    const gameContainer = document.getElementById("game-container");
    const gameFrame = document.getElementById("game-frame");

    homeScreen.style.display = "none";
    gameContainer.style.display = "block";
    gameFrame.src = `games/${game}`;
}

function goBack() {
    const homeScreen = document.getElementById("home");
    const gameContainer = document.getElementById("game-container");

    homeScreen.style.display = "block";
    gameContainer.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    displayGames(); // Initialize the game list and pagination
});
