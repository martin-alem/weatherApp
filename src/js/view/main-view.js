import { util } from "../../util";

export class View {

    #bookMarkButton = document.querySelector(".btn-modal");
    #closeButton = document.querySelector(".close");

    #tempValue = document.querySelector(".temp-value");
    #image = document.querySelector(".weather-image");
    #weatherImage = document.querySelector(".image");
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

    overlay = document.querySelector(".overlay");
    modal = document.querySelector(".modal");

    #submitForm = document.querySelector(".search_input");
    #submitButton = document.querySelector(".btn-submit");
    #locationButton = document.querySelector(".btn-location");
    #likeButton = document.querySelector(".btn-like");
    #cardContainer = document.querySelector(".card-container");
    #buttonSave = document.querySelector(".btn-save");
    #form = document.querySelector("#search-form");

    #notification = document.querySelector(".notification");


    /**
     *  Access dom elemets and adds/removes animate class
     */
    renderOrClearPreview() {
        const weatherData = Array.from(this.#extraValue).concat(this.#tempValue, this.#image);
        weatherData.forEach(node => {
            node.classList.toggle("animate");
        });
    }

    /**
     * Renders html elements with data from data
     * @param {object} data 
     */
    render(data) {

        this.#weatherImage.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
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
     * Builds and renders cards elements with data from data
     * @param {object} data 
     * @param {Function} handler1 
     * @param {Function} handler2 
     */
    renderCard(data, handler1, handler2) {

        data.forEach(element => {
            const card = document.createElement("div");
            card.classList.add("card");


            const heading = document.createElement("h3");
            heading.classList.add("name");
            heading.textContent = element.name;


            const paragraph = document.createElement("p");
            paragraph.classList.add("data");
            paragraph.textContent = element.date;

            const span = document.createElement("span");
            const i = document.createElement("i");
            i.classList.add("fa", "fa-trash");
            i.style.fontSize = "24px";

            span.appendChild(i);

            card.append(heading, paragraph, span);

            this.#cardContainer.insertAdjacentElement("beforeend", card);

            heading.addEventListener("click", (e) => {
                handler1(e.target.textContent);
            });
            span.addEventListener("click", (e) => {
                const t = e.target.parentElement.parentElement;
                this.#cardContainer.removeChild(t);
                handler2(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
            });
        });
    }


    /**
     * Delets all nodes from card container with class = card
     */
    clearNodes() {

        document.querySelectorAll(".card").forEach(element => {
            element.remove();
        });
    }

    /**
     * Sets up eventListeners and provides required callback
     * @param {object} eventHandles 
    */
    eventListeners(controlHandlers) {
        this.#bookMarkButton.addEventListener("click", controlHandlers.openModal);
        this.#closeButton.addEventListener("click", controlHandlers.closeModal);
        this.#submitButton.addEventListener("click", controlHandlers.handleFormSubmit);
        this.#form.addEventListener("submit", (e) => e.preventDefault());
        this.#locationButton.addEventListener("click", controlHandlers.handleLocationButton);
        this.#likeButton.addEventListener("click", controlHandlers.handleLikeButton);
        this.#buttonSave.addEventListener("click", controlHandlers.handleButtonSave);
        window.addEventListener("load", controlHandlers.handlePageLoad);
    }

    /**
     * Gets, validata and sanitize form input.
     * Return clean input or null
     * @returns String or null
     */
    getFormInput() {
        try {
            return util.validateCityName(this.#submitForm.value);
        } catch (error) {
            this.renderNotification(error.message);
            return null;
        }
    }

    /**
     * Renders notification message with a specified message
     * @param {String} message 
     */
    renderNotification(message) {

        this.#notification.textContent = message;
        this.#notification.classList.toggle("clear");

        setTimeout(() => {
            this.#notification.classList.toggle("clear");
        }, 3000);
    }
}