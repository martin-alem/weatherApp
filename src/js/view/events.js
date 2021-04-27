const bookMarkButton = document.querySelector(".btn-modal");
const closeButton = document.querySelector(".close");
export const overlay = document.querySelector(".overlay");
export const modal = document.querySelector(".modal");



export function eventListeners(eventHandles){

    bookMarkButton.addEventListener("click", eventHandles.openModal);
    closeButton.addEventListener("click", eventHandles.closeModal);
    window.addEventListener("load", eventHandles.handlePageLoad);
}