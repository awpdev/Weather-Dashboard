$( document ).ready(function() {

  let cityArr = [];

  function getData(cityName) {
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + '8b4842f519c4ee13b11ada28c264ec1a';

    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(OWMData) {
      console.log(OWMData);
      //clear();
      if (OWMData) {
        for (let i = 0; i < cityArr.length; i++) {
          if (usersCityInput === cityArr[i]) break;
            //else
              
        }
          /*
          cityArr.push(usersCityInput);
          localStorage.setItem("cities", JSON.stringify(cityArr)); */
  /*
            var li = document.createElement("li");
          li.textContent = todo;
          li.setAttribute("data-index", i);
            for (let i = 0; i < cityArr.length; i++) {
              $("#searched-cities-container").append();
            }*/
      }
      let cityName = OWMData.name;
      let currTemp = converttoF(OWMData.main.temp);
      let currHumidity = OWMData.main.humidity;
      let windSpeed = (OWMData.wind.speed * 2.237).toFixed(1); // conversion to mph
      let lon = OWMData.coord.lon;
      let lat = OWMData.coord.lat;
      //var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + "8b4842f519c4ee13b11ada28c264ec1a";
      /*$.ajax({
        url: uvQueryURL,
        method: "GET"
      }).then(function(OWMUvData) {
        console.log(OWMUvData.value);
        var uvIndex = OWMUvData.value;
        if (uvIndex < 3) {
        }
        $("#uv-index").text("UV Index: " + uvIndex);
      });*/
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
        console.log(OWMFcData);
        let uvIndex = OWMFcData.current.uvi;
        if (uvIndex <= 2) $('#uv-index').addClass('safe');
        if (uvIndex >= 6) $('#uv-index').addClass('danger');
        $('#uv-index').text('UV Index: ' + uvIndex);
        //$('#uvi').text(uvIndex);
        var forecastEl = $('#forecast');
        forecastEl.text('5-Day Forecast:\n');
        for (let i = 1; i < 6; i++) {

          var forecastCardEl = $('<div>').addClass('card shadow-lg text-white bg-primary mx-auto mb-10 p-2 forecast-card');
          let futureWeatherIcon = $('<img>').attr('src', getWeatherIcon(OWMFcData.daily[i].weather[0].main)).attr('id', 'future-icon')
          forecastCardEl.text(moment().add(i, 'days').format('l') + '\nTemp: ' + converttoF(OWMFcData.daily[i].temp.day) + ' °F\nHumidity: ' + OWMFcData.daily[i].humidity);
          forecastCardEl.prepend(futureWeatherIcon);
          $('#forecast-card-container').append(forecastCardEl);
        
        }
      });
    /*
            var gifDiv = $("<div>");

            var rating = results[i].rating;

            var p = $("<p>").text("Rating: " + rating);

            var personImage = $("<img>");
            personImage.attr("src", results[i].images.fixed_height.url);

            gifDiv.prepend(p);
            gifDiv.prepend(personImage);

            $("#forecast-section").append();
          }
          */
    });
  }
  /*
  $(".search-city").on("click", function(event) {
    event.preventDefault();
      
    let usersCityInput = $("#users-city-name").val().trim();
    if (usersCityInput === "") return;
    let textContent = $(this).siblings("input").val();
    cityArr.push(textContent);
    localStorage.setItem('cities', JSON.stringify(cityArr));

    getData(usersCityInput);

    loadButtons();
  });
*/
  // Converts Kelvin to Fahrenheit
  function converttoF(t) {
    return ((t - 273.15) * 1.80 + 32).toFixed(1);
  }

  // Clears the right side of the screen
  function clear() {
    $('#city-name').empty();
    $('#current-temp').empty();
    $('#current-humidity').empty();
    $('#wind-speed').empty();
    $('#uv-index').empty();
    $('#forecast-section').empty();
  }
  
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
/*
  // load buttons for previously searched for cities from local storage
  function loadButtons() { 
    $('#city-buttons-container').empty();
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    console.log(storedCities);
    if (storedCities) {
      cityArr = storedCities;
    }
    let buttonsDiv = $('<div class list-group');
    for (let i = cityArr.length - 1; i < 0; i--) {
      let buttonEl = $('<button>').attr('type', 'button');
      buttonEl.addClass('list-group-item list-group-item-action').text(cityArr[i]);
      buttonsDiv.append(buttonEl);
    }
    ('#city-buttons-container').append(buttonsDiv);
    
  } */
  getData('Boca Raton');
});