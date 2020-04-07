export class TimelineBrush {

    static appendBrushX(chart, height, width, timeScale, dispatcher) {
        const brushX = TimelineBrush.createBrushX(height, width, timeScale, dispatcher);
        const brushGroup = chart.append('g');
        brushGroup.attr('class', 'timeline-brush');
        brushGroup.call(brushX);
    }

    static createBrushX(height, width, timeScale, dispatcher) {

        const moveBrush = TimelineBrush.moveBrush(timeScale, dispatcher);

        const brushX = d3.brushX();
        brushX.extent([[0, height - 20], [width, height + 20]]);
        brushX.on('brush', moveBrush);
        brushX.on('end', moveBrush);

        return brushX
    }

    static moveBrush(timeScale, dispatcher) {
        return function() {
            if (d3.event.selection) {
                const highlightedArea = d3.event.selection.map(timeScale.invert);
                dispatcher.call('focus', this, highlightedArea);
            } else {
                const highlightedArea = [new Date(2019, 5, 1), new Date(2020, 2, 1)];
                dispatcher.call('focus', this, highlightedArea);
            }
        }
    }
}