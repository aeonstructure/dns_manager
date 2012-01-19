package controllers;

import play.*;
import play.mvc.*;
import play.data.validation.*;

import java.util.*;

import models.*;

public class A_Records extends Application {

    public static void index(Long domain_id) {
        List<A_Record> a_records;
        Domain domain;
        domain = Domain.findById(domain_id);
        a_records = domain.a_records;
        renderJSON(A_Record.listToJsonString(a_records));
    }
    
	@Check("admin")
    public static void create(@Valid A_Record a_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap());
		}
		a_record.domain = Domain.findById(a_record.domain_id);
        a_record.save();
    }
    
    public static void show(Long id) {
        
    }
    
    public static void show_json(Long id) {
        
    }
    
	@Check("admin")
    public static void update(@Valid A_Record a_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap().toString());
		}
        a_record.save();
    }
    
	@Check("admin")
    public static void destroy(Long id) {
        A_Record a_record = A_Record.findById(id);
        a_record.delete();
    }
    
}
