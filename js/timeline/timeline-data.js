export class TimelineData {

    static getMonth2Nums() {
        return {
            'January': 0,
            'February': 1,
            'March': 2,
            'April': 3,
            'May': 4,
            'June': 5,
            'July': 6,
            'August': 7,
            'September': 8,
            'October': 9,
            'November': 10,
            'December': 11
        };
    }

    static convertStringToDate(string) {
        const splitString = string.split(" ");

        const month = this.getMonth2Nums()[splitString[0]];
        const day = splitString[1];
        const year = splitString[2];

        return new Date(year, month, day);
    };

    static dateInRange(extent) {
        return function(d) {
            const smallest = extent[0] < extent[1] ? extent[0] : extent[1];
            const largest = extent[0] < extent[1] ? extent[1] : extent[0];

            if (d['Date'] > smallest && d['Date'] < largest) {
                return true;
            } else {
                return false;
            }
        }
    }


}