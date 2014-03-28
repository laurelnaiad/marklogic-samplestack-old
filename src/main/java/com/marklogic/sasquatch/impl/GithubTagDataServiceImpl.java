package com.marklogic.sasquatch.impl;

import javax.xml.bind.JAXBContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.marklogic.client.DatabaseClient;
import com.marklogic.client.document.DocumentDescriptor;
import com.marklogic.client.document.DocumentUriTemplate;
import com.marklogic.client.document.XMLDocumentManager;
import com.marklogic.client.io.JAXBHandle;
import com.marklogic.client.io.SearchHandle;
import com.marklogic.client.query.QueryManager;
import com.marklogic.client.query.StructuredQueryBuilder;
import com.marklogic.client.query.StructuredQueryDefinition;
import com.marklogic.sasquatch.domain.GithubTag;
import com.marklogic.sasquatch.marklogic.GithubTagDataService;

@Component
public class GithubTagDataServiceImpl implements GithubTagDataService  {
	
	@Autowired
	private DatabaseClient client;
	
	@Autowired
	private JAXBContext context;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public GithubTag get(String id) {
		GithubTag tag = new GithubTag();
		JAXBHandle handle = new JAXBHandle(context);
		handle.set(tag);
		XMLDocumentManager manager = client.newXMLDocumentManager();
		handle = manager.read(id, handle);
		return (GithubTag) handle.get();
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public String store(GithubTag bean) {
		JAXBHandle handle = new JAXBHandle(context);
		handle.set(bean);
		XMLDocumentManager manager = client.newXMLDocumentManager();
		DocumentUriTemplate descriptor = manager.newDocumentUriTemplate("xml");
		descriptor.setDirectory("/tags/");
		DocumentDescriptor newDoc = client.newXMLDocumentManager().create(
				descriptor, handle);
		return newDoc.getUri();
	}

	@Override
	public void delete(String id) {
		// TODO Auto-generated method stub

	}

	@Override
	public SearchHandle searchTags(String... terms) {
		QueryManager queryManager = client.newQueryManager();
		StructuredQueryBuilder qb = new StructuredQueryBuilder();
		StructuredQueryDefinition qdef = qb.and(qb.directory(true,  "/tags/"), qb.term(terms));
		SearchHandle results = queryManager.search(qdef, new SearchHandle(), 100);
		return results;
	}

	

}