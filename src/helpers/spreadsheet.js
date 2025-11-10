import config from "../config";
/**
 * Load the fills from the spreadsheet
 * Get the right values from it and assign.
 */
export function load(callback) {
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: config.spreadsheetId,
        range: "Sheet1!A2:AD"
      })
      .then(
        response => {
          const data = response.result.values;
          const fills = data.map((fill, i) => ({
			id: i,
			patientName: fill[1],
			formattedDrugName: fill[2],
			startDate: fill[3],
			endDate: fill[4],
			prescriber: fill[5],
			pharmacy: fill[6],
			quantity: fill[7],
			daysSupply: fill[8],
			drugName: fill[12],
			drugNameWithStrength: fill[13],
			genericDrugName: fill[20],
			masterForm: fill[21],
			strengthPerUnit: fill[22],
			units: fill[23],
			drug: fill[24],
			MMEFactor: fill[25],
			totalMME: fill[26],
			dailyMME: fill[27],
			drugClass: fill[28],
			drugWithStrength: fill[29]
          })) || [];
          callback({
            fills
          });
        },
        response => {
          callback(false, response.result.error);
        }
      );
  });
}