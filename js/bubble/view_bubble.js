// initialize chart
let bubble;

// load data
d3.csv('data/NYT_data.csv').then(data => {
    data.forEach(d => {
        d['SentScore(Avg)'] = +d['SentScore(Avg)'];
        d['SentScore(abstract)'] = +d['SentScore(abstract)'];
        d['SentScore(headline)'] = +d['SentScore(headline)'];
        d['SentScore(lead)'] = +d['SentScore(lead)'];
        d['Pub_date'] = d['Date'];
        d['Date'] = new Date(d['Date']);
        d['Count'] = +d['Count'];
        d['id'] = Math.random();
    });

    bubble = new Bubble({
        parentElement: '#bubble',
        containerWidth: 1270,
        containerHeight: 600
    }, data);

    bubble.group = 'all';

    bubble.update();
});

$('#politics').click(() => {
    if($('input[id=politics]').is(':checked')) {
        bubble.categories.add('politics');
    } else {
        bubble.categories.delete('politics');
    }
    bubble.update();
});

$('#opinion').click(() => {
    if($('input[id=opinion]').is(':checked')) {
        bubble.categories.add('opinion');
    } else {
        bubble.categories.delete('opinion');
    }
    bubble.update();
});

$('#business').click(() => {
    if($('input[id=business]').is(':checked')) {
        bubble.categories.add('business');
    } else {
        bubble.categories.delete('business');
    }
    bubble.update();
});

$('#other').click(() => {
    if($('input[id=other]').is(':checked')) {
        bubble.categories.add('other');
    } else {
        bubble.categories.delete('other');
    }
    bubble.update();
});

$('input[type=radio]').click(() => {
    const radioValue = $('input[name=category]:checked').val();
    bubble.group = radioValue;
    bubble.update();
});