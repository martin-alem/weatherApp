import { View } from "../view/main-view";
import { WeatherManager } from "../model/weatherManager"


const weatherManager = new WeatherManager();
const view = new View();

const eventHandles = {

    handlePageLoad: () => {
        view.renderOrClearPreview();
        weatherManager.fetchDataOnPageLoad()
            .then(data => {
                view.renderOrClearPreview();
                view.render(data);
            })
            .catch(error => console.log(error))
    }
}

view.eventListeners(eventHandles);