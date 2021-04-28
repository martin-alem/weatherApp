export const util = {

    /**
     * 
     * @param {*} celsius 
     * @returns 
     */
    toFarienhiet: celsius => {
        return (celsius * (9 / 5)) + 32;
    },

    /**
     * 
     * @param {*} number 
     * @param {*} decimalPlaces 
     * @returns 
     */
    toNDecimalPlaces: (number, decimalPlaces) => {
        const tmpNum = Number.parseInt(number * decimalPlaces);
        return tmpNum / decimalPlaces;
    },

    /**
     * 
     * @param {*} cityName 
     * @returns 
     */
    validateCityName: cityName => {
        if (cityName !== "") {
            let newString = cityName.replace(" ", "");
            return newString;
        }
        throw new Error("Invalid City Name");
    }
}