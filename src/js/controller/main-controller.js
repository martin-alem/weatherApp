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
                view.renderNotification(error.message);
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
                    view.renderNotification(error.message)
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
                view.renderNotification(error.message)
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
    },

    handleButtonSave: () => {
        weatherManager.setDefaultLocation("Yes");
        view.renderNotification(`Location Set As Default!!!`);
    },

    handleCard: (cityName) => {

        if (cityName) {
            view.renderOrClearPreview();
            weatherManager.fetchDataOnFormSubmit(cityName)
                .then(data => {
                    view.render(data);
                })
                .catch(error => {
                    view.renderNotification(error.message)
                })
                .finally(() => {
                    eventHandles.closeModal();
                    view.renderOrClearPreview();
                });
        }
    },

    handleDelete: (cityName) => {
        weatherManager.deleteSavedLocation(cityName);
    },


    /**
     * 
     */
    openModal: () => {
        const locations = weatherManager.retrieveSavedLocation();
        view.renderCard(locations, eventHandles.handleCard, eventHandles.handleDelete);
        View.overlay.style.visibility = "visible";
        View.modal.style.visibility = "visible";
    },

    /**
     * 
     */
    closeModal: () => {
        view.clearNodes();
        View.overlay.style.visibility = "hidden";
        View.modal.style.visibility = "hidden";
    }
}

view.eventListeners(eventHandles);