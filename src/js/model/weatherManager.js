export class WeatherManager{

    #weather;
    #currentWeatherLocation;

    fetchDataOnPageLoad(){

        const location = this.getDefaultLocation();

        if(location){
            this.getWeatherData({type: "pageLoad", data: location});
        }
        else{
            this.getCurrentLocation()
            .then(currentLocation => {
                this.getWeatherData({type: "pageLoad", data: currentLocation});
                this.setDefaultLocation(`${currentLocation[0]},${currentLocation[1]}`);
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    getDefaultLocation(){

        if(window.localStorage.getItem("defaultLocation")){
            const defaultLocation = window.localStorage.getItem("defaultLocation").split(",");
            return defaultLocation;

        }else{
            return null;
        }
    }

    // gets the user current location
    getCurrentLocation(){

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

    getWeatherData(request){

        if(request.type === "pageLoad"){
            const lat = request.data[0];
            const lon = request.data[1];
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aac304093f797550435d2ed3dad3f25b`;

            fetch(url).then(result => {
                if(result.ok){
                    result.json().then(data => console.log(data))

                }else{
                    console.log("Error")
                }
            })
        }

        else if(request.type === "submitForm"){
            const city = request.data;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=aac304093f797550435d2ed3dad3f25b`;
        }
    }


}