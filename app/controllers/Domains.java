package controllers;

import play.*;
import play.mvc.*;
import play.data.validation.*;

import java.util.*;

import models.*;


public class Domains extends Application {

    public static void index() {
		List<Domain> domains = Domain.findAll();
        render(domains);
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
	
	public static void update(@Valid Domain domain) {
		if(validation.hasErrors()) {
			if(request.isAjax()) error("WRONG!");
			render("@form", domain);
		}
		domain.save();
		index();
	}
	
    public static void destroy(Long id) {
        
    }
	
	public static void a_records(Long id) {
        List<A_Record> a_records;
        Domain domain;
        domain = Domain.findById(id);
        a_records = domain.a_records;
        renderJSON(A_Record.listToJsonString(a_records));
	}
	
	public static void all_json() {
        List<Domain> domains;
        domains = Domain.findAll();
        renderJSON(Domain.listToJsonString(domains));
	}

}
