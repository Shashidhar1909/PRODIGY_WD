const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const weatherInfo = document.getElementById('weatherInfo');
const locationName = document.getElementById('locationName');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const cloudiness = document.getElementById('cloudiness');

function showLoading() {
    loadingMessage.style.display = 'flex';
    errorMessage.style.display = 'none';
    weatherInfo.classList.add('hidden');
}

function hideLoading() {
    loadingMessage.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.classList.add('hidden');
}

function showWeatherInfo() {
    weatherInfo.classList.remove('hidden');
}

function updateWeatherUI(data) {
    locationName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDescription.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    cloudiness.textContent = `${data.clouds.all}%`;
}

async function fetchWeatherByCoords(latitude, longitude) {
    try {
        showLoading();
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        
        if (data.cod === 200) {
            updateWeatherUI(data);
            showWeatherInfo();
        } else {
            showError('Failed to fetch weather data');
        }
    } catch (err) {
        showError('Failed to fetch weather data');
    } finally {
        hideLoading();
    }
}

async function fetchWeatherByCity(city) {
    try {
        showLoading();
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.cod === 200) {
            updateWeatherUI(data);
            showWeatherInfo();
        } else {
            showError('City not found');
        }
    } catch (err) {
        showError('Failed to fetch weather data');
    } finally {
        hideLoading();
    }
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    }
});

window.addEventListener('load', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                showError('Could not get location.');
            }
        );
    }
});
