import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';


class Table extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const hoveredFills = this.props.hoveredFills;
		const selectedFills = this.props.selectedFills;
		const label = '';
		const fills = this.props.fills;
		
		const customCaret = (order, column) => {
			if (!order) return (<span></span>);
			else if (order === 'asc') return (<span> <i class="fas fa-caret-up"></i></span>);
			else if (order === 'desc') return (<span> <i class="fas fa-caret-down"></i></span>);
			return null;
		  };
		  
		const customDateSort =  (a, b, order, dataField) => {
			const aDate = new Date(a).getTime();
			const bDate = new Date(b).getTime();
			
			if (order === 'desc') {
			return bDate - aDate;
			}
			return aDate - bDate; // asc
		}

			  
		const columns = [
		{
			dataField: 'fillDate',
			text: 'Fill Date',
			sort: true,
			sortCaret: customCaret,
			sortFunc: customDateSort
		},
		{
			dataField: 'id',
			text: 'ID',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'written',
			text: 'Written',
			sort: true,
			sortCaret: customCaret,
			sortFunc: customDateSort
		},
		{
			dataField: 'drug',
			text: 'Drug',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'qty',
			text: 'Qty',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'days',
			text: 'Days',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'rxNum',
			text: 'Rx #',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'prescriber',
			text: 'Prescriber',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'pharmacy',
			text: 'Pharmacy',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'refill',
			text: 'Refill',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'dailyDose',
			text: 'Daily Dose',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'paymentType',
			text: 'Payment Type',
			sort: true,
			sortCaret: customCaret
		},
		{
			dataField: 'pmp',
			text: 'PMP',
			sort: true,
			sortCaret: customCaret
		}
		]		
		
		let data = [];
		
		fills.forEach((f, i) => data.push({
			fillDate: f.startDate, 
			id: f.id, 
			written: '', 
			drug: f.drugNameWithStrength, 
			qty: f.quantity, 
			days: f.daysSupply, 
			rxNum: '', 
			prescriber: f.prescriber, 
			pharmacy: f.pharmacy, 
			refill: '', 
			dailyDose: '', 
			paymentType: '', 
			pmp: ''
		}));		
		
		const defaultSorted = [{
		  dataField: 'fillDate',
		  order: 'desc'
		}];
		
		const rowStyle = (row, index) => {
			const style = {};
			if (hoveredFills.indexOf(row.id) >= 0) style.backgroundColor = '#bee5eb';
			if (selectedFills.indexOf(row.id) >= 0) style.border = '3px solid #000000';
			return style;
		}
		
		const rowEvents = {
			onClick: (e, row, rowIndex) => {
			   let fill = row.id;
			   let fills = [];
			   
			   if (e.ctrlKey && selectedFills.length > 0) {
				   let selected = selectedFills;
				   let fillIndex = selected.indexOf(row.id);
				   
				   if (fillIndex >= 0) { 
						selected.splice(fillIndex, 1);
				   } else {
					   selected.push(fill);				   
				   }
				   fills = selected;
			   } else {
				   fills = [ fill ];
			   }
				this.props.onSelectFills(fills)
			},
			onMouseEnter: (e, row, rowIndex) => {
				this.props.onMouseOverFills([ row.id ])		
			},
			onMouseLeave: (e, row, rowIndex) => {
				this.props.onMouseOutFills()		
			}			
		};

		return (
			<div className="fv-table">
				{ data.length > 0 && (
					<div className="table-container">
						<BootstrapTable
						bootstrap4
						classes="fv-table table table-sm table-borderless"
						keyField="id"
						data={ data }
						columns={ columns }
						defaultSorted={ defaultSorted } 
						rowStyle={ rowStyle }
						rowEvents={ rowEvents }

						/>
					</div>
				)}
			</div>

		);
	}
}

export default Table;