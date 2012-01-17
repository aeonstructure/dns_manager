package models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;

import play.data.validation.Email;
import play.data.validation.Required;
import serializationstrategies.ExposeForLightSerialization;

@Entity
public class Domain extends LightSerializedModel {
	@Required
	@ExposeForLightSerialization
	public String name;
	
	@Required
	@Email
	@ExposeForLightSerialization
	public String responsible_party;
	
	@Required
	@ExposeForLightSerialization
	public Integer serial_number;
	
	@Required
	@ExposeForLightSerialization
	public Integer refresh_time;
	
	@Required
	@ExposeForLightSerialization
	public Integer retry_time;
	
    @OneToMany(cascade=CascadeType.ALL, mappedBy="domain")
    public List<A_Record> a_records;
	
    @OneToMany(cascade=CascadeType.ALL, mappedBy="domain")
    public List<CNAME_Record> cname_records;
	
    @OneToMany(cascade=CascadeType.ALL, mappedBy="domain")
    public List<MX_Record> mx_records;
	
}