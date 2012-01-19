package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;
 
public class Security extends Secure.Security {
    
    static boolean authenticate(String username, String password) {
        User user = User.find("byEmail", username).first();
        return user != null && user.password.equals(password);
    }
}