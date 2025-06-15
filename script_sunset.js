let cityInput = document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
locationBtn = document.getElementById('locationBtn'),
api_key = 'fc786041daf84228c05aecb1a6ba76f3',
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
fiveDaysForecastCard = document.querySelector('.day-forecast'),
apiCard = document.querySelectorAll('.highlights .card')[0],
sunriseCard = document.querySelectorAll('.highlights .card')[1],
humidityVal = document.getElementById('humidityVal'),
pressureVal = document.getElementById('pressureVal'),
visibilityVal = document.getElementById('visibilityVal'),
windSpeedVal = document.getElementById('windSpeedValVal'),
feelsVal = document.getElementById('feelsVal'),
hourlyForecastCard = document.querySelector('.hourly-forecast'),
aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];



function getWeatherDetails(name, lat, lon, country, state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}`,
    days = [
        'Niedziela',
        'Poniedzialek',
        'Wtorek',
        'Sroda',
        'Czwartek',
        'Piatek',
        'Sobota'
    ],
    months = [
        'Styczen',
        'Luty',
        'Marzec',
        'Kwiecien',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpien',
        'Wrzesien',
        'Pazdziernik',
        'Listopad',
        'Grudzien'
    ];


    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML += `
            
        `;
        let {sunrise,sunset} = data.sys,
        {timezone, visibility} = data,
        {humidity, pressure, feels_like} = data.main,
        {speed} = data.wind,
        sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
        sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
        sunriseCard.innerHTML = `
                        <div class="card-head">
							<p>Wschód i zachód</p>
						</div>
						<div class="sunrise-sunset">
							<div class="item">
								<div class="icon">
									<i class="fa-light fa-sunrise fa-4x"></i>
								</div>
								<div>
									<p>Wschód</p>
									<h2>${sRiseTime}</h2>
								</div>
							</div>
							<div class="item">
								<div class="icon">
									<i class="fa-light fa-sunrise fa-4x"></i>
								</div>
								<div>
									<p>Zachód</p>
									<h2>${sSetTime}</h2>
								</div>
							</div>
						</div>
        `;
        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure}hPa`;
        visibilityVal.innerHTML = `${visibility / 1000}km`;
    }).catch(() => {
        
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for(i = 0; i <= 7; i++){
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'PM';
            if(hr < 12) a = 'AM';
            if(hr == 0) hr = 12;
            if(hr > 12) hr = hr - 12;
            hourlyForecastCard.innerHTML += `
                     
            `;
        }
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        fiveDaysForecastCard.innerHTML = '';
        for(i = 1; i < fiveDaysForecast.length; i++){
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                
            `;
        }
    }).catch(() => {
        
    });
}


function getCityCoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return;
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`)
    });
}


function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
    
        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state)
        }).catch(() => {
            ('Failed to fetch user coordinates');
        });
    }, error => {
        if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation permission denied. Please reset location permission to grant acces again');
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());