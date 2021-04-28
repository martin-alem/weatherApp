import { View } from "../view/main-view";
import { WeatherManager } from "../model/weatherManager"


const weatherManager = new WeatherManager();
const view = new View();

const eventHandles = {

    /**
     * 
     */
    handlePageLoad: () => {
        view.renderOrClearPreview();
        weatherManager.fetchDataOnPageLoad()
            .then(data => {
                view.renderOrClearPreview();
                view.render(data);
            })
            .catch(error => view.renderError(error.message));
    },

    handleFormSubmit: () => {
        const cityName = view.getFormInput();
        if (cityName) {
            view.renderOrClearPreview();
            weatherManager.fetchDataOnFormSubmit(cityName)
                .then(data => {
                    view.renderOrClearPreview();
                    view.render(data);
                })
                .catch(error => view.renderError(error.message));
        }
    },

    handleLocationButton: () => {
        view.renderOrClearPreview();
        weatherManager.fetchDataOnLocationButton()
            .then(data => {
                view.renderOrClearPreview();
                view.render(data);
            })
            .catch(error => view.renderError(error.message));
    }
}

view.eventListeners(eventHandles);