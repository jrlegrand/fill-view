import React, {Component} from 'react';
import * as d3 from "d3";

class TimelineRuler extends Component {
	componentDidMount() {
		this.props.numDays > 0 && this.drawChart();
	}
	
	componentDidUpdate() {
		this.props.numDays > 0 && this.drawChart();
	}
  
	dateDiff(d1, d2) {
		const timeDiff = Math.abs(d2.getTime() - d1.getTime());
		const dayDiff = Math.round(timeDiff / (1000*60*60*24)); 
		return dayDiff;
	}
	
	// TODO: make the number of ticks change with each number of days (i.e. bigger ticks for bigger days)
	numTicks(days) {
		return 15;
	}
    
  drawChart() {
	const chartWidth = "100%"
    const chartHeight = 50;
	const paddingX = 15;
	
	const minDate = this.props.minDate;
	const maxDate = this.props.maxDate;
	const today = this.props.today;
	const numDays = this.props.numDays;
	
	const dayWidthPercent = 100 / numDays;
	
	const numTicks = this.numTicks(numDays);
	const tickOffset = numDays / numTicks;
	
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	const ticks = [];
	
	var date = new Date(minDate);
	for (var date = new Date(minDate); date.getTime() < maxDate.getTime(); date.setDate(date.getDate() + tickOffset)) {
		ticks.push(new Date(date));
	}
	ticks.push(maxDate);
	
	d3.select("#timeline-ruler").selectAll("*").remove();
	
	const svg = d3.select("#timeline-ruler").append("svg")
		.attr("width", chartWidth)
		.attr("height", chartHeight);
		
	svg.append("line")
		.style("stroke", "#ccc")
		.style("stroke-width", "1px")
        .attr("class", "fv-ruler-tick-baseline")
		.attr('x1', (d, i) => "0%")
		.attr("y1", (d, i) => chartHeight)
		.attr('x2', (d, i) => "100%")
		.attr("y2", (d, i) => chartHeight);

	svg.selectAll("line.fv-ruler-tick")
		.data(ticks)
		.enter()
		.append("line")
		.style("stroke", "#ccc")
		.style("stroke-width", "1px")
        .attr("class", "fv-ruler-tick")
		.attr("x1", (d, i) => this.dateDiff(d, minDate) * dayWidthPercent + "%")
		.attr("y1", (d, i) => chartHeight - 5)
		.attr("x2", (d, i) => this.dateDiff(d, minDate) * dayWidthPercent + "%")
		.attr("y2", (d, i) => chartHeight);
	
	const todayPercentX = this.dateDiff(today, minDate) * dayWidthPercent;
	const todayXCSS = "calc(" + todayPercentX + "%" + (todayPercentX > 0 ? " - 2px" : "") + ")";
	
	svg.append("rect")
        .attr("class", "fv-ruler-today-line")
		.attr("x", (d, i) => todayXCSS)
		.attr("y", (d, i) => chartHeight - 30)
		.attr("width", 2)
		.attr("height", 30)
		.append("svg:title")
			.text("Today");
	
	svg.append("text")
        .attr("class", "fv-ruler-today-text")
		.attr("text-anchor", (d, i) => "middle")
		.attr("x", (d, i) => todayXCSS)
		.attr("y", (d, i) => chartHeight - 35)
		.attr("text-anchor", (d, i) => {
			let x = this.dateDiff(today, minDate) * dayWidthPercent;
			if (x > 95) { return "end"; }
			else if (x < 10) { return "start"; }
			else { return "middle" }
		})
		.text((d, i) => "Today")
		.append("svg:title")
			.text("Today");
			
	svg.selectAll("text.fv-day")
		.data(ticks)
		.enter()
		.append("text")
        .attr("class", "fv-day")
		.attr("x", (d, i) => this.dateDiff(d, minDate) * dayWidthPercent + "%")
		.attr("y", (d, i) => chartHeight - 10)
		.attr("text-anchor", (d, i) => {
			if (i === 0) { return "start"; }
			else if (i === ticks.length - 1) { return "end"; }
			else { return "middle" }
		})
		.text((d, i) => d.getDate());
		
	svg.selectAll("text.fv-month")
		.data(ticks)
		.enter()
		.append("text")
        .attr("class", "fv-month")
		.style("font-weight", "bold")
		.attr("x", (d, i) => this.dateDiff(d, minDate) * dayWidthPercent + "%")
		.attr("y", (d, i) => chartHeight - 25)
		.attr("text-anchor", (d, i) => {
			if (i === 0) { return "start"; }
			else if (i === ticks.length - 1) { return "end"; }
			else { return "middle" }
		})
		.text((d, i) => (i === 0 || i > 0 && ticks[i].getMonth() != ticks[i-1].getMonth() ? months[d.getMonth()] : ''));
	

  }
        
  render(){
    return <div id="timeline-ruler" className="sticky-top"></div>
  }
}
    
export default TimelineRuler;
