import React, { Component } from 'react';
import Chart from "react-google-charts";
import logo from './logo.svg';
import './App.css';


// Reference : https://developers.google.com/chart/interactive/docs/gallery/timeline
const columns = [
	{ type: "string", id: "President" },
	{ type: "date", id: "Start" },
	{ type: "date", id: "End" }
];

const rows = [
	["Washington", new Date(1789, 3, 30), new Date(1797, 2, 4)],
	["Adams", new Date(1797, 2, 4), new Date(1801, 2, 4)],
	["Jefferson", new Date(1801, 2, 4), new Date(1809, 2, 4)]
];

class App extends Component {
	
	componentDidMount() {
		setInterval(() => {
			this.setState({ refresh: Date.now() });
		}, 1000);
	}
	
	render() {
		return (
			<div className="App">
				<Chart
					chartType="Timeline"
					data={[columns, ...rows]}
					width="100%"
					height="400px"
				/>
			</div>
		);
	}
}

export default App;
