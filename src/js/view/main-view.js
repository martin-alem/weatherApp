import { util } from "../../util";

export class View {

    #bookMarkButton = document.querySelector(".btn-modal");
    #closeButton = document.querySelector(".close");

    #tempValue = document.querySelector(".temp-value");
    #image = document.querySelector(".weather-image");
    #extraValue = document.querySelectorAll(".extra-value");

    #value = document.querySelector(".value");
    #location = document.querySelector(".location");
    #description = document.querySelector(".description");
    #feelsLike = document.querySelector(".feels_like");
    #pressure = document.querySelector(".pressure");
    #windSpeed = document.querySelector(".wind_speed");
    #minTemp = document.querySelector(".min_temp");
    #humidity = document.querySelector(".humidity");
    #long = document.querySelector(".long");
    #visibility = document.querySelector(".visibility");
    #lat = document.querySelector(".lat");
    #maxTemp = document.querySelector(".max_temp");

    #overlay = document.querySelector(".overlay");
    #modal = document.querySelector(".modal");

    #submitForm = document.querySelector(".search_input");
    #submitButton = document.querySelector(".btn-submit");

    #error = document.querySelector(".error");


    /**
     *  Access dom elemets and adds/removes animate class
     */
    renderOrClearPreview() {
        this.#tempValue.classList.toggle("animate");
        this.#image.classList.toggle("animate");
        this.#extraValue.forEach(node => {
            node.classList.toggle("animate");
        });
    }

    /**
     * 
     * @param {*} data 
     */
    render(data) {

        this.#value.textContent = data.temperature;
        this.#location.textContent = `${data.city}, ${data.country}`;
        this.#description.textContent = data.description;
        this.#feelsLike.textContent = data.feelsLike;
        this.#pressure.textContent = data.pressure;
        this.#windSpeed.textContent = data.windSpeed;
        this.#minTemp.textContent = data.minTemperature;
        this.#humidity.textContent = data.humidity;
        this.#long.textContent = data.coords.lon;
        this.#visibility.textContent = data.visibility;
        this.#lat.textContent = data.coords.lat;
        this.#maxTemp.textContent = data.maxTemperature;

    }

    /**
     * Sets up eventListeners and provides required callback
     * @param {object} eventHandles 
    */
    eventListeners(eventHandles) {

        this.#bookMarkButton.addEventListener("click", this.#openModal);
        this.#closeButton.addEventListener("click", this.#closeModal);
        this.#submitButton.addEventListener("click", eventHandles.handleFormSubmit)
        window.addEventListener("load", eventHandles.handlePageLoad);
    }

    /**
     * 
     * @returns 
     */
    getFormInput() {
        try {
            return util.validateCityName(this.#submitForm.value);
        } catch (error) {
            // display error message
            console.log(error);
            return null;
        }
    }

    /**
     * 
     * @param {*} errorMessage 
     */
    renderError(errorMessage) {

        this.#error.textContent = errorMessage;
        this.#error.classList.toggle("clear");
        this.renderOrClearPreview();

        setTimeout(() => {
            this.#error.classList.toggle("clear");
        }, 3000);
    }

    /**
     * 
     */
    #openModal() {
        this.#overlay.style.visibility = "visible";
        this.#modal.style.visibility = "visible";
    }

    /**
     * 
     */
    #closeModal() {
        this.#overlay.style.visibility = "hidden";
        this.#modal.style.visibility = "hidden";
    }
}