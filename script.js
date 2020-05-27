//variables 
var $search = document.querySelector("#search-city");
var $searchInput = document.querySelector("#input-search");
var $weatherCard = document.querySelector("#current-weather");
var $weatherBody = document.querySelector("#weather-body");
var $forecast = document.querySelector("#forecast-section");
var $fiveDays = document.querySelector("#five-day");
var $history = document.querySelector("#card-history");
var $searchHistory = document.querySelector("#search-history"); 

//api variables
var APIkey = " f002ec249c88e9e2ec5c7b98abe46449";
var urlStart = "https://api.openweathermap.org/data/2.5/";

var $searchHistory = [];

//functions 
function landingDisplay(){
    //diaplay most recent forecast
    if (localStorage.getItem("searchHistory")) {
        updateHistory();
        searchHandler("searchHistory"[searchHistory.length -1]);
    }
}

//add to local storage 
function addSearch (searchTerm){
    if(localStorage.getItem("searchHistory")){
        //get item and add to searchHistory
        searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    }
searchHistory.push(searchTerm);
//remove search history starting from oldest search
if(searchHistory.length > 5){
    searchHistory.shift();
}
//store updated history
localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

//call  function 
updateHistory();
}

//update search history display from local
function updateHistory(){
    //clear div
    $searchHistory.textContent = "";
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")); 
    //loop array backwards to display most recent
    for (var j = searchHistory.length -1; j >= 0; j --){
        var $pastSearch = document.createElement("li");
        $pastSearch.textContent = searchHistory [j];
        $pastSearch.classList.add("list-group-item");
        $pastSearch.setAttribute("data-value", searchHistory[j]);

        $searchHistory.appendChild($pastSearch);
    }
    $history.classList.remove("hide");
}
//call api search function and clear response divs
function searchHandler(searchTerm) {
    $weatherCard.classList.add("hide");
    $forecast.classlist("hide");
    $weatherBody.textContent = "";
    $fiveDays.textContent = "";
    //uv ajax request
    currentweatherSearch(searchTerm);
    fivedaySearch(searchTerm);
}
//current weather api call
function currentweatherSearch(searchTerm); {
    var cityCoords;
    var weatherUrl = urlStart + "weather?q=" + searchTerm + "&units=imperial&APPID=" + APIkey;

    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(function (weatherResponse){
        //call function to create elements displaying response
        displayCurrentweather(weatherResponse);

        //coordinates sent to uv api call
        cityCoords = weatherResponse.coord;
        currentUVSearch(cityCoords);
    });
}

//call current UV API
function currentUVSearch(cityCoords) {
    //coordinate string for api call parameters
    var searchCoords = "lat=" + cityCoords.lat + "&lon=" + cityCoords.lon;
  
    var uvUrl = urlStart + "uvi?" + searchCoords + "&APPID=" + APIkey;
  
    $.ajax({
      url: uvUrl,
      method: "GET"
    }).then(function(uvResponse){
      //call function to create html element for uv response:
      displayCurrentUV(uvResponse);
    });
  
  }
  
  //call forecast API
function fivedaySearch(searchTerm) {

    var forecastUrl = urlStart + "forecast?q=" + searchTerm + "&units=imperial&APPID=" + APIkey;
  
    $.ajax({
      url: forecastUrl,
      method: "GET"
    }).then(function(forecastResponse){
      //call function to create html elements for forecast response:
      displayForecast(forecastResponse);
    });
  
  }
  
  //add current weather response to page:
function displayCurrentweather(weatherResponse){
    //console.log(weatherResponse);
    var $weatherHeader = document.createElement("h1");
  
    var timeNow = moment();
    var currentDate = "(" + timeNow.format("MM/DD/YYYY") + ")";
  
    $weatherHeader.textContent = weatherResponse.name + " " + currentDate;
    
     //display weather icon
  var $weatherIcon = document.createElement("img");
  $weatherIcon.setAttribute("src", "https://openweathermap.org/img/w/" + weatherResponse.weather[0].icon + ".png")
  $weatherIcon.setAttribute("alt", weatherResponse.weather[0].main + " - " + weatherResponse.weather[0].description);

  //temp div
  var $weatherTemp = document.createElement("div");
  $weatherTemp.textContent = "Temperature: " + (weatherResponse.main.temp) + " F°";