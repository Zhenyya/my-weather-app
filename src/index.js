function showDayAndTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let today = new Date();
  let day = days[today.getDay()];
  let hours = today.getHours();
  let minutes = today.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentDayAndTime = document.querySelector("#today-day-time");
  currentDayAndTime.innerHTML = `${day} ${hours}:${minutes}`;

  let date = today.getDate();
  let month = months[today.getMonth()];

  let currentDate = document.querySelector("#today-date");
  currentDate.innerHTML = `${date} ${month}`;
}

function showWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#today-temperature");
  temperatureElement.innerHTML = temperature;

  cityCelsiusTemperature = response.data.main.temp;

  let weatherDescription = response.data.weather[0].description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = weatherDescription;

  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = humidity;

  let windSpeed = Math.round(response.data.wind.speed);
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerHTML = windSpeed;

  let cityName = response.data.name;
  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = cityName;

  let weatherIcon = response.data.weather[0].icon;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  );

  tempCelsius.classList.add("active-unit");
  tempFahrenheit.classList.remove("active-unit");

  showDayAndTime();
}

function searchCity(city) {
  let apiKey = "a49ef2d4228aac2d8121d1901ee44af7";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function handleEvent(event) {
  event.preventDefault();
  let userInput = document.querySelector("#search-input");
  let city = userInput.value;

  let currentCity = document.querySelector("#current-city");
  if (userInput.value) {
    currentCity.innerHTML = userInput.value;
    userInput.value = "";
  } else {
    currentCity.innerHTML = null;
    alert("Please type a city");
  }

  searchCity(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleEvent);

function retrivePosition(position) {
  let apiKey = "a49ef2d4228aac2d8121d1901ee44af7";
  let units = "metric";
  let userLat = position.coords.latitude;
  let userLon = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=${apiKey}&units=${units}`;

  let currentPlace = position.name;
  axios.get(apiUrl).then(showWeather);
}

function showWeatherCurrentPlace() {
  navigator.geolocation.getCurrentPosition(retrivePosition);
  // alert("Current button was clicked");
}

let currentPlaceButton = document.querySelector("#current-button");
currentPlaceButton.addEventListener("click", showWeatherCurrentPlace);

searchCity("Lviv");

// Temperature units switch

let cityCelsiusTemperature = null;

function switchToFahrenheit(event) {
  event.preventDefault();

  let farenheitTemperature = Math.round(cityCelsiusTemperature * 1.8 + 32);

  let currentTemp = document.querySelector("#today-temperature");
  currentTemp.innerHTML = farenheitTemperature;

  tempCelsius.classList.remove("active-unit");
  tempFahrenheit.classList.add("active-unit");
}

let tempFahrenheit = document.querySelector("#tempFahrenheit");
tempFahrenheit.addEventListener("click", switchToFahrenheit);

function switchToCelsius(event) {
  event.preventDefault();

  let currentTemp = document.querySelector("#today-temperature");
  currentTemp.innerHTML = Math.round(cityCelsiusTemperature);

  tempCelsius.classList.add("active-unit");
  tempFahrenheit.classList.remove("active-unit");
}

let tempCelsius = document.querySelector("#tempCelsius");
tempCelsius.addEventListener("click", switchToCelsius);

// Display forecast

function showForecast() {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `        
    <div class="col-2">
      <ul class="next-days">
        <li class="week-days">${day}</li>
        <li class="weather-icon">
          <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="" width="54" />
        </li>
        <li class="max-temperature">21°C</li>
        <li class="min-temperature">12°C</li>
      </ul>
    </div>
    `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

showForecast();
