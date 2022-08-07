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
}

showDayAndTime();

function showWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#today-temperature");
  temperatureElement.innerHTML = temperature;

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

  // let precipitation = response.data.main.precipitaion;
  // let precipitationElement = document.querySelector("#precipitation");
  // precipitationElement.innerHTML = precipitation;

  // test
  console.log(response.data);

  showDayAndTime();
}

function searchCity(event) {
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

  let apiKey = "a49ef2d4228aac2d8121d1901ee44af7";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

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
