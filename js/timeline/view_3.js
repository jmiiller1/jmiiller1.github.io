d3.csv('data/timeline/DemocraticPrimaryDebateSchedule.csv', d3.autotype).then(data => {
    data = data.map((row) => {
        row['Date'] = convertStringToDate(row['Date']);
    });
});