const div1 = () => {
    d3.select('#widget').classed('hidden', false);

    d3.select('#bubble').classed('hidden', false);
    d3.select('#multiLine').classed('hidden', true);
    d3.select('#timeLine').classed('hidden', true);

    $('input[id=politics]').prop('checked', true);
    $('input[id=opinion]').prop('checked', true);
    $('input[id=business]').prop('checked', true);
    $('input[id=other]').prop('checked', true);
    bubble.categories.add('politics');
    bubble.categories.add('opinion');
    bubble.categories.add('business');
    bubble.categories.add('other');

    $('input[name=category][value=all]').prop('checked', true);
    $('input[name=category][value=separate]').prop('checked', false);
    const radioValue = $('input[name=category]:checked').val();
    bubble.group = radioValue;

    bubble.update();
};

const div2 = () => {
    d3.select('#widget').classed('hidden', false);

    d3.select('#bubble').classed('hidden', false);
    d3.select('#multiLine').classed('hidden', true);
    d3.select('#timeLine').classed('hidden', true);

    $('input[id=politics]').prop('checked', true);
    $('input[id=opinion]').prop('checked', true);
    $('input[id=business]').prop('checked', true);
    $('input[id=other]').prop('checked', true);
    bubble.categories.add('politics');
    bubble.categories.add('opinion');
    bubble.categories.add('business');
    bubble.categories.add('other');

    $('input[name=category][value=all]').prop('checked', false);
    $('input[name=category][value=separate]').prop('checked', true);
    const radioValue = $('input[name=category]:checked').val();
    bubble.group = radioValue;

    bubble.update();
};


const div3 = () => {
    d3.select('#widget').classed('hidden', false);

    d3.select('#bubble').classed('hidden', false);
    d3.select('#multiLine').classed('hidden', true);
    d3.select('#timeLine').classed('hidden', true);

    $('input[id=politics]').prop('checked', false);
    $('input[id=opinion]').prop('checked', true);
    $('input[id=business]').prop('checked', true);
    $('input[id=other]').prop('checked', true);
    bubble.categories.delete('politics');
    bubble.categories.add('opinion');
    bubble.categories.add('business');
    bubble.categories.add('other');

    $('input[name=category][value=all]').prop('checked', false);
    $('input[name=category][value=separate]').prop('checked', true);
    const radioValue = $('input[name=category]:checked').val();
    bubble.group = radioValue;
    bubble.update();

    bubble.update();
};

const div4 = () => {
    d3.select('#widget').classed('hidden', true);

    d3.select('#bubble').classed('hidden', true);
    d3.select('#multiLine').classed('hidden', false);
    d3.select('#timeLine').classed('hidden', true);
};

const div5 = () => {
    d3.select('#widget').classed('hidden', true);

    d3.select('#bubble').classed('hidden', true);
    d3.select('#multiLine').classed('hidden', true);
    d3.select('#timeLine').classed('hidden', false);
};

const scroll = (n, offset, func1, func2) => {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function(direction) {
            direction === 'down' ? func1() : func2();
        },
        //start 75% from the top of the div
        offset: offset
    });
};

scroll('div2', '75%', div2, div1);
scroll('div3', '75%', div3, div2);
scroll('div4', '75%', div4, div3);
scroll('div5', '75%', div5, div4);