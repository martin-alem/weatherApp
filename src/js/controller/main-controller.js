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
                view.render(data);
            })
            .catch(error => {
                view.renderError(error.message)
            })
            .finally(() => view.renderOrClearPreview());
    },

    /**
     * 
     */
    handleFormSubmit: () => {
        const cityName = view.getFormInput();
        if (cityName) {
            view.renderOrClearPreview();
            weatherManager.fetchDataOnFormSubmit(cityName)
                .then(data => {
                    view.render(data);
                })
                .catch(error => {
                    view.renderError(error.message)
                })
                .finally(() => view.renderOrClearPreview());
        }
    },

    /**
     * 
     */
    handleLocationButton: () => {
        view.renderOrClearPreview();
        weatherManager.fetchDataOnLocationButton()
            .then(data => {
                view.render(data);
            })
            .catch(error => {
                view.renderError(error.message)
            })
            .finally(() => view.renderOrClearPreview());
    },

    handleLikeButton: () => {
        const location = weatherManager.persistLocation();
        if (location) {
            view.renderNotification(`Location ${location} Saved Successfully!!!`);
        }
        else {
            view.renderNotification(`Location ${location} Already Exist!!!`);
        }
    }
}

view.eventListeners(eventHandles);