package controllers;

import play.*;
import play.mvc.*;
import play.data.validation.*;

import java.util.*;

import models.*;


public class Domains extends Application {

    public static void index() {
		List<Domain> domains = Domain.findAll();
		renderJSON(Domain.listToJsonString(domains));
    }
	
	public static void create() {
		Domain domain = new Domain();
		render("@form", domain);
	}
	
	public static void show(Long id) {
		Domain domain = Domain.findById(id);
		render("@form", domain);
	}
	
    public static void show_json(Long id) {
        
    }
	
	public static void edit(Long id) {
		Domain domain = Domain.findById(id);
		render("@form", domain);
	}
	
	@Check("admin")
	public static void update(@Valid Domain domain) {
		if(validation.hasErrors()) {
			if(request.isAjax()) error("WRONG!");
			render("@form", domain);
		}
		domain.save();
		index();
	}
	
	@Check("admin")
    public static void destroy(Long id) {
        Domain domain = Domain.findById(id);
        domain.delete();
        
    }
	
	public static void a_records(Long id) {
        List<A_Record> records;
        Domain domain;
        domain = Domain.findById(id);
        records = domain.a_records;
        renderJSON(A_Record.listToJsonString(records));
	}
	
	public static void cname_records(Long id) {
        List<CNAME_Record> records;
        Domain domain;
        domain = Domain.findById(id);
        records = domain.cname_records;
        renderJSON(CNAME_Record.listToJsonString(records));
	}
	
	public static void mx_records(Long id) {
        List<MX_Record> records;
        Domain domain;
        domain = Domain.findById(id);
        records = domain.mx_records;
        renderJSON(MX_Record.listToJsonString(records));
	}
	
	public static void txt_records(Long id) {
        List<TXT_Record> records;
        Domain domain;
        domain = Domain.findById(id);
        records = domain.txt_records;
        renderJSON(TXT_Record.listToJsonString(records));
	}
	
	
	public static void all_json() {
        List<Domain> domains;
        domains = Domain.findAll();
        renderJSON(Domain.listToJsonString(domains));
	}

}
