package com.marklogic.samplestack.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.marklogic.client.ResourceNotFoundException;
import com.marklogic.client.document.ServerTransform;
import com.marklogic.client.io.InputStreamHandle;
import com.marklogic.client.io.SearchHandle;
import com.marklogic.client.io.StringHandle;
import com.marklogic.client.query.MatchDocumentSummary;
import com.marklogic.client.query.QueryDefinition;
import com.marklogic.client.query.StructuredQueryBuilder;
import com.marklogic.samplestack.domain.ClientRole;
import com.marklogic.samplestack.domain.Contributor;
import com.marklogic.samplestack.exception.SampleStackException;
import com.marklogic.samplestack.exception.SampleStackIOException;
import com.marklogic.samplestack.service.ContributorService;
import com.marklogic.samplestack.service.SamplestackNotFoundException;

@Component
public class ContributorServiceImpl extends AbstractMarkLogicDataService implements
		ContributorService {

	private final Logger logger = LoggerFactory
			.getLogger(ContributorServiceImpl.class);
	
	private final String DIR_NAME = "/contributors/";

	@Override
	public Contributor get(String id) {
		try {
			String documentUri = DIR_NAME + id.toString() + ".json";
			logger.debug("Fetching document uri +" + documentUri);
			InputStreamHandle handle = jsonDocumentManager(ClientRole.SAMPLESTACK_CONTRIBUTOR).read(documentUri,
					new InputStreamHandle());
			return mapper.readValue(handle.get(), Contributor.class);
		} catch (ResourceNotFoundException e) {
			throw new SamplestackNotFoundException();
		} catch (IOException e) {
			throw new SampleStackIOException(e);
		}
	}

	@Override
	public void store(Contributor contributor) {
		logger.info("Storing contributor id " + contributor.getId());
		
		String jsonString = null;
		try {
			jsonString = mapper.writeValueAsString(contributor);
		} catch (JsonProcessingException e) {
			throw new SampleStackException(e);
		}
		jsonDocumentManager(ClientRole.SAMPLESTACK_CONTRIBUTOR).write(DIR_NAME + contributor.getId() + ".json", new StringHandle(
				jsonString));
	}

	@Override
	public void delete(String id) {
		jsonDocumentManager(ClientRole.SAMPLESTACK_CONTRIBUTOR).delete(DIR_NAME + id.toString() + ".json");
	}

	@Override
	// TODO remove, not needed?
	public List<Contributor> search(String queryString) {
		SearchHandle handle = operations.searchDirectory(ClientRole.SAMPLESTACK_CONTRIBUTOR, DIR_NAME, queryString);
		return asList(handle);
	}

	
	// TODO refactor to use multipart response
	private List<Contributor> asList(SearchHandle handle) {
		List<Contributor> l = new ArrayList<Contributor>();
		for (MatchDocumentSummary summary : handle.getMatchResults()) {
			String docUri = summary.getUri();
			String id;
			id =docUri.replace(DIR_NAME, "").replace(".json", "");
			l.add(get(id));
		}
		return l;
	}
	
	@Override
	public List<Contributor> list(long start) {
		StructuredQueryBuilder qb = new StructuredQueryBuilder("contributors");
		QueryDefinition qdef = qb.directory(true, "/contributors/");
		SearchHandle handle = operations.search(ClientRole.SAMPLESTACK_CONTRIBUTOR, qdef, start);
		return asList(handle);
	}

	@Override
	public Contributor getByUserName(String userName) {
		StructuredQueryBuilder qb = new StructuredQueryBuilder("contributors");
		//TODO repository/facade/json property
		QueryDefinition qdef = qb.and(
				qb.directory(true, "/contributors/"),
				qb.value(qb.element("userName"), userName));
				
		SearchHandle handle = operations.search(ClientRole.SAMPLESTACK_CONTRIBUTOR, qdef);
		List<Contributor> results = asList(handle);
		return results.get(0);
	}

	
}