import { util } from "../../util";

export class WeatherManager {

    #weatherData;
    #currentWeatherLocation;
    #rawData;

    /**
     * Checks if there is a default location in localStorage.
     * If yes, makes a request.
     * If no, gets users current location, makes request and set it as default location.
     * @returns A promise with the resolved value as the weather data
     */
    fetchDataOnPageLoad() {

        const location = this.#getDefaultLocation();

        if (location) {

            return new Promise((resolve, reject) => {
                const lat = location[0];
                const lon = location[1];
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
                this.#makeRequest(url, resolve, reject);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.#getCurrentLocation()
                    .then(currentLocation => {
                        const lat = currentLocation[0];
                        const lon = currentLocation[1];
                        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
                        this.#makeRequest(url, resolve, reject);
                        this.setDefaultLocation(`${currentLocation[0]},${currentLocation[1]}`);
                    })
                    .catch(error => {
                        reject(error)
                    });
            });
        }
    }


    /**
     * 
     * @param {*} cityName 
     * @returns 
     */
    fetchDataOnFormSubmit(cityName) {

        return new Promise((resolve, reject) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
            this.#makeRequest(url, resolve, reject);
        });
    }

    /**
     * 
     * @returns 
     */
    fetchDataOnLocationButton() {

        return new Promise((resolve, reject) => {
            this.#getCurrentLocation()
                .then(currentLocation => {
                    const lat = currentLocation[0];
                    const lon = currentLocation[1];
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
                    this.#makeRequest(url, resolve, reject);
                    this.setDefaultLocation(`${currentLocation[0]},${currentLocation[1]}`);
                })
                .catch(error => {
                    reject(error)
                });
        });
    }

    /**
     * Fetches the default location in localStorage if it exist.
     * @returns An array containing coordinates of a location or null
     */
    #getDefaultLocation() {

        if (window.localStorage.getItem("defaultLocation")) {
            const defaultLocation = window.localStorage.getItem("defaultLocation").split(",");
            return defaultLocation;

        } else {
            return null;
        }
    }

    /**
     * Request for the user's current location.
     * @returns A promise with the resolved value as the user's current location
     */
    #getCurrentLocation() {

        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported"));
            } else {
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

    /**
     * Accepts a location as string.
     * Checks if it already exist.
     * If yes, location is not persisted.
     * If no, location is persisted in localStorage.
     * @param {String} location
     */
    setDefaultLocation(location) {

        if (!localStorage.getItem("defaultLocation")) {
            localStorage.setItem("defaultLocation", location);
        }
    }

    /**
     * 
     * @returns 
     */
    persistLocation() {

        if (localStorage.getItem("locations")) {
            const savedLocations = localStorage.getItem("locations").split(",");

            for (let i = 0; i < savedLocations.length; i += 2) {
                if (savedLocations[i] === this.#currentWeatherLocation) {
                    return null;
                }
            }
            savedLocations.push(`${this.#currentWeatherLocation},${Date()}`);
            localStorage.setItem("locations", savedLocations);
        }
        else {
            const location = `${this.#currentWeatherLocation},${Date()}`;
            localStorage.setItem("locations", location);
        }

        return this.#currentWeatherLocation;
    }

    /**
     * Makes an http request with the provides url.
     * The request is parsed into json.
     * Relevant data is extracted from json.
     * The resolved value is the weather data.
     * @param {String} url 
     * @param {Function} resolve 
     * @param {Function} reject 
     */
    #makeRequest(url, resolve, reject) {

        fetch(url)
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(data => {
                            this.#rawData = data
                            this.#extractWeatherData();
                            resolve(this.#weatherData);
                        })
                        .catch(error => reject(error));
                } else {
                    reject(new Error("Invalid Request"))
                }
            })
            .catch(error => reject(error));
    }

    /**
     * Extracts relevant data from response and format the data.
     */
    #extractWeatherData() {
        const weatherData = {
            id: this.#rawData.weather[0].icon,
            temperature: util.toNDecimalPlaces(util.toFarienhiet(this.#rawData.main.temp), 1),
            minTemperature: util.toNDecimalPlaces(util.toFarienhiet(this.#rawData.main.temp_min), 100),
            maxTemperature: util.toNDecimalPlaces(util.toFarienhiet(this.#rawData.main.temp_max), 100),
            feelsLike: util.toNDecimalPlaces(util.toFarienhiet(this.#rawData.main.feels_like), 100),
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
        this.#currentWeatherLocation = weatherData.city;
    }
}