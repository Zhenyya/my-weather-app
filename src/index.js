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

function getForecast(coordinates) {
  let apiKey = "a49ef2d4228aac2d8121d1901ee44af7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
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

  getForecast(response.data.coord);
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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[day];
}

function formatDate(timestamp) {
  let datestamp = new Date(timestamp * 1000);
  let date = datestamp.getDate();
  let month = datestamp.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let fullDate = `${date}/${month}`;
  return fullDate;
}

function formatTime(timestamp) {
  let stamp = new Date(timestamp * 1000);
  let hours = stamp.getHours();
  let minutes = stamp.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function showForecast(response) {
  let dailyForecast = response.data.list;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  dailyForecast.forEach(function (forecastDay, index) {
    let time = formatTime(forecastDay.dt);

    if (time === "12:00") {
      forecastHTML =
        forecastHTML +
        `        
    <div class="col">
      <ul class="next-days">
        <li class="week-days">${formatDay(forecastDay.dt)}</li>
        <li class="week-date">${formatDate(forecastDay.dt)}</li>
        <li class="weather-icon">
          <img src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" alt="" width="54" />
        </li>
        <li class="max-temperature">${Math.round(forecastDay.main.temp)}°C</li>
      </ul>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
