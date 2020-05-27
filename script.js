var $searchForm = document.querySelector("#city-search");
var $searchInput = document.querySelector("#search-input");
var $weatherCard = document.querySelector("#current-weather");
var $weatherBody = document.querySelector("#weather-body");
var $forecastSection = document.querySelector("#forecast-section");
var $fivedayDiv = document.querySelector("#five-day");
var $historyCard = document.querySelector("#history-card");
var $searchHistory = document.querySelector("#search-history");
var $errorMsg = document.querySelector("#error-message");

// //api variables
var APIkey = "f002ec249c88e9e2ec5c7b98abe46449";
var urlStart = "https://api.openweathermap.org/data/2.5/";

var searchHistory = [];

//functions
function landingDisplay(){

  if (localStorage.getItem("searchHistory")) {
    updateHistory();
    searchHandler(searchHistory[searchHistory.length - 1]);
  }
}

//add to local storage
function addTerm(searchTerm){
  if(localStorage.getItem("searchHistory")){
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  }

searchHistory.push(searchTerm);

//remove search history starting from oldes search
if(searchHistory.length > 5){
  searchHistory.shift();
}

//store updated history
localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

//call function
updateHistory();
}

//update search history display from local
function updateHistory(){
  //clear div
  $searchHistory.textContent = "";
  //console.log(searchHistory);
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
 //loop array backwards to display most recent                                                 
  for (var j = searchHistory.length - 1; j >= 0; j --){                                                                   
    //console.log(searchHistory[j]);
    var $pastSearch = document.createElement("li");
    $pastSearch.textContent = searchHistory[j];
    $pastSearch.classList.add("list-group-item");
    $pastSearch.setAttribute("data-value", searchHistory[j]);

    $searchHistory.appendChild($pastSearch);
  }
  $historyCard.classList.remove("hide");
}

//call api search function and clear response divs
function searchHandler(searchTerm) {
  $errorMsg.classList.add("hide");
  $weatherCard.classList.add("hide");
  $forecastSection.classList.add("hide");
  $weatherBody.textContent = "";
  $fivedayDiv.textContent="";
  //uv ajax call
  currentweatherSearch(searchTerm);
  //call 5Day AJAX
  fivedaySearch(searchTerm);
}

//current weather api call
function currentweatherSearch(searchTerm) {

  var cityCoords;
  var weatherUrl = urlStart + "weather?q=" + searchTerm + "&units=imperial&APPID=" + APIkey;

  $.ajax({
    url: weatherUrl,
    method: "GET"
  
  }).then(function (weatherResponse) {
    //console.log(weatherResponse);
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

//add current weather response to page
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

  //div for humidity
  var $weatherHumid = document.createElement("div");
  $weatherHumid.textContent = "Humidity: " + (weatherResponse.main.humidity) + "%";

  //set div for wind
  var $weatherWind = document.createElement("div");
  $weatherWind.textContent = "Wind Speed: " + (weatherResponse.wind.speed) + " MPH";

  //add header icon
  $weatherHeader.appendChild($weatherIcon);

  //add everything to card
  $weatherBody.appendChild($weatherHeader);
  $weatherBody.appendChild($weatherTemp);
  $weatherBody.appendChild($weatherHumid);
  $weatherBody.appendChild($weatherWind);
}

//this adds the UV index reesponse to page!
function displayCurrentUV(uvResponse){
  //div for uv
  var $weatherUV = document.createElement("div");
  $weatherUV.textContent = "UV Index: " + (uvResponse.value);

  //add uv to the card
  $weatherBody.appendChild($weatherUV);
  //show current weather on card
  $weatherCard.classList.remove("hide");
}

//5day forecast response added to page
function displayForecast(forecastResponse){
  
  for (var i = 0; i < forecastResponse.cnt; i ++) {
    var responseRef = forecastResponse.list[i];
    //console.log(responseRef);
    //console.log(i);
    var responseDate = moment(responseRef.dt_txt);
    //console.log(responseDate);

    if (parseInt(responseDate.format("HH")) == 12){

      var $forecastCard = document.createElement("div");
      $forecastCard.classList.add( "card", "bg-primary", "col-10", "col-lg-2", "p-0", "mx-auto", "mt-3");

      var $cardBody = document.createElement("div");
      $cardBody.classList.add("card-body", "text-light", "p-2");

      var $forecastTitle = document.createElement("h5");
      $forecastTitle.classList.add("card-title");
      $forecastTitle.textContent = responseDate.format("MM/DD/YYYY");

      var $forecastIcon = document.createElement("img");
      $forecastIcon.setAttribute("src", "https://openweathermap.org/img/w/" + responseRef.weather[0].icon + ".png");
      $forecastIcon.setAttribute("alt", responseRef.weather[0].main + " - " + responseRef.weather[0].description);

      var $forecastTemp = document.createElement("div");
      $forecastTemp.textContent = "Temp: " + (responseRef.main.temp) + " F°";

      var $forecastHumid = document.createElement("div");
      $forecastHumid.textContent = "Humidity: " + (responseRef.main.humidity) + "%"; 

      //adding everything to cardbody
      $cardBody.appendChild($forecastTitle);
      $cardBody.appendChild($forecastIcon);
      $cardBody.appendChild($forecastTemp);
      $cardBody.appendChild($forecastHumid);

      $forecastCard.appendChild($cardBody);
      $fivedayDiv.appendChild($forecastCard);
    }
  }
  //console.log("done");
  $forecastSection.classList.remove("hide");
}

//on page load if there's local storage, display a search for the most recently searched term
landingDisplay();

//event listeners
//pass submitted text to other functions 
$searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var searchTerm = $searchInput.value.trim();
  if (!searchTerm) {
    return false;
  }
  //console.log(searchTerm);
  //send it to search weather api
  searchHandler(searchTerm);

  $searchInput.value = "";

  // add term to history []
  addTerm(searchTerm);

});

$searchHistory.addEventListener("click", function(event){
  event.preventDefault();
  var itemClicked = event.target;
  if(itemClicked.matches("li")){
    var clickSearch = itemClicked.getAttribute("data-value");
    //run a search when term clicked
    searchHandler(clickSearch);
    addTerm(clickSearch);
  }
});