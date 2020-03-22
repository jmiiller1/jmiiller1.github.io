// initialize chart
let beeswarm;

// load data
d3.csv('data/NYT_data.csv').then(data => {
    data.forEach(d => {
       d['SentScore(Avg)'] = +d['SentScore(Avg)'];
       d['SentScore(abstract)'] = +d['SentScore(abstract)'];
       d['SentScore(headline)'] = +d['SentScore(headline)'];
       d['SentScore(lead)'] = +d['SentScore(lead)'];
       d['Date'] = new Date(d['Date']);
    });

    beeswarm = new Beeswarm({
        parentElement: '#beeswarm',
        containerWidth: 1270,
        containerHeight: 680
    }, data);

    beeswarm.update();
    //console.log(data);
});