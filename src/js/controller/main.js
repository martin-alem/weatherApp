import { eventListeners, overlay, modal, renderOrClearPreview, render } from "./../view/events";
import { WeatherManager } from "./../model/weatherManager"


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
        renderOrClearPreview();
        weatherManager.fetchDataOnPageLoad()
            .then(data => {
                renderOrClearPreview();
                render(data);
            })
            .catch(error => console.log(error))
    }
}




export const handler = eventListeners(eventHandles);