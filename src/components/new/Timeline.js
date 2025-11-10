import React, {Component} from 'react';
import * as d3 from "d3";

class Timeline extends Component {
	componentDidMount() {
		this.drawChart();
	}

	componentDidUpdate() {
		this.drawChart();
	}
  
	isHovered(d) {
		const hovered = this.props.hovered;
		console.log('item', d.ids);
		console.log('hvoerred', hovered);
		return d.ids.some(function (v) {
			return hovered.indexOf(v) >= 0;
		});
	}

	isSelected(d) {
		return this.props.selected.toString() === d.ids.toString();
	}
	
	dateDiff(d1, d2) {
		const timeDiff = Math.abs(d2.getTime() - d1.getTime());
		const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		return dayDiff;		
	}

    
  drawChart() {
	const data = this.props.data;
	const hovered = this.props.hovered;
	const selected = this.props.selected;
	
	const chartPaddingVertical = 4;
	const barHeight = 10;
	const barHeightHovered = 14;
	
	const chartHeight = barHeightHovered + 2 * chartPaddingVertical;
    const containerWidth = this.props.containerWidth;
	const chartWidth = "100%"
	
	const minDate = d3.min(data, function(d) { return d.start; });
	const maxDate = d3.max(data, function(d) { return d.end; });
	const days = 90;
	const day = 100 / days;
	const tickOffset = 3;
	const today = new Date(2018,2,12);
	
	d3.select("#" + this.props.id).selectAll("*").remove();
		
	const svg = d3.select("#" + this.props.id).append("svg")
		.attr("width", chartWidth)
		.attr("height", chartHeight);
		//.style("background-color", "#FAFAFA");

	/*
	svg.append("line")
		.style("stroke", "red")
		.style("stroke-width", "2px")
        .attr("class", "fv-ruler-today-line")
		.attr('x1', (d, i) => this.dateDiff(today, minDate) * day + "%")
		.attr("y1", (d, i) => chartHeight - 35)
		.attr('x2', (d, i) => this.dateDiff(today, minDate) * day + "%")
		.attr("y2", (d, i) => chartHeight);
	*/
	
	svg.append("rect")
        .attr("class", "fv-ruler-today-line")
		.attr('x', (d, i) => this.dateDiff(today, minDate) * day + "%")
		.attr("y", (d, i) => chartHeight - 30)
		.attr("width", 2) // day + "%"
		.attr("height", 30)
		.append("svg:title")
			.text("Today");


	
	svg.append("text")
        .attr("class", "fv-ruler-today-text")
		.attr("text-anchor", (d, i) => "middle")
		.attr('x', (d, i) => this.dateDiff(today, minDate) * day + "%")
		.attr("y", (d, i) => chartHeight - 40)
		.text((d, i) => "Today");

	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("svg:rect")

		.attr('x', (d, i) => this.dateDiff(d.start, minDate) * day + "%")
		.attr("y", (d, i) => (this.isHovered(d) ? chartPaddingVertical : chartPaddingVertical + 2))		// y should be either static, or perhaps the number of stacks needed for stacked bars

		.attr("width", (d, i) => this.dateDiff(d.end, d.start) * day + "%")								// width should be the number of days per fill
		.attr("height", (d, i) => (hovered.indexOf(d.ids[0]) > -1 ? barHeightHovered : barHeight))		// height should be static... but also tranform when hovered / selected
		
		
		.attr("fill", (d, i) => (d.ids.length > 1 ? "#FFDE03" : "#9E9E9E"))								// fill and other styles will be dependent on the criteria of the visualization
		.attr("stroke", (d, i) => (this.isSelected(d) ? "#000000" : ""))								// #0336FF - blue					
		.attr("stroke-width", (d, i) => (selected.indexOf(d.ids[0]) > -1 ? "2" : ""))

		.on("mouseover", (d, i) => {
			if (hovered.toString() !== d.ids.toString()) {
				this.props.onMouseOver(d);
			}
		})
		
		.on("mouseout", (d, i) => {
			if (hovered !== []) {
				this.props.onMouseOut();
			}
		})
		
		.on("click", (d, i) => {
			this.props.onClick(d);
		})
		
		.append("svg:title")
			.text(function(d, i) {
				return d.ids.map(id => id + '\n');
			});
  }
        
  render(){
    return (
		<div className="fv-timeline-group">
			<div className="fv-timeline-header">
				<div className="fv-timeline-header-title-links">
					<div className="fv-timeline-label">Hydrocodone</div>
					<div className="fv-timeline-counts">
						<span className="fv-timeline-count fv-link"><i className="fas fa-user-md"></i> 2</span>
						<span className="fv-timeline-count fv-link"><i className="fas fa-mortar-pestle"></i> 2</span>
						<span className="fv-timeline-count fv-link"><i className="fas fa-prescription-bottle-alt"></i> 3</span>
					</div>
				</div>
				<div className="fv-timeline-buttons">
					<i className="fas fa-table"></i> <i className={"fas fa-angle-" + (this.props.id === "twoz" ? "down" : "up")}></i>
				</div>
			</div>
			<div className="fv-timeline" id={this.props.id}></div>
			
			<table className={"table table-hover table-sm" + (this.props.id === "twoz" && " hidden")}>
				<thead>
					<tr>
						<th scope="col">Fill Date</th>
						<th scope="col">ID</th>
						<th scope="col">Written</th>
						<th scope="col">Drug</th>
						<th scope="col">Qty</th>
						<th scope="col">Days</th>
						<th scope="col">Rx #</th>
						<th scope="col">Prescriber</th>
						<th scope="col">Pharmacy</th>
						<th scope="col">Refill</th>
						<th scope="col">Daily Dose</th>
						<th scope="col">Payment Type</th>
						<th scope="col">PMP</th>
					</tr>
				</thead>
				<tbody>
					<tr className="fv-row">
						<td>4/25/2018</td>
						<td>26</td>
						<td></td>
						<td>OXYCODONE HCL 5 MG TABLET</td>
						<td>20</td>
						<td>4</td>
						<td></td>
						<td className="fv-link">Lloyd Leonard, MD</td>
						<td className="fv-link">Target Jackson	</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td>4/25/2018</td>
						<td>26</td>
						<td></td>
						<td>OXYCODONE HCL 5 MG TABLET</td>
						<td>20</td>
						<td>4</td>
						<td></td>
						<td className="fv-link">Lloyd Leonard, MD</td>
						<td className="fv-link">Target Jackson	</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td>4/25/2018</td>
						<td>26</td>
						<td></td>
						<td>OXYCODONE HCL 5 MG TABLET</td>
						<td>20</td>
						<td>4</td>
						<td></td>
						<td className="fv-link">Lloyd Leonard, MD</td>
						<td className="fv-link">Target Jackson	</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td>4/25/2018</td>
						<td>26</td>
						<td></td>
						<td>OXYCODONE HCL 5 MG TABLET</td>
						<td>20</td>
						<td>4</td>
						<td></td>
						<td className="fv-link">Lloyd Leonard, MD</td>
						<td className="fv-link">Target Jackson	</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>
			</table>

		</div>
	)
  }
}
    
export default Timeline;
