Aeon.UI.Model = window.Aeon.UI.Model || {};
ModelRegistry = window.ModelRegistry || [];

Aeon.UI.Model = function(){
    var self                = this;
    this.fields             = {};
    this.collection_url     = null;
    this.container          = null;
    this.new_resource_url   = null;
    this.class_name         = null;
    this._class_name_plural = null;
    this.base_url           = null;
    this.id_prefix          = "aeon_";
    this.add_form           = true;
    this.add_form_id        = 'ADDFORM';
    this.records            = null;
	this.isAdmin			= false;
    this.default_actions    = { 
        delete: {
            action_noun: 'click',
            action_verb: 'model.destroy',
            text: 'Delete'
        },
        edit: {
                action_noun: 'click',
                action_verb: 'model.edit',
                text: 'Edit Records'
            },
    };
    this.actions            = {delete: false, edit: false};
    this.ui_helper          = new Aeon.UI(this);
    
    ModelRegistry.push(this);
    
    this.build_records = function(data){
        var container = $(self.container).children("#LIST");
        var fields = self.fields;
        var field_keys = Object.keys(fields);
        var actions = this.actions;
        
        container.html("");
        $.each(data, function(i, item){
			var model_wrapper = $("<div></div>");
			var model_guid = self.id_prefix + createUUID();
			model_wrapper.attr("id", model_guid);
			model_wrapper.attr("resource_url", item.resource_url);
			model_wrapper.attr("class_name", item.class_name);

			for (var i=field_keys.length; i--;) {
			    var key_name = field_keys[i];
			    var domElement = fields[key_name]['domElement'] || 'input';
			    var css_class = fields[key_name]['css_class'] || '';
			    var type = fields[key_name]['type'] || 'text';
			    
			    switch(domElement)
                {
                case 'input':
                    var options = {
                        action: ["blur", "update_resource('" + model_guid + "')"],
                        key: key_name,
                        value: item[key_name],
                        css_class: css_class,
                        type: type
                    }
				    
					var input_element = self.ui_helper.input(options);
					if(self.isAdmin == false) {
				    	input_element.attr("disabled", "disabled");
				    }
					
                    $(model_wrapper).append(input_element);
                  break;
                case 'span':
                  var options = {
                      action: [],
                      key: key_name,
                      value: item[key_name],
                      css_class: css_class,
                  }
                  $(model_wrapper).append(self.ui_helper.span(options));
                  break;
                case 'checkbox':
                    var options = {
                          action: ["blur", "update_resource('" + model_guid + "')"],
                          key: key_name,
                          value: item[key_name],
                          css_class: css_class,
                      }
					  
  					var input_element = self.ui_helper.checkbox(options);
  					if(self.isAdmin == false) {
  				    	input_element.attr("disabled", "disabled");
  				    }
					
                      $(model_wrapper).append(input_element);
                      break;
                default:
                  console.log('The element type of ' + domElement + ' is not available.')
                }
			}
            
            for (action in actions) {
                if ($.inArray(action, self.default_actions) && actions[action] == true) {
                    actions[action] = self.default_actions[action];
                }
				if (actions[action] == false) {
                	delete actions[action];
					return;
				}
                
                var a = actions[action];
                var options = {}

                options.text = a.text;
                options.action_noun = a.action_noun;
                options.action_verb = a.action_verb;
                options.action_url = item.resource_url;
                var action_ui = self.ui_helper.action(options);
                model_wrapper.append(action_ui);
            }
			
			container.append(model_wrapper);
		});
        
    }
    
    this.add = function(ui_id){
    	var ui_model = $('#' + ui_id);
    	var resource_url = ui_model.attr("resource_url");
    	var record = object_from_form(ui_model);

    	$.ajax({
    		url: resource_url,
    		dataType: 'json',
    		type: 'POST',
    		data: record,
    		success: function(data){
    			console.log('Record Added');
    			self.load()
            	
    		}
    	});

    	self.clear_form(ui_model);
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
    
    this.edit = function(resource_url) {
        location = resource_url;
    }
    
    this.clear_form = function(ui_model){
    	ui_model.children("input").each(function(i, field){
    		$(field).attr("value", "");
    	});
    }
    
    this.load = function(){        
    	$.ajax({
    		url: self.collection_url,
    		dataType: 'json',
    		success: function(data) {
    			self.build_records(data);
    			self.records = data;
    		},
    		error: function() {
    			console.log('Unable to retrieve data from ' + self.collection_url);
    		}
    	});
    }
          
    this.init = function() {
    	this._class_name_plural = this.class_name + 's';
    	if(this.new_resource_url == null) {
    	    this.new_resource_url = "/" + this._class_name_plural
    	}
    	
    	if(this.base_url == null) {
    	    this.collection_url = "/" + this._class_name_plural;
    	} else {
    	    this.collection_url = this.base_url + "/" + this._class_name_plural;
    	}	    
    	if(this.add_form == true) {
            var options = {
                id_prefix:       this.id_prefix,
                new_resource_url:this.new_resource_url,
                class_name:      this.class_name,
                fields:          self.fields, 
            }
            $(this.container).children("#ADDFORM").append(self.ui_helper.new_record_form(options));
            
        }
    	
    	this.load();
    }
    
}

// Utility methods


var object_from_form = function(ui_model) {
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

var update_resource = function(ui_id) {
	var ui_model = $('#' + ui_id);
	var resource_url = ui_model.attr("resource_url");
	var record = object_from_form(ui_model);

	$.ajax({
		url: resource_url,
		dataType: 'json',
		type: 'PUT',
		data: record,
		success: function(data){
			console.log('Record Updated');
		}
	});

}



