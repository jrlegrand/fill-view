import config from './config';
import { load } from './helpers/spreadsheet';
import React, { Component } from 'react';
import Toolbar from './components/Toolbar';
import TimelineRuler from './components/TimelineRuler';
import TimelineGroup from './components/TimelineGroup';
import Legend from './components/Legend';
import Sidebar from './components/Sidebar';

import './App.css';
import './assets/css/animate.css';

class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			// NOTE: allFills is temporary - it is all the fills in the Google Sheets spreadsheet
			allFills: [],
			
			fills: [],
			filteredFills: [],
			hoveredFills: [],
			selectedFills: [],
			sidebarView: 'overview',
			dateRangeFilteredFills: [],
			
			// TimelineGroup variables
			timelineFillBarData: [],
			timelineGroupData: [],
			collapsedTimelineGroups: [],
			
			granularity: 'Generic',
			granularityCol: 'drug',
			granularityCols: {
				class: 'drugClass',
				generic: 'drug',
				strength: 'drugWithStrength'				
			},
			timelineType: 'Overlap',
			patientName: 'Greg',
			patientNames: [],
			// lookback in days
			lookback: 365,
			minDate: [],
			maxDate: [],
			today: [],
			numDays: 0,
			// filters
			filters: [
				{
					name: 'drugClass',
					displayName: 'Drug Class',
					pluralDisplayName: 'Drug Classes',
					type: 'prescription',
					displayType: 'Prescription',
					pluralDisplayType: 'Prescriptions',
					granularity: 'class',
					parentType: false,
					col: 'drugClass',
					available: [],
					uniqueFiltered: [],
					filtered: []
				},
				{
					name: 'drugGeneric',
					displayName: 'Drug Generic',
					pluralDisplayName: 'Drug Generics',
					type: 'prescription',
					displayType: 'Prescription',
					pluralDisplayType: 'Prescriptions',
					granularity: 'generic',
					parentType: true,
					col: 'drug',
					available: [],
					uniqueFiltered: [],
					filtered: []
				},
				{
					name: 'drugStrength',
					displayName: 'Drug Strength',
					pluralDisplayName: 'Drug Strengths',
					type: 'prescription',
					displayType: 'Prescription',
					pluralDisplayType: 'Prescriptions',
					granularity: 'strength',
					parentType: false,
					col: 'drugWithStrength',
					available: [],
					uniqueFiltered: [],
					filtered: []
				},
				{
					name: 'prescriberName',
					displayName: 'Prescriber Name',
					pluralDisplayName: 'Prescriber Names',
					type: 'prescriber',
					displayType: 'Prescriber',
					pluralDisplayType: 'Prescribers',
					granularity: null,
					parentType: true,
					col: 'prescriber',
					available: [],
					uniqueFiltered: [],
					filtered: []
				},
				{
					name: 'pharmacyName',
					displayName: 'Pharmacy Name',
					pluralDisplayName: 'Pharmacy Names',
					type: 'pharmacy',
					displayType: 'Pharmacy',
					pluralDisplayType: 'Pharmacies',
					granularity: null,
					parentType: true,
					col: 'pharmacy',
					available: [],
					uniqueFiltered: [],
					filtered: []
				}
			],
		};
		
		this.initClient = this.initClient.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.handleTimelineTypeChange = this.handleTimelineTypeChange.bind(this);
		this.handleGranularityChange = this.handleGranularityChange.bind(this);
		this.handleViewChange = this.handleViewChange.bind(this);
		this.handleLookbackChange = this.handleLookbackChange.bind(this);
		this.handleFilterEdit = this.handleFilterEdit.bind(this);
		this.handleFilterClear = this.handleFilterClear.bind(this);
		
		this.handleSelectFills = this.handleSelectFills.bind(this);
		this.handleMouseOverFills = this.handleMouseOverFills.bind(this);
		this.handleMouseOutFills = this.handleMouseOutFills.bind(this);
		this.handleCollapseTi = this.handleMouseOutFills.bind(this);
		
		this.handleTableSelectFill = this.handleTableSelectFill.bind(this);
		this.handleTableMouseOverFill = this.handleTableMouseOverFill.bind(this);
		this.handleTimelineGroupCollapseToggle = this.handleTimelineGroupCollapseToggle.bind(this);
		this.handleCollapseAllTimelineGroupsToggle = this.handleCollapseAllTimelineGroupsToggle.bind(this);
		
		this.handleFilterChange = this.handleFilterChange.bind(this);
		this.handleBulkFilterChange = this.handleBulkFilterChange.bind(this);
		this.handleCloseSidebar = this.handleCloseSidebar.bind(this);
		this.handlePatientNameChange = this.handlePatientNameChange.bind(this);
	}

	componentDidMount() {
		window.gapi.load('client', this.initClient);
	}
	
	/* App functions */
	
	getDateRangeFilteredFills(minDate, maxDate) {
		return this.state.fills.filter(f => 
			// get fills where the script end date is after the timeline minDate (i.e. today minus lookback days)...
			minDate.getTime() <= new Date(f.endDate).getTime()
			// ...and the script start date is less than the maxDate
			&& maxDate.getTime() >= new Date(f.startDate).getTime());		
	}
	
	getFilteredFills(dateRangeFilteredFills) {
		const filters = this.state.filters;
		
		// find all fills that should be displayed based on currently active filters
		let filteredFills = dateRangeFilteredFills.filter(fill => 
			filters.map(filter =>
				// indexOf() returns -1 if the item is not in the "filtered" array
				filter.filtered.indexOf(fill[filter.col])
			// some() returns true if any item in an array is true
			).some(i => i >= 0)
		);
		
		// if no filters are selected, just make filteredFills the same as dateRangeFilteredFills
		if (filteredFills.length == 0) filteredFills = dateRangeFilteredFills;
		
		return filteredFills;
	}
	
	getFilterData(dateRangeFilteredFills, filteredFills) {
		const filters = this.state.filters;	
		const dateRangeFilteredFillsCount = dateRangeFilteredFills.length;		
		const filteredFillsCount = filteredFills.length;
		
		let available = [];
		let uniqueFiltered = [];
		
		// get count of each occurance of each unique filter option in date range filtered fills
		filters.forEach((filter, i) => {
			// get unique items in each type of filter, and count the occurance of each item within each filter type
			// i think this is the "bank" of filters to select from based on available dateRangeFilteredFills
			available = dateRangeFilteredFills.map(f => f[filter.col]).filter((v, i, a) => a.indexOf(v) === i)
				.map(p => {
					let count = dateRangeFilteredFills.filter(f => f[filter.col] === p).length;
					return {
						name: p, 
						count: count,
						percentage: Number(((count / dateRangeFilteredFillsCount) * 100).toFixed(1)),
					}; 
				})
				.sort((a,b) => {
					// sort by percentage fills decending
					if (a.percentage > b.percentage) return -1;
					if (a.percentage < b.percentage) return 1;
					// then sort by name ascending
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
				});		

			filters[i].available = available;
			
			// get unique items in each type of filter, and count the occurance of each item within each filter type
			// i think this is the "bank" of filters to select from based on available filteredFills
			// this is used in the filters sidebar view to show frequencies of each type of potentially filterable category item
			uniqueFiltered = filteredFills.map(f => f[filter.col]).filter((v, i, a) => a.indexOf(v) === i)
				.map(p => {
					let count = filteredFills.filter(f => f[filter.col] === p).length;
					return {
						name: p, 
						count: count,
						percentage: Number(((count / filteredFillsCount) * 100).toFixed(1)),
					}; 
				})
				.sort((a,b) => {
					// sort by percentage fills decending
					if (a.percentage > b.percentage) return -1;
					if (a.percentage < b.percentage) return 1;
					// then sort by name ascending
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
				});

			filters[i].uniqueFiltered = uniqueFiltered;
		});
		
		return filters;	
	}
	
	setFillData() {
		const today = new Date();
		
		const calcToday = new Date(today);
		const minFillDate = new Date(calcToday.setDate(calcToday.getDate() - this.state.lookback));
		const maxFillDate = new Date(Math.max.apply(null, this.state.fills.map(e => new Date(e.endDate)))); // get the latest endDate from fills
		
		const minDate = minFillDate;
		const maxDate = maxFillDate.getTime() < today.getTime() ? today : maxFillDate;
		const numDays = Math.round((maxDate.getTime()-minDate.getTime())/(1000*60*60*24));

		// we need a separate dateRangeFilteredFills for displaying the filter checkboxes
		const dateRangeFilteredFills = this.getDateRangeFilteredFills(minDate, maxDate);

		// filteredFills are the fills that are date range filtered and which remain after the other filters (prescriber / pharmacy / medication / etc) are applied
		const filteredFills = this.getFilteredFills(dateRangeFilteredFills);

		// update filters array based on any changes to lookback days, filter selection changes, etc.
		const filters = this.getFilterData(dateRangeFilteredFills, filteredFills);
		
		// get the data used to create all the timeline bars and decision support
		const timelineFillBarData = this.getTimelineFillBarData(minDate, maxDate, today, numDays, filteredFills);	
		
		// get the labels within the timelineFillBarData array;
		const timelineGroupData = this.getTimelineGroupData(timelineFillBarData, filteredFills);
		
		this.setState({
			dateRangeFilteredFills: dateRangeFilteredFills,
			filteredFills: filteredFills,
			filters: filters,
			timelineFillBarData: timelineFillBarData,
			timelineGroupData: timelineGroupData,
			minDate: minDate,
			maxDate: maxDate,
			today: today,
			numDays: numDays
		});
	}
	
	getTimelineGroupData(timelineFillBarData, filteredFills) {
		const granularityCol = this.state.granularityCol;
		const types = [
				{ name: 'prescriber', col: 'prescriber' },
				{ name: 'pharmacy', col: 'pharmacy' },
				{ name: 'prescription', col: 'id' }
			]
			
		// group the timeline bars by "group" - aka "label"
		// get the unique "labels" from all of the timelineFillBars
		let timelineGroupData = timelineFillBarData.map(f => f.label)
			.filter((v, i, a) => a.indexOf(v) === i)
			// for each of the "labels" or "groups"...
			.map(label => {
				// get all the fills in the group for use in other areas of the app
				const fillArrays = timelineFillBarData.filter(f => f.label === label).map(f => f.fillIds)
					.flat()
					.filter((v, i, a) => a.indexOf(v) === i)
					.map(f => filteredFills.find(ff => ff.id === f));
					
				// get the count of prescribers, pharmacies, and prescriptions in the group
				let counts = [];				
				
				types.forEach(type => {
					counts[type.name] =	fillArrays
						.map(f => f[type.col])
						.filter((v, i, a) => a.indexOf(v) === i)
						.length;
				});

				
				return {
					label: label,
					counts: counts,
					fillArrays: fillArrays
				};
		})
		
		return timelineGroupData;		
	}
	
	getTimelineFillBarData(minDate, maxDate, today, numDays, filteredFills) {
		// timelineFillBarData is the output of this function
		let timelineFillBarData = [];
		
		// which fills are hovered / selected
		const hoveredFills = this.state.hoveredFills;
		const selectedFills = this.state.selectedFills;
				
		// timelineType is Overlap, MME
		const timelineType = this.state.timelineType;
		
		// the column in the database that represents which granularity to create labels for
		const granularityCol = this.state.granularityCol;
		
		// get unique labels at the granularityCol level
		// i.e. if granularity is 'generic', then the unique labels would be 'Hydrocodone', 'Oxycodone', etc.
		const uniqueLabels = filteredFills.map(f => f[granularityCol]).filter((v, i, a) => a.indexOf(v) === i);
		
		// create a holding array for each unique label
		let fillMap = new Array(uniqueLabels.length);

		// for each unique label, create an array with the same number of slots as there are days shown on the timeline		
		uniqueLabels.forEach((label,i) => {
			fillMap[label] = new Array(numDays);

			filteredFills.filter(f => f[granularityCol] === label).forEach((f,i) => {
				// actual startDate and endDate of fill
				let fillStartDate = new Date(f.startDate);
				let fillEndDate = new Date(f.endDate);
				
				// replace startDate with earliest date on timeline, if applicable
				// and replace endDate with latest date on timeline, if applicable
				fillStartDate = fillStartDate.getTime() < minDate.getTime() ? minDate : fillStartDate;
				fillEndDate = fillEndDate.getTime() > maxDate.getTime() ? maxDate : fillEndDate;
				
				// offset of modified script fillStartDate compared to minDate
				let offset = Math.round((fillStartDate.getTime()-minDate.getTime())/(1000*60*60*24));
				
				// number of days shown on timeline for script
				let days = Math.round((fillEndDate.getTime()-fillStartDate.getTime())/(1000*60*60*24));
				
				// add the ID of each script to the label-specific array of dates
				for (let day = offset; day < (offset + days); day++) {
					// if the array at this position has been initialized, just push another ID into the array
					if (fillMap[label][day]) {
						fillMap[label][day].push(f.id);
					// if the array at this date position hasn't been initialized, initialize it with the first ID
					} else {
						fillMap[label][day] = [f.id];
					}
				}
			});
		});
		
		// the index of today's date in the filterMap array
		let todayIndex = Math.round((new Date(today).getTime() - new Date(minDate).getTime()) / (1000*60*60*24));
		
		// labelMap is the "label-level" array of fillMap, containing one item for each day
		uniqueLabels.forEach((label) => {
			let labelMap = fillMap[label];
			
			let startDateOffset, endDateOffset = null;
			let yesterdayFills, todayFills, tomorrowFills = [];
			
			for (let i = 0; i < labelMap.length; i++) {
				// initiate today's fills
				todayFills = labelMap[i];
				// if today has fills
				if (todayFills) {
					// initiate yesterday's fills and tomorrow's fills
					yesterdayFills = labelMap[i-1];
					tomorrowFills = labelMap[i+1];
					
					// if yesterday is empty, or if yesterday is different, then start the bar on today's date
					if (!yesterdayFills || todayFills.toString() !== yesterdayFills.toString()) {
						startDateOffset = i;
					}
					
					// if we come across the end of a section (i.e. overlap, or tomorrow is null, or we are at the end of the timeline)
					if (!tomorrowFills || todayFills.toString() !== tomorrowFills.toString() || i + 1 === labelMap.length) {
						// end the bar on tomorrow's date (i.e. tomorrow at midnight or whatever)
						endDateOffset = i + 1;
						
						// set the start and end dates for each of the timelineFillBarData based on the offsets from minDate determined above
						let timelineFillBarDataStartDate = new Date(minDate.getTime());
						timelineFillBarDataStartDate = new Date(timelineFillBarDataStartDate.setDate(timelineFillBarDataStartDate.getDate() + startDateOffset));
						let timelineFillBarDataEndDate = new Date(minDate.getTime());
						timelineFillBarDataEndDate = new Date(timelineFillBarDataEndDate.setDate(timelineFillBarDataEndDate.getDate() + endDateOffset));
						
						// make an array of actual fill objects based on the IDs in the array map
						const todayFillsArray = todayFills.map(id => filteredFills.find(f => f.id === id));
						
						// getTimelineFillBarColor function returns the color of the bar (different for each type of timeline)
						const color = this.getTimelineFillBarColor(todayFillsArray);						
						
						// renderTimelineFillBarTooltip function returns tooltip text (title property of rect)
						const tooltip = this.renderTimelineFillBarTooltip(todayFillsArray, timelineFillBarDataStartDate, timelineFillBarDataEndDate);
						
						// get the duration of the bar
						const duration = this.dateDiff(timelineFillBarDataEndDate, timelineFillBarDataStartDate);

						timelineFillBarData.push({
							label: label,
							fillIds: todayFills,
							fillArrays: todayFillsArray,
							tooltip: tooltip,
							color: color,
							startDate: timelineFillBarDataStartDate,
							endDate: timelineFillBarDataEndDate,
							duration: duration
						});
					}
				}
			}
		});

		return timelineFillBarData;
	}
	
	renderTimelineFillBarTooltip(fillArrays, timelineFillBarDataStartDate, timelineFillBarDataEndDate) {
		let tooltip = '';
		const startDate = timelineFillBarDataStartDate.toLocaleDateString();
		const endDate = timelineFillBarDataEndDate.toLocaleDateString();
		
		tooltip += startDate + '-' + endDate + '\n';
		
		fillArrays.map((f, i) => {
			tooltip += i+1 + '. ' + f.drugNameWithStrength + '\n'
		});
		
		return tooltip;
	}
	
	getTimelineFillBarColor(fillArrays) {
		const timelineType = this.state.timelineType.toLowerCase();
		const colors = ['', 
			'#757575',	// gray or blue?
			'#FFD600', 	// yellow
			'#FF6D00',	// orange
			'#D50000'	// red
		];
		let color = '';
		
		if (timelineType === 'mme') {
			let MME = (fillArrays.length > 1 ? fillArrays.map(f => parseInt(f.dailyMME)).reduce((a,b) => a + b) : parseInt(fillArrays[0].dailyMME));
			if (MME < 50) {
				color = colors[1];
			} else if (MME >= 50 && MME < 70) {
				color = colors[2];
			} else if (MME >= 70 && MME < 90) {
				color = colors[3];
			} else if (MME >=90) {
				color = colors[4];					
			}
		} else if (timelineType === 'overlap') {
			let numFills = fillArrays.length;
			if (numFills > 3) {
				color = colors[4];
			} else {
				color = colors[numFills];
			}
		}
		
		return color;
	}
	
	getDecisionSupport() {
		const filteredFills = this.state.filteredFills;
		const timelineFillBarData = this.state.timelineFillBarData;
		const timelineGroupData = this.state.timelineGroupData;
		const today = this.state.today;
		
		// current active opioid fills
		let currentActiveOpioidFills = [];
		
		filteredFills.filter(f => new Date(f.startDate).getTime() <= today.getTime() && new Date(f.endDate).getTime() >= today.getTime() && f.drugClass === 'Opioid')
			.map(f => {
				let daysRemaining = this.dateDiff(new Date(f.endDate), today);
				currentActiveOpioidFills.push({
					fill: f,
					daysRemaining: daysRemaining
				});
			});
		
		currentActiveOpioidFills = currentActiveOpioidFills.sort((a,b) => {
			// sort by most recent fill first
			let aStartDate = new Date(a.fill.startDate).getTime();
			let bStartDate = new Date(b.fill.startDate).getTime();
			if (aStartDate > bStartDate) return -1;
			if (aStartDate < bStartDate) return 1;
		});
		
		// overlapping fills
		let overlappingFills = [];
		
		timelineGroupData.map(g => {
			let overlappingTimelineFillBars = []
			
			timelineFillBarData.filter(f => f.label === g.label).map(f => {
				if (f.fillIds.length > 1) overlappingTimelineFillBars.push(f);
			});
			
			if (overlappingTimelineFillBars.length > 0) {
				
				overlappingTimelineFillBars = overlappingTimelineFillBars.sort((a,b) => {
					// sort by most recent fill first
					let aStartDate = new Date(a.startDate).getTime();
					let bStartDate = new Date(b.startDate).getTime();
					if (aStartDate > bStartDate) return -1;
					if (aStartDate < bStartDate) return 1;
				});

				overlappingFills.push({
					label: g.label,
					timelineFillBarData: overlappingTimelineFillBars
				});
			}
		});
		
		// concurrent benzodiazepine fills
		let concurrentBenzodiazepineFills = [];
		
		const benzodiazepines = filteredFills.filter(f => f.drugClass === 'Benzodiazepine');
		const opioids = filteredFills.filter(f => f.drugClass === 'Opioid');
		
		benzodiazepines.map(b => {
			let concurrentOpioidFills = [];
			opioids.map(o => {
				let benzodiazepineStartDate = new Date(b.startDate).getTime();
				let benzodiazepineEndDate = new Date(b.endDate).getTime();
				let opioidStartDate = new Date(o.startDate).getTime();
				let opioidEndDate = new Date(o.endDate).getTime();
				
				if (benzodiazepineEndDate > opioidStartDate && benzodiazepineStartDate < opioidEndDate) {
					concurrentOpioidFills.push(o);
				}
			});
			
			if (concurrentOpioidFills.length > 0) {
				// get fill IDs of benzodiazepine AND opioid fills to use for sidebar hover / select
				let fillIds = [];
				concurrentOpioidFills.map(f => fillIds.push(f.id));
				fillIds.push(b.id);
				
				concurrentBenzodiazepineFills.push({
					fillIds: fillIds,
					benzodiazepineFill: b,
					opioidFills: concurrentOpioidFills
				});
			}
		});
		
		// fills with MME / day over 90
		let highMMEFills = filteredFills.filter(f => f.dailyMME >= 90);
			
		return {
			currentActiveOpioidFills: currentActiveOpioidFills,
			overlappingFills: overlappingFills,
			concurrentBenzodiazepineFills: concurrentBenzodiazepineFills,
			highMMEFills
		};
	}
	
	dateDiff(d1, d2) {
		const timeDiff = Math.abs(d2.getTime() - d1.getTime());
		const dayDiff = Math.round(timeDiff / (1000*60*60*24)); 
		return dayDiff;
	}
	
	/* Data loading utilities */
	
	initClient() {
		// 2. Initialize the JavaScript client library.
		window.gapi.client
			.init({
		apiKey: config.apiKey,
		// Your API key will be automatically added to the Discovery Document URLs.
		discoveryDocs: config.discoveryDocs
		})
			.then(() => {
		// 3. Initialize and make the API request.
		load(this.onLoad);
		});
	};

	onLoad(data, error) {
		if (data) {
			const fills = data.fills;
			// only select the fills from the patient we are interested in
			this.setState({ 
				allFills: fills, 
				fills: this.getPatientFills(fills, this.state.patientName),
				patientNames: fills.map(f => f.patientName).filter((v, i, a) => a.indexOf(v) === i)
			}, () => this.setFillData() );
		} else {
			this.setState({ error });
		}
	};
	
	getPatientFills(fills, patientName) {
		return fills.filter(f => f.patientName === patientName)
		// sort first on drug class, then alphabetically
		.sort((a,b) => {
			const sortIndex = ['opioid', 'benzodiazepine', 'sedative', 'cns stimulant'];
			let drugClassA = a.drugClass.toLowerCase();
			let drugClassB = b.drugClass.toLowerCase();
			let drugA = a.drug.toLowerCase();
			let drugB = b.drug.toLowerCase();
			
			if (sortIndex.indexOf(drugClassA) > sortIndex.indexOf(drugClassB)) return 1;
			if (sortIndex.indexOf(drugClassA) < sortIndex.indexOf(drugClassB)) return -1;
			if (drugA > drugB) return 1;
			if (drugA < drugB) return -1;

			return 0;
		})		
	}
	
	handlePatientNameChange(patientName) {
		this.setState({
			fills: this.getPatientFills(this.state.allFills, patientName), 
			patientName: patientName,
			selectedFills: [],
			sidebarView: 'overview'
		}, () => this.setFillData());		
	}
	
	/* Sidebar actions */
	
	handleFilterChange(item, name) {
		let filters = this.state.filters;								// store current filters
		const filterIndex = filters.findIndex(f => f.name === name);	// get the index of the filter (for use later)
		let filtered = filters[filterIndex].filtered;					// get the "filtered" array		
		const itemIndex = filtered.indexOf(item);						// if this filter is not filtered, add it - otherwise, remove it
		
		if (itemIndex < 0) {											// if item doesn't exist in "filtered" array
			filtered.push(item);
		} else {
			filtered.splice(itemIndex, 1);
		}
		
		filters[filterIndex].filtered = filtered;
		
		this.setState({ filters: filters }, () => this.setFillData());
	}
	
	handleBulkFilterChange(action, name) {
		let filters = this.state.filters;								// store current filters
		const filterIndex = filters.findIndex(f => f.name === name);	// get the index of the filter (for use later)
		
		if (action === 'clear') {									// clear = clear all filters
			filters[filterIndex].filtered = [];
		} else if (action === 'selectNone') {							// select none = select no checkboxes
			filters[filterIndex].filtered = filters[filterIndex].available.map(f => f.name);
		}
		
		this.setState({ filters: filters }, () => this.setFillData());
	}
	
	handleCloseSidebar() {
		this.setState({ selectedFills: [], sidebarView: 'overview' });
	}
	
	/* Toolbar actions */

	handleViewChange(view) {
		this.setState({ view: view, selectedFills: [], sidebarView: 'overview'}, () => this.setFillData());		
	}
		
	handleLookbackChange(lookback) {
		this.setState({lookback: lookback, selectedFills: [], sidebarView: 'overview'}, () => this.setFillData());
	}

	handleGranularityChange(granularity) {
		const granularityCol = this.state.granularityCols[granularity.toLowerCase()];
		this.setState({ granularity: granularity, granularityCol: granularityCol, selectedFills: [], sidebarView: 'overview'}, () => this.setFillData());
	}
	
	handleTimelineTypeChange(timelineType) {
		this.setState({ timelineType: timelineType, selectedFills: [], sidebarView: 'overview'}, () => this.setFillData());
	}
	
	handleFilterEdit() {
		this.setState({ sidebarView: 'filters' });				
	}
	
	handleFilterClear() {
		let filters = this.state.filters;
		filters.map((f, i) => filters[i].filtered = []);
		this.setState({ filters: filters }, () => this.setFillData());
	}
	
	/* Timeline actions */
	
	handleTimelineGroupCollapseToggle(label) {
		let collapsedTimelineGroups = this.state.collapsedTimelineGroups;
		const labelIndex = collapsedTimelineGroups.indexOf(label);
		if (labelIndex < 0) {
			collapsedTimelineGroups.push(label);
		} else {
			collapsedTimelineGroups.splice(labelIndex, 1);
		}
		
		this.setState({ collapsedTimelineGroups: collapsedTimelineGroups });
	}

	handleCollapseAllTimelineGroupsToggle() {
		let collapsedTimelineGroups = this.state.collapsedTimelineGroups;
		const timelineGroupData = this.state.timelineGroupData;
		const allTimelineGroupsCollapsed = collapsedTimelineGroups.length === timelineGroupData.length;
		
		if (allTimelineGroupsCollapsed) {
			collapsedTimelineGroups = [];
		} else {
			collapsedTimelineGroups = timelineGroupData.map(g => g.label);
		}
		
		this.setState({ collapsedTimelineGroups: collapsedTimelineGroups });		
	}

	handleSelectFills(fills) {
		this.setState({ selectedFills: fills, sidebarView: 'selectedFills' });	
	}
	
	handleMouseOverFills(fills) {
		if (this.state.hoveredFills.toString() !== fills.toString()) {
			this.setState({ hoveredFills: fills });
		}
	}
	
	handleMouseOutFills() {
		if (this.state.hoveredFills.length > 0) {
			this.setState({ hoveredFills: [] });
		}
	}
	
	/* Table actions */
	
	handleTableSelectFill(fill) {
		this.setState({ selectedFills: [ fill ], sidebarView: 'selectedFills' });	
	}
	
	handleTableMouseOverFill(fill) {
		if (this.state.hoveredFills.toString() !== fill.toString()) {
			this.setState({ hoveredFills: [ fill ] });
		}
	}
	
	handleTableMouseOutFill() {
		if (this.state.hoveredTableFill != null) {
			this.setState({ hoveredTableFill: null });
		}
	}
	
	render() {
		return (
			<div className='App'>
					<div className="row no-gutters">
						<div className="col-sm-8 main-area position-fixed">						
							<Toolbar
								patientName={this.state.patientName}
								view={this.state.view}
								granularity={this.state.granularity}
								timelineType={this.state.timelineType}
								lookback={this.state.lookback}
								filters={this.state.filters}
								minDate={this.minDate}
								maxDate={this.maxDate}
								onTimelineTypeChange={this.handleTimelineTypeChange}
								onGranularityChange={this.handleGranularityChange}
								onViewChange={this.handleViewChange}
								onLookbackChange={this.handleLookbackChange} 
								onFilterEdit={this.handleFilterEdit}
								onFilterClear={this.handleFilterClear} />
								
							<div className="main-area-content">
								<div className="row">
									<div className="col">
										<Legend
											timelineType={this.state.timelineType}
											onCollapseAllTimelineGroupsToggle={this.handleCollapseAllTimelineGroupsToggle}
											allTimelineGroupsCollapsed={this.state.collapsedTimelineGroups.length === this.state.timelineGroupData.length}
										/>

										
									
										<TimelineRuler
											today={this.state.today}
											minDate={this.state.minDate}
											maxDate={this.state.maxDate}
											numDays={this.state.numDays}
										/>

										{this.state.timelineGroupData.length > 0 && this.state.timelineGroupData.map((group, i) => (
											<TimelineGroup
												timelineId={i}
												timelineGroupData={group}
												timelineFillBarData={this.state.timelineFillBarData.filter(f => f.label == group.label)}
												collapsedTimelineGroups={this.state.collapsedTimelineGroups}
												filteredFills={this.state.filteredFills}
												minDate={this.state.minDate}
												maxDate={this.state.maxDate}
												today={this.state.today}
												numDays={this.state.numDays}
												hoveredFills={this.state.hoveredFills}
												selectedFills={this.state.selectedFills}
												onSelectFills={this.handleSelectFills}
												onMouseOverFills={this.handleMouseOverFills}
												onMouseOutFills={this.handleMouseOutFills}
												onTimelineGroupCollapseToggle={this.handleTimelineGroupCollapseToggle}
												/>
										))}
									
										<div className="col d-flex flex justify-content-end">
											<div className="btn-group" role="group">
												{this.state.patientNames.map((n, i) => (
													<button
														type="button"
														className={n===this.state.patientName ? 'btn btn-light btn-sm active' : 'btn btn-light btn-sm'}
														onClick={() => this.handlePatientNameChange(n)}
														key={'patient-name-button-' + n}>
														{n}
													</button>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-4 selected-fills-sidebar position-fixed">								
							<Sidebar
								sidebarView={this.state.sidebarView}
								decisionSupport={this.getDecisionSupport()}
								fills={this.state.fills}
								selectedFills={this.state.selectedFills}
								hoveredFills={this.state.hoveredFills}
								onSelectFills={this.handleSelectFills}
								onMouseOverFills={this.handleMouseOverFills}
								onMouseOutFills={this.handleMouseOutFills}
								filteredFills={this.state.filteredFills}
								dateRangeFilteredFills={this.state.dateRangeFilteredFills}
								filters={this.state.filters}
								colors={this.state.colors}
								lookback={this.state.lookback}
								today={this.state.today}
								minDate={this.state.minDate}
								maxDate={this.state.maxDate}
								onFilterChange={this.handleFilterChange}
								onBulkFilterChange={this.handleBulkFilterChange}
								onCloseSidebar={this.handleCloseSidebar} />
						</div>
					</div>
			</div>
		);
	}
}

export default App;
