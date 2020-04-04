export class MultiLineUtilities {

    static appendText(group, titleName, height, width, className) {
        const text = group.append('text')
            .attr('class', className)
            .attr('text-anchor', 'middle')
            .attr('x', width)
            .attr('y', height)
            .text(titleName);
    }

    static appendTextXAxis(group, titleName, height, width, className){
        const text = group.append('text')
            .attr('class', className)
            .attr('x', width)
            .attr('y', height)
            //.attr('fill', 'black')
            .text(titleName);
    }

    static appendTextYAxis(group, titleName, height, width, className){
        const text = group.append('text')
            .attr('class', className)
            .attr('text-anchor', 'middle')
            .attr('x', width)
            .attr('y', height)
            //.attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .text(titleName);
    }
}
