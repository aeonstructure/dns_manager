package controllers;

import play.*;
import play.mvc.*;
import play.data.validation.*;

import java.util.*;

import models.*;

public class TXT_Records extends Application {

    public static void index(Long domain_id) {
        List<TXT_Record> txt_records;
        Domain domain;
        domain = Domain.findById(domain_id);
        txt_records = domain.txt_records;
        renderJSON(TXT_Record.listToJsonString(txt_records));
    }
    
	@Check("admin")
    public static void create(@Valid TXT_Record txt_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap());
		}
		txt_record.domain = Domain.findById(txt_record.domain_id);
        txt_record.save();
    }
    
    public static void show(Long id) {
        
    }
    
    public static void show_json(Long id) {
        
    }
    
	@Check("admin")
    public static void update(@Valid TXT_Record txt_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap().toString());
		}
        txt_record.save();
    }
    
	@Check("admin")
    public static void destroy(Long id) {
        TXT_Record txt_record = TXT_Record.findById(id);
        txt_record.delete();
    }
    
}
