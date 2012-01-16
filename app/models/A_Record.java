package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import play.data.validation.Required;
import play.data.validation.IPv4Address;
import serializationstrategies.ExposeForLightSerialization;

@Entity
public class A_Record extends LightSerializedModel {
	@Required
	@ExposeForLightSerialization
	public String hostname;

	@Required
	@IPv4Address
	@ExposeForLightSerialization
	public String ipv4_address;
	
	@Transient
	public Long domain_id;
	
	@ManyToOne
//	@Required
	@ExposeForLightSerialization
	public Domain domain;
}