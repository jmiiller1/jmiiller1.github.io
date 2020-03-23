d3.csv('data/timeline/DemocraticPrimaryDebateSchedule.csv', d3.autotype).then(data => {
    data.forEach((row) => {
        row['Date'] = convertStringToDate(row['Date']);
    });

    const timeline = new Timeline(data, {
        parentElement: '#timeline',
        containerHeight: 700,
        containerWidth: 1000
    });

    timeline.update();

});

