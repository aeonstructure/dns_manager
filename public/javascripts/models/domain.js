function Domain(data) {
	this.id = ko.observable(data.id);
	this.name = ko.observable(data.name);
    this.responsible_party = ko.observable(data.responsible_party);
    this.serial_number = ko.observable(data.serial_number);
	this.refresh_time = ko.observable(data.refresh_time);
	this.retry_time = ko.observable(data.retry_time);

	
	this.create = function(){
		var ko_json = ko.toJSON({'domain': this});
		var json_object = JSON.parse(ko_json);
		var url = "/domains";
		$.ajax({
			url: "/domains",
			type: "POST",
			dataType: "json",
			data: json_object,
			success: function(data) {
				console.log(data);
			}
		});
	}
	
	this.update = function(){
		var ko_json = ko.toJSON({'domain': this});
		var json_object = JSON.parse(ko_json);
		var resource_url = "/domains/" + this.id();
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
		var resource_url = "/domains/" + this.id();
		$.ajax({
			url: resource_url,
			type: "DELETE",
		});
	}
	
}

function DomainViewModel() {
    // Data
    var self = this;
    self.domains = ko.observableArray([]);
    self.new_domain = ko.observable();
	self.new_domain_name = ko.observable();
	self.new_domain_responsible_party = ko.observable();
	self.new_domain_refresh_time = ko.observable();
	self.new_domain_retry_time = ko.observable();
	self.id = ko.observable();
	
	self.sort_records = function() {
		self.domains.sort(function(first, last){
			return first.name() == last.name() ? 0 : (first.name() < last.name() ? -1 : 1)
		});
	}
	
    // Operations
    self.addDomain = function() {
		var domain = new Domain({
			name: this.new_domain_name(),
			responsible_party: this.new_domain_responsible_party(),
			refresh_time: this.new_domain_refresh_time(),
			retry_time: this.new_domain_retry_time(),
			serial_number: '1',
		});
		 
        self.domains.push(domain);
        self.new_domain_name("");
		self.new_domain_responsible_party("");
		self.new_domain_refresh_time("");
		self.new_domain_retry_time("");
		
		domain.create();
		self.sort_records();
    };
    
    self.editRecords = function() {
    	window.location = '/domains/' + this.id(); 
    }
	
	self.saveDomain = function(domain) {
		domain.update();
	}
	
    self.removeDomain = function(domain) { 
		self.domains.remove(domain);
		domain.destroy();
	};

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("/domains/all_json", function(allData) {
        var mappedDomains = $.map(allData, function(item) { return new Domain(item) });
        self.domains(mappedDomains);
		self.sort_records();
	});
}