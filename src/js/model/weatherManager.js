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
                        this.setDefaultLocationOnPageLoad(currentLocation);
                    })
                    .catch(error => {
                        reject(error)
                    });
            });
        }
    }


    /**
     * Makes a request with provides cityname and returns a promise
     * @param {String} cityName 
     * @returns A promise with resolved value as weather data
     */
    fetchDataOnFormSubmit(cityName) {

        return new Promise((resolve, reject) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
            this.#makeRequest(url, resolve, reject);
        });
    }

    /**
     * Makes a request with coordinates and returns a promise
     * @returns A promise with resolved value as weather data
     */
    fetchDataOnLocationButton() {

        return new Promise((resolve, reject) => {
            this.#getCurrentLocation()
                .then(currentLocation => {
                    const lat = currentLocation[0];
                    const lon = currentLocation[1];
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aac304093f797550435d2ed3dad3f25b&units=metric`;
                    this.#makeRequest(url, resolve, reject);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Fetches the default location in localStorage if it exist.
     * @returns An array containing coordinates of a location or null
     */
    #getDefaultLocation() {

        if (localStorage.getItem("defaultLocation")) {
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
                }, () => {
                    reject(new Error("Location is needed to continue"));
                });
            }
        });
    }

    /**
     * Accepts a location as Array.
     * If default location does not exist.
     * Current location is persisted
     * @param {Array} location
     */
    setDefaultLocationOnPageLoad(coord) {

        if (!localStorage.getItem("defaultLocation")) {
            const location = `${coord[0]},${coord[1]}`;
            localStorage.setItem("defaultLocation", location);
        }
    }


    /**
     * Makes sure default location already exist and weatherData is not undefine.
     * If No, Error is thrown.
     * If Yes, new location is persisted in localStorage.
     */
    setDefaultLocationOnButtonClick() {

        if (localStorage.getItem("defaultLocation") && this.#weatherData) {
            const location = `${this.#weatherData.coords.lat},${this.#weatherData.coords.lon}`;
            localStorage.removeItem("defaultLocation");
            localStorage.setItem("defaultLocation", location);
        } else {
            throw new Error("Please reload your browser");
        }
    }

    /**
     * Persist the current weather location to local storage if it does not already exist
     * @returns Current Weather Location or null
     */
    persistLocation() {

        if (localStorage.getItem("locations") && this.#currentWeatherLocation) {
            const savedLocations = localStorage.getItem("locations").split(",");

            for (let i = 0; i < savedLocations.length; i += 2) {
                if (savedLocations[i] === this.#currentWeatherLocation) {
                    return null;
                }
            }
            savedLocations.push(`${this.#currentWeatherLocation},${Date()}`);
            localStorage.setItem("locations", savedLocations);
        }
        else if(this.#currentWeatherLocation) {
            const location = `${this.#currentWeatherLocation},${Date()}`;
            localStorage.setItem("locations", location);
        }

        return this.#currentWeatherLocation;
    }

    /**
     * Retrieves saved location from local storage
     * @returns An array of location objects
     */
    retrieveSavedLocation() {
        const locations = [];
        let location = {};

        if (localStorage.getItem("locations")) {
            const savedLocations = localStorage.getItem("locations").split(",");

            for (let i = 0; i < savedLocations.length; i += 2) {
                location["name"] = savedLocations[i];
                location["date"] = savedLocations[i + 1];
                locations.push(location);
                location = {};

            }
        }
        return locations;
    }

    /**
     * Find a location by name and deletes if request was sent by delete action
     * @param {Sttring} cityName 
     */
    deleteSavedLocation(cityName) {

        const locations = [];

        if (localStorage.getItem("locations")) {
            const savedLocations = localStorage.getItem("locations").split(",");

            for (let i = 0; i < savedLocations.length; i += 2) {

                if (cityName !== savedLocations[i]) {
                    locations.push(`${savedLocations[i]}, ${savedLocations[i + 1]}`);
                }
            }
        }

        localStorage.setItem("locations", locations);
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
                        .catch(() => reject(new Error("Response could not be parsed to json")));
                } else {
                    reject(new Error("Invalid Request"))
                }
            })
            .catch(() => reject(new Error("Request could not be made")));
    }

    /**
     * Extracts relevant data from response and format the data.
     */
    #extractWeatherData() {
        const weatherData = {
            icon: this.#rawData.weather[0].icon,
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