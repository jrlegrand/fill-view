import React, { Component } from 'react';
import * as d3 from "d3";

class Timeline extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.drawChart();
	}

	componentDidUpdate() {
		this.drawChart();
	}
	
	isHovered(timelineFillBar) {
		const hoveredFills = this.props.hoveredFills;
		const fillIds = timelineFillBar.fillIds;
		
		return hoveredFills.some(f => fillIds.indexOf(f) >= 0);
	}

	isSelected(timelineFillBar) {
		const selectedFills = this.props.selectedFills;
		const fillIds = timelineFillBar.fillIds;
		
		return selectedFills.some(f => fillIds.indexOf(f) >= 0);
	}

	dateDiff(d1, d2) {
		const timeDiff = Math.abs(d2.getTime() - d1.getTime());
		const dayDiff = Math.round(timeDiff / (1000*60*60*24)); 
		return dayDiff;
	}
	
	drawChart() {		
		const id = this.props.id;
		const timelineFillBarData = this.props.timelineFillBarData;
		
		const hoveredFills = this.props.hoveredFills;
		const selectedFills = this.props.selectedFills;
		
		const minDate = this.props.minDate;
		const maxDate = this.props.maxDate;
		const today = this.props.today;
		const numDays = this.props.numDays;
		
		const chartPaddingVertical = 4;
		const barHeight = 10;
		const barHeightHovered = 14;		
		const chartHeight = barHeightHovered + 2 * chartPaddingVertical;
		const chartWidth = "100%"
		
		const dayWidthPercent = 100 / numDays;
		const tickOffset = 3;		
		
		d3.select("#" + id).selectAll("*").remove();
			
		const svg = d3.select("#" + this.props.id).append("svg")
			.attr("width", chartWidth)
			.attr("height", chartHeight);
		
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
		
		svg.selectAll("g")
			.data(timelineFillBarData)
			.enter()
			.append("g")
			.append("svg:rect")

			.attr('x', (d, i) => this.dateDiff(d.startDate, minDate) * dayWidthPercent + "%")
			.attr("y", (d, i) => this.isHovered(d) ? chartPaddingVertical : chartPaddingVertical + 2)

			.attr("width", (d, i) => this.dateDiff(d.endDate, d.startDate) * dayWidthPercent + "%")
			.attr("height", (d, i) => this.isHovered(d) ? barHeightHovered : barHeight)
			
			//.attr("fill", (d, i) => this.isHovered(d) ? '#bee5eb' : d.color)
			.attr("fill", (d, i) => d.color)
			.attr("stroke", (d, i) => {
				if (this.isHovered(d)) return '#bee5eb';
				if (this.isSelected(d)) return '#000000';
				return '';
				
			})
			.attr("stroke-width", (d, i) => this.isSelected(d) || this.isHovered(d) ? "2" : "")

			.on("mouseover", (d, i) => {
				if (hoveredFills.toString() !== d.fillIds.toString()) {
					this.props.onMouseOverFills(d.fillIds);
				}
			})
			
			.on("mouseout", (d, i) => {
				if (hoveredFills !== []) {
					this.props.onMouseOutFills();
				}
			})
			
			.on("click", (d, i) => {
				this.props.onSelectFills(d.fillIds);
			})
			
			.append("svg:title")
				.text((d, i) => d.tooltip);
	}
	
	render() {
		return (
			<div className="fv-timeline" id={this.props.id}></div>					
		);
	}
}

export default Timeline;
