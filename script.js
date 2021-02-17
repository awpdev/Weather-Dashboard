$( document ).ready(function() {

  let cityArr = []; 
  let initialized = false; 

  // Get weather data for city, renders elements to display the data
  function getData(cityName) {

    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + '8b4842f519c4ee13b11ada28c264ec1a';
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(OWMData) {
      let cityName = OWMData.name;
      let currTemp = converttoF(OWMData.main.temp);
      let currHumidity = OWMData.main.humidity;
      let windSpeed = (OWMData.wind.speed * 2.237).toFixed(1); // conversion to mph
      let lon = OWMData.coord.lon;
      let lat = OWMData.coord.lat;
      
      $('#city-name').text(cityName + ' (' + moment().format('l') + ') ');
      let currentWeatherIcon = $('<img>').attr('src', getWeatherIcon(OWMData.weather[0].main));
      $('#city-name').append(currentWeatherIcon);
      $('#current-temp').text('Temperature: ' + currTemp + ' °F');
      $('#current-humidity').text('Humidity: ' + currHumidity + '%');
      $('#wind-speed').text('Wind speed: ' + windSpeed + ' MPH');

      var fcQueryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&appid=' + '8b4842f519c4ee13b11ada28c264ec1a';
      $.ajax({
        url: fcQueryURL,
        method: 'GET'
      }).then(function(OWMFcData) {
        //console.log(OWMFcData);
        let uvIndex = OWMFcData.current.uvi;
        if (uvIndex <= 2) $('#uv-index').addClass('safe'); // green if UV index less than or equal to 2
        if (uvIndex >= 6) $('#uv-index').addClass('danger'); // red if UV index greater than or equal to 6
        $('#uv-index').text('UV Index: ' + uvIndex);
        var forecastEl = $('#forecast');
        forecastEl.text('5-Day Forecast:\n');
        $('#forecast-card-container').empty();
        for (let i = 1; i < 6; i++) {

          var forecastCardEl = $('<div>').addClass('card shadow-lg text-white bg-primary mx-auto mb-10 p-2 forecast-card');
          let futureWeatherIcon = $('<img>').attr('src', getWeatherIcon(OWMFcData.daily[i].weather[0].main)).attr('id', 'future-icon')
          forecastCardEl.text(moment().add(i, 'days').format('l') + '\nTemp: ' + converttoF(OWMFcData.daily[i].temp.day) + ' °F\nHumidity: ' + OWMFcData.daily[i].humidity);
          forecastCardEl.prepend(futureWeatherIcon);
          $('#forecast-card-container').append(forecastCardEl);
        
        }
      });
    });
  }

  $('#search-city').on('click', function(event) {
    event.preventDefault();
      
    var usersCityInput = $("#users-city-input").val().trim();
    if (usersCityInput === "") return;
    //console.log(usersCityInput);
    getData(usersCityInput);

    cityArr.push(usersCityInput);
    localStorage.setItem('cities', JSON.stringify(cityArr));

    init();
  });

  // Converts Kelvin to Fahrenheit
  function converttoF(t) {
    return ((t - 273.15) * 1.80 + 32).toFixed(1);
  }
  
  // returns source url for icon from weather conditions
  function getWeatherIcon(cnd) {
    switch(cnd) {
      case 'Clear': return 'http://openweathermap.org/img/wn/01d.png'; 
      case 'Clouds': return 'http://openweathermap.org/img/wn/03d.png';
      case 'Rain': return 'http://openweathermap.org/img/wn/09d.png';
      case 'Drizzle': return 'http://openweathermap.org/img/wn/10d.png';
      case 'Snow': return 'http://openweathermap.org/img/wn/13d.png';
      case 'Thunderstorm': return 'http://openweathermap.org/img/wn/11d.png';
      default: return 'http://openweathermap.org/img/wn/50d.png';
    }
  }

  // load buttons for previously searched for cities from local storage and get weather data for last searched city
  function init() {
    $('#city-buttons-container').empty();
    var storedCities = JSON.parse(localStorage.getItem('cities'));
    if (storedCities) {
      cityArr = storedCities;
      if (!initialized) getData(cityArr[cityArr.length - 1]);
    
      console.log(cityArr.length);
      
      for (let i = cityArr.length - 1; i >= 0; i--) {
        var buttonEl = $("<button class='list-group-item list-group-item-action' id=>").attr('type', 'button').attr('id', 'city-buttons')
        buttonEl.text(cityArr[i]);
        $('#city-buttons-container').append(buttonEl);
      }
      //$('#city-buttons-container').append(buttonsDiv);
    }
    initialized = true;
    
  } 

  init();
  

  $(function() {
    $(document).on("click", '#city-buttons', function(event) {
        event.preventDefault();
        getData($(this).text());
    });
  });
});