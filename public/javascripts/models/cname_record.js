function Validation(data, obj) {
	var self = this;
	self.obj = obj;
	self.fieldName = data.split(".")[1];
	
	self.required = function() {
		if(self.fieldName == undefined) return "";
		var fieldLabel = self.obj.fieldNames[self.fieldName];
		return fieldLabel + " is missing or incorrectly formatted.";
	}

}


function CNAME_Record(data) {
	var self = this;
    this.hostname = ko.observable(data.hostname);
    this.target = ko.observable(data.target);
	this.domain_id = ko.observable(domain_id);
	this.id = ko.observable(data.id);
	
	this.fieldNames = {
			hostname: "Hostname",
			target: "Target",
	}
	
	this.create = function(){
		var ko_json = ko.toJSON({'cname_record': this});
		var json_object = JSON.parse(ko_json);
		var url = "/cname_records";
		$.ajax({
			url: "/cname_records",
			type: "POST",
			dataType: "json",
			data: json_object,
			success: function() {
				return true;
			},
			error: function(data) {
				var response = JSON.parse(data.responseText);
				var msg = "There was a validation error for your CNAME Record.\n";
				$.each(response, function(k,v){
					var validation = new Validation(k, self);
					msg = msg + validation.required() + '\n';
				});
				alert(msg);

			},
		});
	}
	
	this.update = function(){
		var ko_json = ko.toJSON({'cname_record': this});
		var json_object = JSON.parse(ko_json);
		var resource_url = "/cname_records/" + this.id();
		$.ajax({
			url: resource_url,
			type: "PUT",
			dataType: "json",
			data: json_object,
			success: function(data) {
				console.log(data);
			}
		});
	}
	
	this.destroy = function(){
		var resource_url = "/cname_records/" + this.id();
		$.ajax({
			url: resource_url,
			type: "DELETE",
		});
	}
	
}

function CNAME_RecordViewModel() {
    // Data
    var self = this;
    self.cname_records = ko.observableArray([]);
    self.new_cname_record = ko.observable();
	self.new_cname_record_hostname = ko.observable();
	self.new_cname_record_target = ko.observable();
	self.domain_id = ko.observable();
	
	self.sort_records = function() {
		self.cname_records.sort(function(first, last){
			return first.hostname() == last.hostname() ? 0 : (first.hostname() < last.hostname() ? -1 : 1)
		});
	}
	
    // Operations
    self.addCNAME_Record = function() {
		var cname_record = new CNAME_Record({
			hostname: this.new_cname_record_hostname(),
			target: this.new_cname_record_target(),
			domain_id: this.domain_id()
		});
		
		var create_response = cname_record.create();
		//if(create_response == true) {
	        self.cname_records.push(cname_record);
	        self.new_cname_record_hostname("");
			self.new_cname_record_target("");
			//} else {
			console.log(create_response);
			//}
		 
		self.sort_records();
    };
	
	self.saveCNAME_Record = function(cname_record) {
		cname_record.update();
	}
	
    self.removeCNAME_Record = function(cname_record) { 
		self.cname_records.remove(cname_record);
		cname_record.destroy();
	};

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("/domains/"+ domain_id + "/cname_records", function(allData) {
        var mappedCNAME_Records = $.map(allData, function(item) { return new CNAME_Record(item) });
        self.cname_records(mappedCNAME_Records);
		self.sort_records();
	});
}
