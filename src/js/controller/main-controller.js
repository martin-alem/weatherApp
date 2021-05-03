import { View } from "../view/main-view";
import { WeatherManager } from "../model/weatherManager";


(function () {

    const view = new View();
    const weatherManager = new WeatherManager();

    const handlers = {

        /**
         * Handles page load event.
         * Renders preview.
         * makes request
         * renders data to view
         */
        handlePageLoad: () => {
            view.renderOrClearPreview();
            weatherManager.fetchDataOnPageLoad()
                .then(data => {
                    view.render(data);
                })
                .catch(error => {
                    view.renderNotification(error);
                })
                .finally(() => view.renderOrClearPreview());
        },


        /**
         * Handles form submission.
         * Gets input
         * makes request if input valid
         * renders data to view
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
         * Handles location button pressed event
         * makes request
         * renders data to view
         */
        handleLocationButton() {

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


        /**
         * Handles Like button pressed event
         * persist location in local storage
         */
        handleLikeButton() {
            const location = weatherManager.persistLocation();
            if (location) {
                view.renderNotification(`Location ${location} Saved Successfully!!!`);
            } else {
                view.renderNotification(`Location Already Exist!!!`);
            }
        },


        /**
         * Handles save button pressed event
         * set current location as default
         */
        handleButtonSave() {
            try {
                weatherManager.setDefaultLocationOnButtonClick();
                view.renderNotification(`Location Set As Default!!!`);
            } catch (error) {
                view.renderNotification(error.message);
            }
        },


        /**
         * Handles the click events on card element
         * Gets name from card
         * makes a request
         * renders data to view
         * closes modal
         * @param {String} cityName 
         */
        handleCard(cityName) {

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
                        this.closeModal();
                        view.renderOrClearPreview();
                    });
            }
        },

        /**
         * Handles delete event listener attached to card.
         * deletes a location from local storage.
         * @param {String} cityName 
         */
        handleDelete(cityName) {
            weatherManager.deleteSavedLocation(cityName);
        },

        /**
         * Opens the modal
         * retrieves and returns saved location from local storage
         * renders the data with data and corresponding event handlers
         */
        openModal() {
            const locations = weatherManager.retrieveSavedLocation();
            view.renderCard(locations, handlers.handleCard, handlers.handleDelete);
            view.overlay.style.visibility = "visible";
            view.modal.style.visibility = "visible";
        },

        /**
        * Close the modal
        * Clears all elements with card class from card-container
        */
        closeModal() {
            view.clearNodes();
            view.overlay.style.visibility = "hidden";
            view.modal.style.visibility = "hidden";
        }

    }

    view.eventListeners(handlers);

})();
