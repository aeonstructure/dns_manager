Aeon.UI = window.Aeon.UI || {};
Aeon.UI = function(model){
    var self = this;
    this.model = model;
    
    this.input = function(options){
        var action_noun = options.action[0];
        var action_verb = options.action[1];
        var key = options.key;
        var value = options.value;
        var type = options.type || "text";
        var placeholder = options.placeholder;
        var css_class = options.css_class;
        var id = options.id || createUUID();
        var wrapper_ui = $('<input/>');
        
        $('#' + id).live(action_noun,function(){
            eval(action_verb);
            });
        
	    wrapper_ui.attr("id", id);
		wrapper_ui.attr("key", key);
		wrapper_ui.attr("value", value);
		wrapper_ui.addClass(css_class);
		
		if(placeholder != null) {
		    wrapper_ui.attr("placeholder", placeholder);
		}
        wrapper_ui.attr("type", type);
		
		return wrapper_ui;
    }
    
    this.span = function(options){
        var action_noun = options.action[0];
        var action_verb = options.action[1];
        var key = options.key;
        var value = options.value;
        var css_class = options.css_class;
        var wrapper_ui = $('<span/>');
        
		wrapper_ui.attr(action_noun, action_verb);
		wrapper_ui.attr("key", key);
		wrapper_ui.text(value);
		wrapper_ui.addClass(css_class);
		
		return wrapper_ui;
    }
    
    this.checkbox = function(options){
        var action_noun = options.action[0];
        var action_verb = options.action[1];
        var key = options.key;
        var value = options.value;
        var css_class = options.css_class;
        var wrapper_ui = $('<input/>');
        
		wrapper_ui.attr(action_noun, action_verb);
		wrapper_ui.attr("type", 'checkbox');
		wrapper_ui.attr("key", key);
		wrapper_ui.text(value);
		wrapper_ui.addClass(css_class);
		
		return wrapper_ui;
    }
    
    this.action = function(options){
        var action_noun = options.action_noun;
        var action_verb = options.action_verb;
        var text = options.text;
        var action_url = options.action_url;
        var id = options.id || createUUID();
        var action_ui = $("<div></div>");
        var model = this.model;
        
        action_ui.attr("id", id);
                
        $('#' + id).live(action_noun,function(){
            var parent = $(this).parent();
            var resource_url = parent.attr('resource_url');
            eval(action_verb +'("' + resource_url + '")');
            });
        action_ui.attr('onClick', '');
		action_ui.text(text);
		action_ui.addClass("inline-block button");
        
        return action_ui;
    }
    
    this.new_record_form = function (options){
        var id_prefix           = options.id_prefix;
        var new_resource_url    = options.new_resource_url;
        var class_name          = options.class_name;
        var fields              = options.fields;
        
        var keys = Object.keys(fields);
        var new_record_form = $("<div></div>");
        var new_record_uuid = id_prefix + createUUID();

        new_record_form.attr("id", new_record_uuid);
        new_record_form.attr("resource_url", new_resource_url);
        new_record_form.attr("class_name", class_name);

        for (var i=keys.length; i--;) {
            var id = createUUID();
            var key_name = keys[i];
            var type = fields[key_name]['type'] || 'text';
            var css_class = fields[key_name]['css_class'] || '';
            var value = fields[key_name]['value'] || '';
            var options = {
                id: id, 
                action: ["onBlur", "update_resource('" + new_record_uuid + "')"],
                key: keys[i],
                css_class: css_class,
                type: type,
                value: value,
                placeholder: keys[i],
            }
            var wrapper_ui = self.input(options);
            
        	$(new_record_form).append(wrapper_ui);
        }

        var new_record_button = $("<div></div>");
        var id = createUUID();
        new_record_button.text("Add");
        new_record_button.attr("id", id);
        new_record_button.attr("onClick", '');
        new_record_button.addClass('inline-block button');
        
        $('#' + id).live('click',function(){
                self.model.add(new_record_uuid)
        });
        $(new_record_form).append(new_record_button);
        
        return new_record_form;
    }
    
}