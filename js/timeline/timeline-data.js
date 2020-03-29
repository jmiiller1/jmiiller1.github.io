export class TimelineData {

    static getMonth2Nums() {
        return {
            'January': 1,
            'February': 2,
            'March': 3,
            'April': 4,
            'May': 5,
            'June': 6,
            'July': 7,
            'August': 8,
            'September': 9,
            'October': 10,
            'November': 11,
            'December': 12
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