export class WeatherManager{

    #weatherData;
    #currentWeatherLocation;
    #rawData;

    fetchDataOnPageLoad(){

        const location = this.#getDefaultLocation();

        if(location){
            this.#getWeatherData({type: "pageLoad", data: location});
        }
        else{
            this.#getCurrentLocation()
            .then(currentLocation => {
                this.#getWeatherData({type: "pageLoad", data: currentLocation});
                this.setDefaultLocation(`${currentLocation[0]},${currentLocation[1]}`);
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    #getDefaultLocation(){

        if(window.localStorage.getItem("defaultLocation")){
            const defaultLocation = window.localStorage.getItem("defaultLocation").split(",");
            return defaultLocation;

        }else{
            return null;
        }
    }

    // gets the user current location
    #getCurrentLocation(){

        return new Promise((resolve, reject) => {

            if(!navigator.geolocation){
                reject(new Error("Geolocation is not supported"));
            }
            else{
                navigator.geolocation.getCurrentPosition(position => {
                    const location = [];
                    location.push(position.coords.latitude, position.coords.longitude);
                    resolve(location);
                }, error => {
                    reject(error);
                })
            }
        });
    }

    //Recieves a location as string an saves in local storage
    setDefaultLocation(location){

        if(!localStorage.getItem("defaultLocation")){
            localStorage.setItem("defaultLocation", location);
        }
    }

    #getWeatherData(request){

        if(request.type === "pageLoad"){
            const lat = request.data[0];
            const lon = request.data[1];
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
            
            this.#makeRequest(url);
        }

        else if(request.type === "submitForm"){
            const city = request.data;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
            
            this.#makeRequest(url);
        }
    }

    #makeRequest(url){

        fetch(url)
        .then(response => {
            if(response.ok){
                response.json()
                .then(data => {
                    this.#rawData = data
                    this.#extractWeatherData();
                })
                .catch(error => console.log("Could not convert to json: "+ error));
            }
        })
        .catch(error => console.log("Request Failed: "+error));
    }

    #extractWeatherData(){
        const weatherData = {
            temparature: this.#toNDecimalPlaces(this.#toFarienhiet(this.#rawData.main.temp), 10),
            minTemperature: this.#toNDecimalPlaces(this.#toFarienhiet(this.#rawData.main.temp_min), 100),
            maxTemperature: this.#toNDecimalPlaces(this.#toFarienhiet(this.#rawData.main.temp_max),100),
            feelsLike: this.#toNDecimalPlaces(this.#toFarienhiet(this.#rawData.main.feels_like),100),
            pressure: this.#rawData.main.pressure,
            humidity: this.#rawData.main.humidity,
            description: this.#rawData.weather[0].description,
            visibility: this.#rawData.visibility,
            windSpeed: this.#rawData.wind.speed,
            country: this.#rawData.sys.country,
            city: this.#rawData.name,
            coords: this.#rawData.coord

        }

        this.#weatherData = weatherData;
        console.log(this.#weatherData);
    }

    #toFarienhiet(celsius){
        return (celsius * (9/5)) + 32;
    }

    #toNDecimalPlaces(number, decimalPlaces){

        const tmpNum = Number.parseInt(number * decimalPlaces);
        return tmpNum / decimalPlaces;
    }
}