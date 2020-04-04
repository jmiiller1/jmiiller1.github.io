import { MultiLine } from "./multiLine.js";

d3.csv('data/NYT_data_average.csv', d3.autotype).then(data => {
    data.forEach((row) => {
        row['Date'] = new Date (row['Date']);
        row['SentScore(headline)'] = +row['SentScore(headline)'];
        row['SentScore(abstract)'] = +row['SentScore(abstract)'];
        row['SentScore(lead)'] = +row['SentScore(lead)'];
        row['SentScore(Avg)'] = +row['SentScore(Avg)'];
    });
    //console.log(data);
    const multiLine = new MultiLine(data, {
        parentElement: '#multiLine',
        containerHeight: 600,
        containerWidth: 840,
    });
    multiLine.update();
});