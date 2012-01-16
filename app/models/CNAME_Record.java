package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import play.data.validation.Required;
import serializationstrategies.ExposeForLightSerialization;

@Entity
public class CNAME_Record extends LightSerializedModel {
	@Required
	@ExposeForLightSerialization
	public String hostname;

	@Required
	@ExposeForLightSerialization
	public String target;
	
	@Transient
	public Long domain_id;
	
	@ManyToOne
	@ExposeForLightSerialization
	public Domain domain;
}
