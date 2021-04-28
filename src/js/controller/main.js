import {eventListeners, overlay, modal, renderPreview, clearPreview} from "./../view/events";
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
        renderPreview();
       weatherManager.fetchDataOnPageLoad()
       .then(data => {
           clearPreview();
           console.log(data);
       })
       .catch(error => console.log(error))
    }
}




export const handler = eventListeners(eventHandles);