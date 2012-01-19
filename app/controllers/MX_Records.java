package controllers;

import play.*;
import play.mvc.*;
import play.data.validation.*;

import java.util.*;

import models.*;

public class MX_Records extends Application {

    public static void index(Long domain_id) {
        List<MX_Record> mx_records;
        Domain domain;
        domain = Domain.findById(domain_id);
        mx_records = domain.mx_records;
        renderJSON(MX_Record.listToJsonString(mx_records));
    }
    
	@Check("admin")
    public static void create(@Valid MX_Record mx_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap());
		}
		mx_record.domain = Domain.findById(mx_record.domain_id);
        mx_record.save();
    }
    
    public static void show(Long id) {
        
    }
    
    public static void show_json(Long id) {
        
    }
    
	@Check("admin")
    public static void update(@Valid MX_Record mx_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap().toString());
		}
        mx_record.save();
    }
    
	@Check("admin")
    public static void destroy(Long id) {
        MX_Record mx_record = MX_Record.findById(id);
        mx_record.delete();
    }
    
}
