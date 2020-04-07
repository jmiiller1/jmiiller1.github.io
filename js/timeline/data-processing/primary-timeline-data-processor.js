export class PrimaryTimelineDataProcessor {
    static processTimelineData() {
        d3.text('data/timeline/WikiDemPrimaryTimeline.txt', d3.autotype).then(data => {

            const filteredData = PrimaryTimelineDataProcessor.filterData(data);

            const output = PrimaryTimelineDataProcessor.buildCSVObjects(filteredData);

            const dataString = d3.csvFormat(output, ['Date', 'Description', 'Url']);
            console.log(dataString); // I just copied this into a csv, rather than have to play around with Node.js to
                                     // write to a file.
        });
    }

    static buildCSVObjects(data) {
        return data.map((element) => {
            const csvObject = {};

            csvObject['Date'] = PrimaryTimelineDataProcessor.extractDate(element);
            csvObject['Description'] = PrimaryTimelineDataProcessor.extractDescription(element);
            csvObject['Url'] = PrimaryTimelineDataProcessor.extractUrl(element);

            return csvObject;
        })
    }

    static filterData(data) {
        const lines = data.split('\n');

        return lines.filter((str) => {

            return (str.includes('Biden') ||
                str.includes('Sanders') ||
                str.includes('Buttigieg') ||
                str.includes('Warren') ||
                str.includes('Bloomberg')) &&
                (str.startsWith('*') || str.startsWith('**'));
        });
    }


    static extractDate(element) {

        let date = element.match(/date=(\w*\s\d{1,2},\s\d{4})/);

        if (date !== null) {
            date = date[1];
        }

        return date

    };

    static extractDescription(element) {

        let description = element.match(/\*{1,3}(.+)/);

        if (description !== null) {
            description = description[1];

            //clean description
            description = description.replace(/<ref.*<\/ref>/g, '');
            description = description.replace(/'''.*''':/g, '');
            description = description.replace(/'''.*:'''/g, '');
            description = description.replace(/\[{1,2}/g, '');
            description = description.replace(/]{1,2}/g, '');
            description = description.replace(/\|\w*/g, '');

            console.log(description);
        }

        return description;

    };

    static extractUrl(element) {

        // http://www.urlregex.com/
        let url = element.match(/url=(((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?))/);

        if (url !== null) {
            url = url[1];
        }

        return url;

    };
}

PrimaryTimelineDataProcessor.processTimelineData();