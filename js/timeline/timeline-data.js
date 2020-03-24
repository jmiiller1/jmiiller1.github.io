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

    /*
    const timePeriods = [
        [new Date(2019, 6, 1), new Date(2019, 6, 30)],
        [new Date(2019, 7, 1), new Date(2019, 7, 31)],
        [new Date(2019, 8, 1), new Date(2019, 8, 31)],
        [new Date(2019, 9, 1), new Date(2019, 9, 30)],
        [new Date(2019, 10, 1), new Date(2019, 10, 31)],
        [new Date(2019, 11, 1), new Date(2019, 11, 30)],
        [new Date(2019, 12, 1), new Date(2019, 12, 31)],
        [new Date(2020, 1, 1), new Date(2020, 1, 31)],
        [new Date(2020, 2, 1), new Date(2020, 2, 29)]
    ];



//https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    const computeMonthDomain = function(startDate) {
        const result = [startDate];

        console.log(startDate);

        const month = startDate.getMonth();
        let endDate = new Date(startDate.valueOf());
        while (endDate.getMonth() === month) {
            endDate.addDays(1);
        }

        result.push(endDate);

        return result;
    };
    */

}