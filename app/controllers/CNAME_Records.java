package controllers;

import play.*;
import play.mvc.*;
import play.data.validation.*;

import java.util.*;

import models.*;

public class CNAME_Records extends Application {

    public static void index(Long domain_id) {
        List<CNAME_Record> cname_records;
        Domain domain;
        domain = Domain.findById(domain_id);
        cname_records = domain.cname_records;
        renderJSON(CNAME_Record.listToJsonString(cname_records));
    }
    
    public static void create(@Valid CNAME_Record cname_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap());
		}
		cname_record.domain = Domain.findById(cname_record.domain_id);
        cname_record.save();
    }
    
    public static void show(Long id) {
        
    }
    
    public static void show_json(Long id) {
        
    }
    
    public static void update(@Valid CNAME_Record cname_record) {
		if(validation.hasErrors()) {
			response.status = 400;
			renderJSON(validation.errorsMap().toString());
		}
        cname_record.save();
    }
    
    public static void destroy(Long id) {
        CNAME_Record cname_record = CNAME_Record.findById(id);
        cname_record.delete();
    }
    
}
