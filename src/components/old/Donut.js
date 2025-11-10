import React, { Component } from 'react';
import Chart from 'react-google-charts';

// Donut reference : https://developers.google.com/chart/interactive/docs/gallery/piechart#donut

class Donut extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options: {
				pieHole: 0.4,
				legend: {position: 'right', textStyle: {fontSize: 13}},
				chartArea:{left: 0, top: 10, bottom: 10, width:'100%',height:'100%'},
				height: 250,
				titleTextStyle: { fontSize: 13, bold: true },
				//tooltip: { isHtml: true },
				pieSliceText: 'none',
				pieSliceTextStyle: { fontSize: 13 },
				tooltip: { showColorCode: true, textStyle: { fontSize: 13 }}
			}
		};
	}
	
	render() {
		const filter = this.props.filter;
		const filteredFills = this.props.filteredFills;
		
		const data = [['Name', 'Count']];		
		filter.uniqueFiltered.forEach(f => data.push([f.name, f.count]));
		
		let itemCount = 0;
		let availableFilterCount = 0;
		
		if (filter.type === 'prescription') {
			itemCount = filteredFills.length;
			availableFilterCount = filter.available.map(f => f.count).reduce((a,b) => a + b, 0);	
		} else {
			itemCount = filter.uniqueFiltered.length;
			availableFilterCount = filter.available.length;
		}
		
		let options = this.state.options;
		options.colors = this.props.colors;
		
		return (
			<div>			
				<Chart
					chartType="PieChart"
					data={data}
					options={options} />
			</div>
		);
	}
}

export default Donut;
