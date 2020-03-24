// initialize chart
let beeswarm;

// load data
d3.csv('data/NYT_data_single_cand.csv').then(data => {
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
        containerHeight: 600
    }, data, ['Biden', 'Bloomberg', 'Buttigieg', 'Sanders', 'Warren']);

    beeswarm.update();
    //console.log(data);
});

$('#biden').click(() => {
    if($('input[id=biden]').is(':checked')) {
        beeswarm.candidates.add('Biden');
    } else {
        beeswarm.candidates.delete('Biden');
    }
    beeswarm.update();
});

$('#bloomberg').click(() => {
    if($('input[id=bloomberg]').is(':checked')) {
        beeswarm.candidates.add('Bloomberg')
    } else {
        beeswarm.candidates.delete('Bloomberg')
    }
    beeswarm.update();
});

$('#buttigieg').click(() => {
    if($('input[id=buttigieg]').is(':checked')) {
        beeswarm.candidates.add('Buttigieg')
    } else {
        beeswarm.candidates.delete('Buttigieg')
    }
    beeswarm.update();
});

$('#sanders').click(() => {
    if($('input[id=sanders]').is(':checked')) {
        beeswarm.candidates.add('Sanders');
    } else {
        beeswarm.candidates.delete('Sanders');
    }
    beeswarm.update();
});

$('#warren').click(() => {
    if($('input[id=warren]').is(':checked')) {
        beeswarm.candidates.add('Warren')
    } else {
        beeswarm.candidates.delete('Warren')
    }
    beeswarm.update();
});