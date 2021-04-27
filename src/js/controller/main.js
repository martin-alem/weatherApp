import {eventListeners, overlay, modal} from "./../view/events";
import {WeatherManager} from "./../model/weatherManager"


const weatherManager = new WeatherManager();

const eventHandles = {

    openModal: () => {
        overlay.style.visibility = "visible";
        modal.style.visibility = "visible";
    },

    closeModal: () => {
        overlay.style.visibility = "hidden";
        modal.style.visibility = "hidden";
    },

    handlePageLoad: () => {
       weatherManager.fetchDataOnPageLoad()
    }
}




export const handler = eventListeners(eventHandles);