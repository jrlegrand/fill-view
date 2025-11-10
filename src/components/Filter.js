import React, { Component } from 'react';

class Filter extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			expanded: true
		};
		
		this.handleFilterToggle = this.handleFilterToggle.bind(this);
	}
	
	handleFilterToggle() {
		this.setState({ expanded: !this.state.expanded });
	}
	
	render() {
		const filters = this.props.filters;
		const filteredFills = this.props.filteredFills;
		const dateRangeFilteredFills = this.props.dateRangeFilteredFills;
		const filterTypeDisplayName = this.props.filterTypeDisplayName;
		const filterType = this.props.filterType;
		
		const filterParent = filters.find(f => f.type === filterType && f.parentType === true);
		const filterParentCol = filterParent.col;
		const filterFilteredOptions = filteredFills.map(f => f[filterParentCol]).filter((v, i, a) => a.indexOf(v) === i);
		const filterFilteredCount = filterType === 'prescription' ? filteredFills.length : filterFilteredOptions.length;
		const filterAvailableOptions = filterParent.available;
		const filterTotalCount = filterType === 'prescription' ? dateRangeFilteredFills.length : filterAvailableOptions.length;
		
		// boolean if some items are filtered from this filter
		const isFiltered = filterFilteredCount < filterTotalCount;

		return (
			<div>
				<div className="fv-card">
					<div className={'fv-card-header' + (this.state.expanded ? ' open' : '')}
						onClick={this.handleFilterToggle}>
						<div>
							<i className={'fas fa-chevron-' + (this.state.expanded ? 'up' : 'down')}></i> {filterTypeDisplayName}
							<span className="fv-card-badge">{filterFilteredCount + (isFiltered && ' / ' + filterTotalCount)}</span>
						</div>
					</div>
					{this.state.expanded && (
						<div className="fv-card-body">
							{filters.filter((f, i) => f.type === filterType).map((filterInType, i) => (
								<div>
									<div className="hidden"
										key={filterInType.name + "-button-div-" + i}>
										<button 
											type="button"
											className="btn btn-link btn-sm fill-view-clear-button"
											key={filterInType.name + "-button-" + i}
											onClick={() => this.props.onBulkFilterChange('clear', filterInType.name)}>
											clear filter
										</button>
									</div>
									<table className="table table-borderless table-sm">
										<thead>
											<tr>
												<th scope="col"><i className="fas fa-filter"></i> {filterInType.pluralDisplayName}</th>
												<th scope="col"># Rx</th>
												<th scope="col">% Rx</th>
											</tr>
										</thead>
										<tbody>
											{filterInType.available.map((a, i) => (
												<tr className="fv-row">
													<td>													
														<div className="form-check">
															<input
																className="form-check-input"
																name={a.name}
																id={filterInType + "-" + a.name + "-input-" + i}
																type="checkbox"
																checked={filterInType.filtered.indexOf(a.name) > -1}
																onChange={() => this.props.onFilterChange(a.name, filterInType.name)}
																key={a.name + "-input-" + i} />
															<label
																className="form-check-label"
																for={filterInType + "-" + a.name + "-input-" + i}
																key={a.name + "-input-label-" + i}>
																{a.name}
															</label>
														</div>
													</td>
													<td>{a.count}</td>
													<td>{a.percentage}</td>
												</tr>
											))}
										</tbody>
									</table>										
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default Filter;






