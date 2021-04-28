const bookMarkButton = document.querySelector(".btn-modal");
const closeButton = document.querySelector(".close");

const tempValue = document.querySelector(".temp-value");
const image = document.querySelector(".weather-image");
const extraValue = document.querySelectorAll(".extra-value");

const value = document.querySelector(".value");
const location = document.querySelector(".location");
const description = document.querySelector(".description");
const feelsLike = document.querySelector(".feels_like");
const pressure = document.querySelector(".pressure");
const windSpeed = document.querySelector(".wind_speed");
const minTemp = document.querySelector(".min_temp");
const humidity = document.querySelector(".humidity");
const long = document.querySelector(".long");
const visibility = document.querySelector(".visibility");
const lat = document.querySelector(".lat");
const maxTemp = document.querySelector(".max_temp");

export const overlay = document.querySelector(".overlay");
export const modal = document.querySelector(".modal");


/**
 * Access dom elemets and adds/removes animate class
 */
export function renderOrClearPreview() {
    tempValue.classList.toggle("animate");
    image.classList.toggle("animate");
    extraValue.forEach(node => {
        node.classList.toggle("animate");
    });
}

export function render(data) {

    value.textContent = data.temperature;
    location.textContent = `${data.city}, ${data.country}`;
    description.textContent = data.description;
    feelsLike.textContent = data.feelsLike;
    pressure.textContent = data.pressure;
    windSpeed.textContent = data.windSpeed;
    minTemp.textContent = data.minTemperature;
    humidity.textContent = data.humidity;
    long.textContent = data.coords.lon;
    visibility.textContent = data.visibility;
    lat.textContent = data.coords.lat;
    maxTemp.textContent = data.maxTemperature;

}

/**
 * Sets up eventListeners and provides required callback
 * @param {object} eventHandles 
 */
export function eventListeners(eventHandles) {

    bookMarkButton.addEventListener("click", eventHandles.openModal);
    closeButton.addEventListener("click", eventHandles.closeModal);
    window.addEventListener("load", eventHandles.handlePageLoad);
}