Aeon = window.Aeon || {};

Aeon.UI = window.Aeon.UI || {};

Aeon.UI.Model = window.Aeon.UI.Model || {};

Aeon.UI.Model = function(){
    var self                = this;
    this.fields             = null;
    this.collection_url     = null;
    this.container          = null;
    this.new_resource_url   = null;
    this.class_name         = null;
    this._class_name_plural = null;
    this.base_url           = null;
    this.id_prefix          = "aeon_";
    this.name               = null;
    
    this.new_record_form = function (){
        var fields = this.fields;
        var new_record_form = $("<div></div>");
        var new_record_uuid = this.id_prefix + createUUID();

        new_record_form.attr("id", new_record_uuid);
        new_record_form.attr("resource_url", this.new_resource_url);
        new_record_form.attr("class_name", this.class_name);

        for (var i=fields.length; i--;) {
        	var input_wrapper = $('<input/>');
        	input_wrapper.attr("key", fields[i]);
        	input_wrapper.attr("placeholder", fields[i]);
        	if(fields[i] == "id"){
        		input_wrapper.attr("type", "hidden");
        	} else {
        		input_wrapper.attr("type", "text");
        	}
        	$(new_record_form).append(input_wrapper);
        }
        var domain_id_input = $('<input/>');
        domain_id_input.attr("key", "domain_id");
        domain_id_input.attr("value", "${domain.id}");
        domain_id_input.attr("type", "hidden");
        $(new_record_form).append(domain_id_input);

        var new_record_button = $("<button></button>");
        new_record_button.text("Add");
        new_record_button.attr("onClick", self.name + "add('" + new_record_uuid + "')");
        $(new_record_form).append(new_record_button);
        
        return new_record_form;
    }
    
    this.clear_form = function(ui_model){
    	ui_model.children("input").each(function(i, field){
    		$(field).attr("value", "");
    	});
    }
    
    this.add = function(ui_id){
    	var ui_model = $('#' + ui_id);
    	var resource_url = ui_model.attr("resource_url");
    	var record = build_json(ui_model);

    	console.log(record);

    	$.ajax({
    		url: resource_url,
    		dataType: 'json',
    		type: 'POST',
    		data: record,
    		success: function(data){
    			console.log('WTF?!');
    		}
    	});

    	this.clear_form(ui_model);

    	this.load();

    }
    
    this.update = function(ui_id) {
    	var ui_model = $('#' + ui_id);
    	var resource_url = ui_model.attr("resource_url");
    	var record = this.object_from_form(ui_model);

    	$.ajax({
    		url: resource_url,
    		dataType: 'json',
    		type: 'PUT',
    		data: record,
    		success: function(data){
    			console.log(self.class_name + ' Record Updated');
    		}
    	});

    }
    
    this.destroy = function(resource_url){
    	$.ajax({
    		url: resource_url,
    		type: "DELETE",
    		success: function(data){
    			self.load();
    		}
    	});
    }
    
    this.load = function(){
        var fields = this.fields;
        var container = $(this.container).children("#LIST");
        
    	$.ajax({
    		url: self.collection_url,
    		dataType: 'json',
    		success: function(data) {
    			container.html("");
    			$.each(data, function(i, item){
    				var model_wrapper = $("<div></div>");
    				var model_guid = self.id_prefix + createUUID();
    				model_wrapper.attr("id", model_guid);
    				model_wrapper.attr("resource_url", item.resource_url);
    				model_wrapper.attr("class_name", item.class_name);

    				for (var i=fields.length; i--;) {
    					var input_wrapper = $('<input/>');
    					input_wrapper.attr("onBlur", self.name + ".update('" + model_guid + "')");
    					input_wrapper.attr("key", fields[i]);
    					input_wrapper.attr("value", item[fields[i]]);
    					if(fields[i] == "id"){
    						input_wrapper.attr("type", "hidden");
    					} else {
    						input_wrapper.attr("type", "text");
    					}
    					$(model_wrapper).append(input_wrapper);
    				}

    				var destroy = $("<div></div>");
    				destroy.attr("onClick", "destroy('" + item.resource_url + "')");
    				destroy.text("Delete");
    				destroy.addClass("inline-block");
    				model_wrapper.append(destroy);
    				container.append(model_wrapper);

    			});
    		},

    		error: function() {
    			console.log('WHOOPS');
    		}
    	});
    }
    
    this.object_from_form = function(ui_model) {
    	var class_name = ui_model.attr("class_name");

    	var record = new Object();
    	var attributes = new Object();

    	ui_model.children("input").each(function(i, field){
    		var key = $(field).attr("key");
    		var value = $(field).attr("value");
    		attributes[key] = value;
    	});

    	record[class_name] = attributes;

    	return record;
    }
    

    
    this.init = function() {
        $(this.container).children("#ADDFORM").append(this.new_record_form());
    	this._class_name_plural = this.class_name + 's';
    	if(this.new_resource_url == null) {
    	    this.new_resource_url = "/" + this._class_name_plural
    	}
    	
    	if(this.base_url == null) {
    	    this.collection_url = "/" + this._class_name_plural;
    	} else {
    	    this.collection_url = this.base_url + "/" + this._class_name_plural;
    	}
    	
    	this.load();
    }
    
}