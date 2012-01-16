package models;

import play.*;
import play.db.jpa.*;
import play.data.validation.*;

import javax.persistence.*;

import org.apache.commons.lang.StringUtils;

import java.util.*;

import serializationstrategies.ExcludeForLightSerializationStrategy;
import serializationstrategies.ExposeForLightSerialization;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@MappedSuperclass
public class LightSerializedModel extends Model {
	
	private static final String DATE_FORMAT = "EEE MMM dd HH:mm:ss 'GMT'Z yyyy";
	    // "Thu Dec 31 16:00:00 GMT-0800 2009"
	
	@Transient
	@ExposeForLightSerialization
    protected String class_name = getClassName(this.getClass());

    @Transient
	@ExposeForLightSerialization
	public String resource_url;

    @Transient
	//@ExposeForLightSerialization
    public String __class__ = this.getClass().getName();
	
	public static String getClassName(Class c) {
	    String FQClassName = c.getName().toLowerCase();
	    int firstChar;
	    firstChar = FQClassName.lastIndexOf ('.') + 1;
	    if ( firstChar > 0 ) {
	      FQClassName = FQClassName.substring ( firstChar );
	    }
	    return FQClassName;
	}	
	
	@PostLoad
	public void getResourceUrl() {
		String class_name = getClassName(this.getClass());
		String url = "/" + class_name + "s/" + this.id;
		this.resource_url = url;
	}
	
    /**
     * Light serialization
     */
    protected static final Gson GSON_LIGHT = new GsonBuilder().setDateFormat(DATE_FORMAT).setExclusionStrategies(new ExcludeForLightSerializationStrategy()).create();
        
    protected String toJsonLight() {
        JsonObject json = GSON_LIGHT.toJsonTree(this).getAsJsonObject();
        return json.toString();
    }
    
	public static String listToJsonString(List<? extends LightSerializedModel> objects) {
		List json_list = new ArrayList();
		for (LightSerializedModel obj : objects) {
	 		json_list.add(obj.toJsonLight());
	 	}
		String json_string = "[" + StringUtils.join(json_list, ",") + "]";
		return json_string;
	}
}