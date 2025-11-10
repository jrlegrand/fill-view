import React, { Component } from 'react';

class Legend extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const timelineType = this.props.timelineType.toLowerCase();
		const collapsedTimelineGroups = this.props.collapsedTimelineGroups;
		const allTimelineGroupsCollapsed = this.props.allTimelineGroupsCollapsed;

		return (
			<div className="fv-subtoolbar">
				<div className="fv-legend">
					{timelineType === 'overlap' && (
						<div>
							<strong>Concurrent fills:</strong>
							<span><i style={{color: '#757575'}} className="fas fa-circle ml-2"></i></span> 1
							<span><i style={{color: '#FFD600'}} className="fas fa-circle ml-2"></i></span> 2
							<span><i style={{color: '#FF6D00'}} className="fas fa-circle ml-2"></i></span> 3
							<span><i style={{color: '#D50000'}} className="fas fa-circle ml-2"></i></span> 4+
						</div>
					)}
					
					{timelineType === 'mme' && (
						<div>
							<strong>Total MME / day:</strong>
							<span><i style={{color: '#757575'}} className="fas fa-circle ml-2"></i></span> {'<'} 50
							<span><i style={{color: '#FFD600'}} className="fas fa-circle ml-2"></i></span> 50-69
							<span><i style={{color: '#FF6D00'}} className="fas fa-circle ml-2"></i></span> 70-89
							<span><i style={{color: '#D50000'}} className="fas fa-circle ml-2"></i></span> 90+
						</div>			
					)}
				</div>
				
				<div className="fv-collapse-all-tables-toggle">
					<strong>{(allTimelineGroupsCollapsed ? 'Expand' : 'Collapse')} all:</strong>
					<a href="#" className="fv-table-collapse-button" onClick={this.props.onCollapseAllTimelineGroupsToggle}>
						<i className="fas fa-table"></i> <i className={"fas fa-angle-" + (allTimelineGroupsCollapsed ? "down" : "up")}></i>
					</a>
				</div>
				
			</div>
		);
	}
}

export default Legend;