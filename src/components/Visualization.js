import React, { Component } from 'react';
import Timeline from '../components/Timeline';
import Table from '../components/Table';


class Visualization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeView: '',
			activeGranularity: '',
			activeTimelineType: '',
			options: {
			}
		};
	}
	
	handleGranularityChange(granularity) {
		this.setState({ activeGranularity: granularity });
	}
	
	handleTimelineTypeChange(timelineType) {
		this.setState({ activeTimelineType: timelineType });
	}
	
	render() {
		const filters = this.props.filters;
		const activeView = this.props.activeView;
		const activeGranularity = this.state.activeGranularity || this.props.defaultGranularity || '';
		const activeTimelineType = this.state.activeTimelineType || this.props.defaultTimelineType || '';
		let filter = [];		
		filter = filters.find(f => f.granularity === activeGranularity.toLowerCase());
		
		return (
			<div>
			{activeView === 'Timeline' && (
				<div>
					<div className="row mb-3 mt-1">
						<div className="col">
							<div className="btn-group mr-3" role="group">
								{['Class', 'Generic', 'Strength'].map((o, i) => (
									<button
										type="button"
										className={o===activeGranularity ? 'btn btn-secondary btn-sm active' : 'btn btn-secondary btn-sm'}
										onClick={() => this.handleGranularityChange(o)}
										key={'prescription-granularity-' + o}>
										{o}
									</button>
								))}
							</div>
							<div className="btn-group mr-2" role="group">
								{['Overlap', 'MME', 'Prescriptions', 'Prescribers', 'Pharmacies'].map((o, i) => (
									<button
										type="button"
										className={o===activeTimelineType ? 'btn btn-secondary btn-sm active' : 'btn btn-secondary btn-sm'}
										onClick={() => this.handleTimelineTypeChange(o)}
										key={'timeline-display-' + o}>
										{o}
									</button>
								))}
							</div>
						</div>
						
						
					</div>
				
					<Timeline													
						id="main"
						today={this.props.today}
						granularity={activeGranularity.toLowerCase()}
						timelineType={activeTimelineType.toLowerCase()}
						fills={this.props.fills}
						filteredFills={this.props.filteredFills}
						filters={this.props.filters}
						today={this.props.today}
						minDate={this.props.minDate}
						maxDate={this.props.maxDate}
						numDays={this.props.numDays}
						hoveredFills={this.props.hoveredFills}
						hoveredTableFill={this.props.hoveredTableFill}
						selectedFills={this.props.selectedFills}
						onSelectFills={this.props.onSelectFills}
						onMouseOverFills={this.props.onMouseOverFills}
						onMouseOutFills={this.props.onMouseOutFills} />
						
					<Table 
						selectedFills={this.props.selectedFills}
						filteredFills={this.props.filteredFills}
						hoveredFills={this.props.hoveredFills}
						colors={this.props.colors} 
						onMouseOverFills={this.props.onMouseOverFills}
						onMouseOutFills={this.props.onMouseOutFills}
						onSelectFills={this.props.onSelectFills}						
						
						/>

				</div>
			)}

			{activeView === 'Table' && (
				<Table 
					data={tableData}
					colors={this.props.colors} />
			)}
			
			{activeView === 'Pie' && (
				<Donut
					filteredFills={this.props.filteredFills}
					filter={filter}
					colors={this.props.colors} />
			)}
			
			{activeView === 'Map' && (
				<p>Coming soon...</p>
			)}
			</div>
		);
	}
}

export default Visualization;
