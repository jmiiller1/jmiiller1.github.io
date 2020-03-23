const months2Nums = {
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

const convertStringToDate = function(string) {
    const splitString = string.split(" ");

    const month = months2Nums[splitString[0]];
    const day = splitString[1];
    const year = splitString[2];

    return new Date(year, month, day);
};

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

    console.log(endDate);

    result.push(endDate);

    return result;
}