package com.marklogic.samplestack.domain;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Abstract class to support a thinly wrapped JSON node, 
 * intended largely as a pass-through object to the browser client.
 * TODO use facade annotation to determine field name for Id.
 *
 */
public abstract class JsonObjectWrapper {
	
	protected ObjectNode json;

	protected JsonObjectWrapper(ObjectNode json) {
		this.json = json;
	}
	
	public String getId() {
		return json.get("id").asText();
	}
	
	public void setId(String id) {
		json.put("id", id);
	}
	
	public JsonNode getJson() {
		return json;
	}
	
}
