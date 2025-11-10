import React, { Component } from 'react';

class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.state = { };
	}

	render() {
		const filterCount = this.props.filters.map(f => f.filtered.length).reduce((a,b) => a + b, 0);
		const granularity = this.props.granularity;
		const timelineType = this.props.timelineType;
		const lookback = this.props.lookback;
		
		return (		
			<div className="fv-nav">
				<div className="fv-nav-header">
					<div className="fv-nav-logo">
						Fill View
					</div>
					<div className="fv-nav-patient-info">
						<span>
							<strong>{this.props.patientName}</strong>
						</span>
						<br />
						<span className="">
							DOB: 1/23/1945
						</span>
						<span className="ml-2">
							MRN: 9876543
						</span>
					</div>
				</div>
				<div className="fv-nav-buttons">

					<div className="btn-group">
						<div className="fv-button-label">
							Color
						</div>
						<div className="dropdown">
							<button type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							{timelineType}
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								{['Overlap', 'MME'].map((o, i) => (
									<a href="#"
										className={'dropdown-item' + (o===timelineType ? ' active' : '')}
										onClick={() => this.props.onTimelineTypeChange(o)}
										key={'timeline-display-' + o}>
											{o}
									</a>
								))}							
							</div>						
						</div>
					</div>

					<div className="btn-group">
						<div className="fv-button-label">
							Granularity
						</div>
						<div className="dropdown">
							<button type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							{granularity}
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								{['Class', 'Generic', 'Strength'].map((o, i) => (
									<a href="#"
										className={'dropdown-item' + (o===granularity ? ' active' : '')}
										onClick={() => this.props.onGranularityChange(o)}
										key={'timeline-granularity-' + o}>
											{o}
									</a>
								))}							
							</div>						
						</div>
					</div>
					
					<div className="btn-group">
						<div className="fv-button-label">
							Days
						</div>
						<div className="dropdown">
							<button type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							{lookback}
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								{[30, 60, 90, 180, 365].map((o, i) => (
									<a href="#"
										className={'dropdown-item' + (o===lookback ? ' active' : '')}
										onClick={() => this.props.onLookbackChange(o)}
										key={'lookback-' + o}>
											{o}
									</a>
								))}							
							</div>						
						</div>
					</div>
					
					<div className="btn-group">
						<div className="fv-button-label">
							Filters
						</div>
						<div className="dropdown">
							<button type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								{filterCount}
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a href="#"
									className="dropdown-item"
									onClick={this.props.onFilterEdit}
									key={'edit-filters'}>
									Edit
								</a>
								<a href="#"
									className={'dropdown-item' + (filterCount === 0 ? ' disabled' : '')}
									onClick={this.props.onFilterClear}
									key={'clear-filters'}>
									Clear
								</a>
							</div>						
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Toolbar;






