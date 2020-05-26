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

}

