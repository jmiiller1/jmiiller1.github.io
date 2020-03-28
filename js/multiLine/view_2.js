import { MultiLine } from "./multiLine.js";

d3.csv('data/NYT_data.csv', d3.autotype).then(data => {
    data.forEach((row) => {
        row[`Date`] = new Date (row[`Date`]);
        row[`SentScore(headline)`] = +row[`SentScore(headline)`];
        row[`SentScore(abstract)`] = +row[`SentScore(abstract)`];
        row[`SentScore(lead)`] = +row[`SentScore(lead)`];
        row[`SentScore(Avg)`] = +row[`SentScore(Avg)`];
    });
    //console.log(data);
    const multiLine = new MultiLine(data, {
        parentElement: '#multiLine',
        containerHeight: 500,
        containerWidth: 1000,
    });
    multiLine.update();
});