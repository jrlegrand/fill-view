import React, { Component } from 'react';
import Timeline from '../components/Timeline';
import Table from '../components/Table';

class TimelineGroup extends Component {
	constructor(props) {
		super(props);
		this.state = { }
	}
	
	
	render() {
		const timelineId = this.props.timelineId;
		const collapsedTimelineGroups = this.props.collapsedTimelineGroups;
		const timelineFillBarData = this.props.timelineFillBarData;
		const timelineGroupData = this.props.timelineGroupData;
		const label = timelineGroupData.label;
		const counts = timelineGroupData.counts;
		const fillArrays = timelineGroupData.fillArrays;

		return (
			<div className="fv-timeline-group">
				<div className="fv-timeline-header">
					<div className="fv-timeline-header-title-links">
						<div className="fv-timeline-label">{label}</div>
						<div className="fv-timeline-counts">
							<span className="fv-timeline-count"><i className="fas fa-user-md"></i> {counts.prescriber}</span>
							<span className="fv-timeline-count"><i className="fas fa-mortar-pestle"></i> {counts.pharmacy}</span>
							<span className="fv-timeline-count"><i className="fas fa-prescription-bottle-alt"></i> {counts.prescription}</span>
						</div>
					</div>
					<div className="fv-timeline-buttons">
						<a href="#" className="fv-table-collapse-button" onClick={() => this.props.onTimelineGroupCollapseToggle(label)}>
							<i className="fas fa-table"></i> <i className={"fas fa-angle-" + (collapsedTimelineGroups.indexOf(label) < 0 ? "up" : "down")}></i>
						</a>
					</div>
				</div>
				
				<Timeline
					id={"fv-timeline-" + timelineId}
					timelineFillBarData={timelineFillBarData}
					minDate={this.props.minDate}
					maxDate={this.props.maxDate}
					today={this.props.today}
					numDays={this.props.numDays}
					hoveredFills={this.props.hoveredFills}
					selectedFills={this.props.selectedFills}
					onSelectFills={this.props.onSelectFills}
					onMouseOverFills={this.props.onMouseOverFills}
					onMouseOutFills={this.props.onMouseOutFills}
				/>
				
				{collapsedTimelineGroups.indexOf(label) < 0 && (
					<Table
						fills={fillArrays}
						selectedFills={this.props.selectedFills}
						filteredFills={this.props.filteredFills}
						hoveredFills={this.props.hoveredFills}
						onMouseOverFills={this.props.onMouseOverFills}
						onMouseOutFills={this.props.onMouseOutFills}
						onSelectFills={this.props.onSelectFills}							
					/>
				)}

			</div>
		);
	}
}

export default TimelineGroup;
