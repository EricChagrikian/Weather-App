const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".inputUser"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weatherInput"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");
let MyCity = {};    
let MyCountry = {};  

let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3d485f11f9e38b982799d035833d8d41`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3d485f11f9e38b982799d035833d8d41`;
    fetchData();
}

function onError(error){
    // if any error occur while getting user location then we'll show it in infoText
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another 
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
    
}

function weatherDetails(info){
    if(info.cod == "404"){ // if user entered city name isn't valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        //getting required properties value from the whole weather information
    //    const city = MyCity.info.name;
    //    const country = MyCountry.info.sys.country;
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        // using custom weather icon according to the id which api gives to us
        if(id == 800){
            wIcon.src = "images/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "images/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "images/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "images/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "images/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "images/rain.svg";
        }
        
        //passing a particular weather info to a particular element
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});


// fetchForecast = function () {
// 	var endpoint =
// 		"https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=current,hourly,minutely,alerts&units=metric&appid=3d485f11f9e38b982799d035833d8d41";
// 	var forecastEl = document.getElementsByClassName("forecast");

// 	fetch(endpoint)
// 	.then(function (response) {
// 		if (200 !== response.status) {
// 			console.log(
// 				"Looks like there was a problem. Status Code: " + response.status
// 			);
// 			return;
// 		}

// 		forecastEl[0].classList.add('loaded');

// 		response.json().then(function (data) {
// 			var fday = "";
// 			data.daily.forEach((value, index) => {
// 				if (index > 0) {
// 					var dayname = new Date(value.dt * 1000).toLocaleDateString("en", {
// 						weekday: "long",
// 					});
// 					var icon = value.weather[0].icon;
// 					var temp = value.temp.day.toFixed(0);
// 					fday = `<div class="forecast-day">
// 						<p>${dayname}</p>
// 						<p><span class="ico-${icon}" title="${icon}"></span></p>
// 						<div class="forecast-day--temp">${temp}<sup>°C</sup></div>
// 					</div>`;
// 					forecastEl[0].insertAdjacentHTML('beforeend', fday);
// 				}
// 			});
// 		});
// 	})
// 	.catch(function (err) {
// 		console.log("Fetch Error :-S", err);
// 	});
// };