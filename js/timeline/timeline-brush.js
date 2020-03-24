export class TimelineBrush {

    static appendBrushX(self, chart) {
        const brushX = TimelineBrush.createBrushX(self);
        const brushGroup = chart.append('g');
        brushGroup.attr('class', 'timeline-brush');
        brushGroup.call(brushX);
    }

    static createBrushX(self) {
        const vis = self;

        const brushX = d3.brushX();
        brushX.extent([[0, vis.config.innerHeight / 2 - 20], [vis.config.innerWidth, vis.config.innerHeight / 2 + 20]])
        brushX.on('brush', vis.moveBrush);

        return brushX
    }

    static moveBrush() {
        if (d3.event.selection) {
            //svg.property("value", d3.event.selection.map(x.invert, x).map(d3.utcDay.round));
            //svg.dispatch("input");
        }
    }
}