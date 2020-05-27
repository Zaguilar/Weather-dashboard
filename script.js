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
        url: weatherUrl
    })
}