var accela = require('accela-construct');
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

accela.setup(config);

var app = express();
app.use(bodyParser());

app.post('/', function(req, res){

	// Get JSON payload from Fulcum.
	var body = req.body;

	// If the JSON is for a new record.
	if(body.type = 'record.create') {
		
		createdBy = body.data.created_by;
		var form_values = body.data.form_values;
		var description = "Type: " + form_values['dd7a604f-27dc-c43c-b639-9cc6efcf40b6']['choice_values'];
		description += ". Location: " + form_values['7e9ddb83-c821-c5b5-8608-1241f3a65179']['choice_values'];
		var address = form_values['09ed'];

		// New record to be added to Accela Automation.
		record = {
		    module: "ServiceRequest",
		    createdBy: createdBy,
		    serviceProviderCode: "ISLANDTON",
		    type: {
		        subType: "Graffiti",
		        group: "ServiceRequest",
		        text: "Graffiti",
		        value: "ServiceRequest/Graffiti/Graffiti/NA",
		        type: "Graffiti",
		        module: "ServiceRequest"
		    },
		    description: description
		}
		
		// Address to attach to record.
		addresses = [
		    {
		        xCoordinate: body.data.longitude,
		        yCoordinate: body.data.latitude,
		        streetStart: parseInt(address['sub_thoroughfare']),
		        streetName: address['thoroughfare'],
		        city: address['locality'],
		        state: {
				     "text": address['admin_area'],
				     "value": address['admin_area']
				   },
		        postalCode: address['postal_code']
		    }
		]
		
		// A record comment to hold URL to the picture submitted with graffiti report. 
		var comment = [
		    {
		        text: form_values['4a4eb0a4-b074-ee94-91f9-cbe14ce89a9e'][0].url
		    }
		]

		// Create a new record in Accela Automation.
		accela.records.createRecord(null, JSON.stringify(record), function(error, response, body) {
			
			// Add record.
			if (!error && response.statusCode == 200) {
				console.log('Created a new record in Accela Automation.');
				response = JSON.parse(body);

				// The ID of the newly created record.
				var record_id = response.result.id;
				
				// Attach the address to the new record.
				accela.records.createRecordAddresses({recordID: record_id}, JSON.stringify(addresses), function(error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log('Added address information to record.');
						// Add a comment to the new record.
						accela.records.createRecordComments({recordID: record_id}, JSON.stringify(comment), function(error, response, body) {
							if (!error && response.statusCode == 200) {
								console.log('Added URL to media file to record.');
								console.log('Record successfully created. ID: ' + record_id);
						    }
						    else {
						    	console.log('Could not add comment: ' + response.statusCode);
						    }
						});
				    }
				    else {
				    	console.log('Could not add addresses: ' + response.statusCode + '. ' + body);
				    }
				});
		    }
		    else {
		    	console.log('Could not create new record: ' + response.statusCode);
		    }
		});
	
	}

	// Send back response to Fulcrum.
  	res.status(200).end();
});

app.listen(3000);