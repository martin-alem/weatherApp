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

    static overlay = document.querySelector(".overlay");
    static modal = document.querySelector(".modal");

    #submitForm = document.querySelector(".search_input");
    #submitButton = document.querySelector(".btn-submit");
    #locationButton = document.querySelector(".btn-location");
    #likeButton = document.querySelector(".btn-like");
    #cardContainer = document.querySelector(".card-container");
    #buttonSave = document.querySelector(".btn-save");

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
     * 
     * @param {*} data 
     */
    render(data) {

        this.#weatherImage.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
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
     * 
     * @param {*} data 
     * @param {*} handler1 
     * @param {*} handler2 
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
     * 
     */
    clearNodes() {

        document.querySelectorAll(".card").forEach(element => {
            element.remove();
        })
    }

    /**
     * Sets up eventListeners and provides required callback
     * @param {object} eventHandles 
    */
    eventListeners(eventHandles) {

        this.#bookMarkButton.addEventListener("click", eventHandles.openModal);
        this.#closeButton.addEventListener("click", eventHandles.closeModal);
        this.#submitButton.addEventListener("click", eventHandles.handleFormSubmit);
        this.#locationButton.addEventListener("click", eventHandles.handleLocationButton);
        this.#likeButton.addEventListener("click", eventHandles.handleLikeButton);
        this.#buttonSave.addEventListener("click", eventHandles.handleButtonSave);
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
            this.renderN(error.message);
            return null;
        }
    }

    /**
     * 
     * @param {*} errorMessage 
     */
    renderNotification(errorMessage) {

        this.#notification.textContent = errorMessage;
        this.#notification.classList.toggle("clear");

        setTimeout(() => {
            this.#notification.classList.toggle("clear");
        }, 3000);
    }
}