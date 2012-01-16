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


function A_Record(data) {
	var self = this;
    this.hostname = ko.observable(data.hostname);
    this.ipv4_address = ko.observable(data.ipv4_address);
	this.domain_id = ko.observable(domain_id);
	this.id = ko.observable(data.id);
	
	this.fieldNames = {
			hostname: "Hostname",
			ipv4_address: "IPv4 Address",
	}
	
	this.create = function(){
		var ko_json = ko.toJSON({'a_record': this});
		var json_object = JSON.parse(ko_json);
		var url = "/a_records";
		$.ajax({
			url: "/a_records",
			type: "POST",
			dataType: "json",
			data: json_object,
			success: function() {
				return true;
			},
			error: function(data) {
				var response = JSON.parse(data.responseText);
				var msg = "There was a validation error for your A Record.\n";
				$.each(response, function(k,v){
					var validation = new Validation(k, self);
					msg = msg + validation.required() + '\n';
				});
				alert(msg);

			},
		});
	}
	
	this.update = function(){
		var ko_json = ko.toJSON({'a_record': this});
		var json_object = JSON.parse(ko_json);
		var resource_url = "/a_records/" + this.id();
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
		var resource_url = "/a_records/" + this.id();
		$.ajax({
			url: resource_url,
			type: "DELETE",
		});
	}
	
}

function A_RecordViewModel() {
    // Data
    var self = this;
    self.a_records = ko.observableArray([]);
    self.new_a_record = ko.observable();
	self.new_a_record_hostname = ko.observable();
	self.new_a_record_ipv4_address = ko.observable();
	self.domain_id = ko.observable();
	
	self.sort_records = function() {
		self.a_records.sort(function(first, last){
			return first.hostname() == last.hostname() ? 0 : (first.hostname() < last.hostname() ? -1 : 1)
		});
	}
	
    // Operations
    self.addA_Record = function() {
		var a_record = new A_Record({
			hostname: this.new_a_record_hostname(),
			ipv4_address: this.new_a_record_ipv4_address(),
			domain_id: this.domain_id()
		});
		
		create_response = a_record.create();
		if(create_response == true) {
	        self.a_records.push(a_record);
	        self.new_a_record_hostname("");
			self.new_a_record_ipv4_address("");
		} else {
			console.log(create_response);
		}
		 
		self.sort_records();
    };
	
	self.saveA_Record = function(a_record) {
		a_record.update();
	}
	
    self.removeA_Record = function(a_record) { 
		self.a_records.remove(a_record);
		a_record.destroy();
	};

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("/domains/"+ domain_id + "/a_records", function(allData) {
        var mappedA_Records = $.map(allData, function(item) { return new A_Record(item) });
        self.a_records(mappedA_Records);
		self.sort_records();
	});
}