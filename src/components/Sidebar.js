import React, { Component } from 'react';
import Filter from '../components/Filter';

class Sidebar extends Component {
	constructor(props) {
		super(props);
	}
	

	render() {
		const sidebarView = this.props.sidebarView;
		
		const minDate = new Date(this.props.minDate);
		const maxDate = new Date(this.props.maxDate);
		const today = new Date(this.props.today);
		const startDate = (minDate.getMonth() + 1) + '/' + minDate.getDate() + '/' + minDate.getFullYear();
		const endDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
		
		const filteredFills = this.props.filteredFills;
		const dateRangeFilteredFills = this.props.dateRangeFilteredFills;
		const selectedFills = this.props.selectedFills.map(id => filteredFills.find(f=> f.id === id));;
				
		const colors = this.props.colors;
		
		const filters = this.props.filters;
		const filterTypes = filters.map(f => f.type).filter((v, i, a) => a.indexOf(v) === i);
		const filterTypeDisplayNames = filterTypes.map(f => filters.find(i => i.type==f).pluralDisplayType);
		
		const decisionSupport = this.props.decisionSupport;
		
		const currentActiveOpioidFills = decisionSupport.currentActiveOpioidFills;
		const overlappingFills = decisionSupport.overlappingFills;
		const concurrentBenzodiazepineFills = decisionSupport.concurrentBenzodiazepineFills;
		const highMMEFills = decisionSupport.highMMEFills;
				
		return (
			<div className="sidebar">
				{this.props.fills.length === 0 && (
					<div className="d-flex flex-column align-items-center mt-3">
						<div>
							<i style={{color: '#545b62'}} className="fa fa-spinner fa-pulse fa-3x fa-fw mb-2"></i>
						</div>
						<div>Loading...</div>
					</div>
				)}
				{this.props.fills.length > 0 && sidebarView === 'selectedFills' && (
					<div>
						<div className="fv-sidebar-nav fv-selected-fills-header">
							<div className="fv-sidebar-header">
								Selected Fills
							</div>
							<div className="fill-view-close-button">
								<button 
									className="btn btn-link"
									onClick={this.props.onCloseSidebar}>
									<i className="fas fa-times"></i>
								</button>
							</div>
						</div>

						<div>
							<ul>
							<li>Overlap days:</li>
							<li>Total MME / day:</li>
							<li>Prescribers:</li>
							<li>Pharmacies:</li>
							<li>Days remaining:</li>
							</ul>
						</div>

						{selectedFills.map((f,i) => (
							<div className={'selected-fill animated fadeIn ' + (this.props.hoveredFills.indexOf(f.id) >= 0 ? 'selected-fill-hover' : '')} key={f.id}
								onMouseOver={() => this.props.onMouseOverFills([ f.id ])}
								onMouseOut={() => this.props.onMouseOutFills()}>
								<div className="row mb-1">
									<div className="col">{i + 1}</div>
									<div className="col text-right"><small>{f.drugClass}</small></div>
								</div>
								<div className="row">
									<div className="col"><strong>{f.drugWithStrength}</strong></div>
									<div className="col text-right">{f.dailyMME > 0 ? 'Daily MME: ' + f.dailyMME : ''} {f.dailyMME > 90 && (<i className="fas fa-exclamation-triangle"></i>)}</div>
								</div>
								<div className="row">
									<div className="col">Qty: {f.quantity}</div>
									<div className="col text-right">{f.startDate}-{f.endDate}</div>
								</div>
								<div className="row">
									<div className="col">DS: {f.daysSupply} ({Math.round((f.quantity / f.daysSupply) * 10) / 10}/day)</div>
									<div className="col text-right">Pay: Cash</div>
								</div>
								<div className="row">
									<div className="col">
										<span>{f.prescriber}</span>
									</div>
									<div className="col text-right">
										<span>{f.pharmacy}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
				{this.props.fills.length > 0 && sidebarView === 'overview' && (
					<div>
						<div className="fv-sidebar-nav fv-overview-header">
							<div className="fv-sidebar-header">
								<div>Overview</div>
								<div className="fv-timeline-counts">
									<span className="fv-timeline-count ml-3"><i className="fas fa-user-md"></i> 4</span>
									<span className="fv-timeline-count"><i className="fas fa-mortar-pestle"></i> 3</span>
									<span className="fv-timeline-count"><i className="fas fa-prescription-bottle-alt"></i> 9</span>
								</div>
							</div>
							<div className="fv-sidebar-date">
								{(this.props.minDate != '' && this.props.maxDate != '') && ( <div>{startDate}-{endDate}</div> )}
							</div>
						</div>

						{currentActiveOpioidFills.length > 0 && (
							<div className="fv-card">
								<div className="fv-card-header open">
									<div>
										<i className="fas fa-chevron-up mr-1"></i> Current active opioids
										<span className="fv-card-badge">{currentActiveOpioidFills.length}</span>
									</div>
									<div className="fv-link">
										more info
									</div>
								</div>
								<div className="fv-card-body">
									<div>
										<table className="table table-borderless table-sm">
											<thead>
												<tr>
													<th scope="col">Fill Date</th>
													<th scope="col">Drug</th>
													<th scope="col">Qty</th>
													<th scope="col">Days</th>
													<th scope="col">MME / Day</th>
													<th scope="col">Days Remaining</th>
												</tr>
											</thead>
											<tbody>
												{currentActiveOpioidFills.map((f, i) => (
													<tr className="fv-row"
														key={'current-opioid-fills-' + i}
														onClick={() => this.props.onSelectFills([ f.fill.id ])}
														onMouseOver={() => this.props.onMouseOverFills([ f.fill.id ])}
														onMouseOut={() => this.props.onMouseOutFills()}>
														
														<td>{f.fill.startDate}</td>
														<td>{f.fill.drugNameWithStrength}</td>
														<td>{f.fill.quantity}</td>
														<td>{f.fill.daysSupply}</td>
														<td>{f.fill.dailyMME}</td>
														<td>{f.daysRemaining}</td>
													</tr>
												))}
											</tbody>
										</table>
										
									</div>
								</div>
							</div>
						)}
						
						{overlappingFills.map(g => (
							<div className="fv-card">
								<div className="fv-card-header open">
									<div>
										<i className="fas fa-chevron-up mr-1"></i> {g.label + ' overlapping fill dates'}
										<span className="fv-card-badge">{(g.timelineFillBarData.length ? g.timelineFillBarData.length : 0)}</span>
									</div>
									<div className="fv-link">
										more info
									</div>
								</div>
								<div className="fv-card-body">
									<div>
										<table className="table table-borderless table-sm">
											<thead>
												<tr>
													<th scope="col">Overlap Dates</th>
													<th scope="col"># Days Overlap</th>
													<th scope="col"># Fills</th>
													<th scope="col">Drugs</th>
												</tr>
											</thead>
											<tbody>
												{g.timelineFillBarData.map((b, i) => (
													<tr className="fv-row"
														key={'current-overlapping-' + g.label + '-fills-' + i}
														onClick={() => this.props.onSelectFills(b.fillIds)}
														onMouseOver={() => this.props.onMouseOverFills(b.fillIds)}
														onMouseOut={() => this.props.onMouseOutFills()}>
														
														<td>{b.startDate.toLocaleDateString()}-<br/>{b.endDate.toLocaleDateString()}</td>
														<td>{b.duration}</td>
														<td>{b.fillIds.length}</td>
														<td>
															<div className="d-flex flex-column">
																{b.fillArrays.map((f, i) => (
																	<div>
																		{f.drugNameWithStrength}
																	</div>
																))}
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
										
									</div>
								</div>
							</div>
						))}
						
						
						{concurrentBenzodiazepineFills.length > 0 && (
							<div className="fv-card">
								<div className="fv-card-header open">
									<div>
										<i className="fas fa-chevron-up mr-1"></i> Concurrent benzodiazepine fills
										<span className="fv-card-badge">{decisionSupport.concurrentBenzodiazepineFills.length}</span>
									</div>
									<div className="fv-link">
										more info
									</div>
								</div>
								<div className="fv-card-body">
									<div>
										<table className="table table-borderless table-sm">
											<thead>
												<tr>
													<th scope="col">Fill Date</th>
													<th scope="col">Benzodiazepine</th>
													<th scope="col"># Opioid(s)</th>
													<th scope="col">Opioid(s)</th>
												</tr>
											</thead>
											<tbody>
												{decisionSupport.concurrentBenzodiazepineFills.map((g, i) => (
													<tr className="fv-row"
														key={'concurrent-benzodiazepine-fills-' + i}
														onClick={() => this.props.onSelectFills(g.fillIds)}
														onMouseOver={() => this.props.onMouseOverFills(g.fillIds)}
														onMouseOut={() => this.props.onMouseOutFills()}>
														
														<td>{new Date(g.benzodiazepineFill.startDate).toLocaleDateString()}</td>
														<td>{g.benzodiazepineFill.drugNameWithStrength}</td>
														<td>{g.opioidFills.length}</td>
														<td>
															<div className="d-flex flex-column">
																{g.opioidFills.map((o, i) => (
																	<div>
																		{o.drugNameWithStrength}
																	</div>																
																))}
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
										
									</div>
								</div>
							</div>
						)}
						
						{highMMEFills.length > 0 && (
							<div className="fv-card">
								<div className="fv-card-header open">
									<div>
										<i className="fas fa-chevron-up mr-1"></i> Fills with MME / day over 90
										<span className="fv-card-badge">{highMMEFills.length}</span>
									</div>
									<div className="fv-link">
										more info
									</div>
								</div>
								<div className="fv-card-body">
									<div>
										<table className="table table-borderless table-sm">
											<thead>
												<tr>
													<th scope="col">Fill Date</th>
													<th scope="col">Drug</th>
													<th scope="col">Qty</th>
													<th scope="col">Days</th>
													<th scope="col">MME / Day</th>
												</tr>
											</thead>
											<tbody>
												{highMMEFills.map((f, i) => (
													<tr className="fv-row"
														key={'current-opioid-fills-' + i}
														onClick={() => this.props.onSelectFills([ f.id ])}
														onMouseOver={() => this.props.onMouseOverFills([ f.id ])}
														onMouseOut={() => this.props.onMouseOutFills()}>
														
														<td>{f.startDate}</td>
														<td>{f.drugNameWithStrength}</td>
														<td>{f.quantity}</td>
														<td>{f.daysSupply}</td>
														<td>{f.dailyMME}</td>
													</tr>
												))}
											</tbody>
										</table>
										
									</div>
								</div>
							</div>
						)}
						
						
					</div>
				)}

				{this.props.fills.length > 0 && sidebarView === 'filters' && (
					<div>
						<div className="fv-sidebar-nav fv-selected-fills-header">
							<div className="fv-sidebar-header">
								Filters
							</div>
							<div className="fill-view-close-button">
								<button 
									className="btn btn-link"
									onClick={this.props.onCloseSidebar}>
									<i className="fas fa-times"></i>
								</button>
							</div>
						</div>
						
						{filterTypes.map((filterType, i) => (
							<Filter
								filters={filters}
								filteredFills={filteredFills}
								filterType={filterType}
								filterTypes={filterTypes}
								dateRangeFilteredFills={dateRangeFilteredFills}
								filterTypeDisplayName={filterTypeDisplayNames[i]}
								key={"filter-" + i}
								onFilterChange={this.props.onFilterChange}
								onBulkFilterChange={this.props.onBulkFilterChange} />
						))}

					</div>
				)}

			</div>
		);
	}
}

export default Sidebar;






