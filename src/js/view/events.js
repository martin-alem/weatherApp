const bookMarkButton = document.querySelector(".btn-modal");
const closeButton = document.querySelector(".close");
const tempValue = document.querySelector(".value");
export const overlay = document.querySelector(".overlay");
export const modal = document.querySelector(".modal");


export function renderPreview(){
    tempValue.classList.toggle("animate");
}

export function clearPreview(){
    tempValue.classList.toggle("animate");
}

export function eventListeners(eventHandles){

    bookMarkButton.addEventListener("click", eventHandles.openModal);
    closeButton.addEventListener("click", eventHandles.closeModal);
    window.addEventListener("load", eventHandles.handlePageLoad);
}