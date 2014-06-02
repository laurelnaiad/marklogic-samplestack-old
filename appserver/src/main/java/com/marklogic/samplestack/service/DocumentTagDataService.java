package com.marklogic.samplestack.service;

import com.marklogic.client.io.SearchHandle;
import com.marklogic.samplestack.domain.DocumentTag;

public interface DocumentTagDataService {

	public DocumentTag get(String id);
	
	/**
	 * Stores a triple-based object and returns a document URI for it.
	 * @param bean
	 * @return
	 */
	public String store(DocumentTag tag);
	
	public void delete(String id);

	public SearchHandle searchTags(String... terms);
	
}
