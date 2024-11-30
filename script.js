// Your OpenWeatherMap API key
const API_KEY = "19f0bb5e23d25ca97117590e606428d9";

// Fetch weather data for the entered county in Kenya
async function fetchWeather() {
    const searchInput = document.getElementById("search").value.trim();
    const spinner = document.getElementById("spinner");

    if (!searchInput) {
        alert("Please enter a county name (e.g., Nairobi).");
        return;
    }

    // Show loading spinner
    spinner.style.display = "block";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput},KE&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        spinner.style.display = "none";

        if (response.ok) {
            updateWeather(data);
        } else {
            alert("County not found. Please try again.");
        }
    } catch (error) {
        spinner.style.display = "none";
        alert("An error occurred while fetching the weather data. Please try again.");
    }
}

// Update the UI with fetched weather data
function updateWeather(data) {
    // Update current weather information
    document.getElementById("city-name").textContent = data.city.name;
    document.getElementById("temperature").textContent =
        Math.round(data.list[0].main.temp) + "°C";
    document.getElementById("wind").textContent =
        "Wind: " + Math.round(data.list[0].wind.speed) + " km/h";
    document.getElementById("description").textContent =
        data.list[0].weather[0].description;
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;

    // Update local time
const timezoneOffset = data.city.timezone; // Timezone offset in seconds
const localTime = new Date(Date.now() + timezoneOffset * 1000);

document.getElementById("local-time").textContent = `Local Time: ${localTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // Add seconds for a more detailed time display
    hour12: false, // Use 24-hour time format; change to true for 12-hour format
})}`;


    // Hourly forecast
    const hourlyContainer = document.getElementById("hourly");
    hourlyContainer.innerHTML = "";
    for (let i = 0; i < 12; i++) {
        const item = data.list[i];
        hourlyContainer.innerHTML += `
            <div class="forecast-item">
                <p>${new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather">
                <p>${Math.round(item.main.temp)}°C</p>
            </div>
        `;
    }

    // 7-day forecast (daily data filtered by noon)
    const dailyContainer = document.getElementById("daily");
    dailyContainer.innerHTML = "";
    const dailyData = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
    dailyData.forEach((item) => {
        dailyContainer.innerHTML += `
            <div class="forecast-item">
                <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather">
                <p>${Math.round(item.main.temp)}°C</p>
            </div>
        `;
    });
}

// Display hourly forecast
function showHourly() {
    document.getElementById("hourly").style.display = "block";
    document.getElementById("daily").style.display = "none";
}

// Display 7-day forecast
function showDaily() {
    document.getElementById("hourly").style.display = "none";
    document.getElementById("daily").style.display = "block";
}

// Expand and collapse functionality for hourly/daily forecasts
const toggleDropdown = (dropdownId) => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }

    // Ensure the parent container remains scrollable
    document.querySelector(".weather-container").style.overflowY = "auto";
};

// Example usage
document.getElementById("hourly-button").addEventListener("click", () => toggleDropdown("hourly-forecast"));
document.getElementById("daily-button").addEventListener("click", () => toggleDropdown("daily-forecast"));
