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
import com.marklogic.samplestack.SampleStackException;
import com.marklogic.samplestack.domain.Contributor;
import com.marklogic.samplestack.service.ContributorService;
import com.marklogic.samplestack.service.SamplestackNotFoundException;

@Component
public class ContributorServiceImpl extends AbstractMarkLogicDataService implements
		ContributorService {

	private final Logger logger = LoggerFactory
			.getLogger(ContributorServiceImpl.class);
	
	private final String DIR_NAME = "/contributors/";

	@Override
	public Contributor get(UUID id) {
		try {
			String documentUri = DIR_NAME + id.toString() + ".json";
			logger.debug("Fetching document uri +" + documentUri);
			InputStreamHandle handle = jsonDocumentManager.read(documentUri,
					new InputStreamHandle());
			return mapper.readValue(handle.get(), Contributor.class);
		} catch (ResourceNotFoundException e) {
			throw new SamplestackNotFoundException();
		} catch (IOException e) {
			throw new SampleStackException(e);
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
		//TODO after native JSON remove this transform
		ServerTransform inputTransform = new ServerTransform("json-in");
		jsonDocumentManager.write(DIR_NAME + contributor.getId() + ".json", new StringHandle(
				jsonString), inputTransform);
	}

	@Override
	public void delete(UUID id) {
		jsonDocumentManager.delete(DIR_NAME + id.toString() + ".json");
	}

	@Override
	public List<Contributor> search(String queryString) {
		// TODO fix with multipart response
		SearchHandle handle = operations.searchDirectory(DIR_NAME, queryString);
		return asList(handle);
	}

	private List<Contributor> asList(SearchHandle handle) {
		List<Contributor> l = new ArrayList<Contributor>();
		for (MatchDocumentSummary summary : handle.getMatchResults()) {
			String docUri = summary.getUri();
			UUID id = UUID.fromString(docUri.replace(DIR_NAME, "").replace(".json", ""));
			l.add(get(id));
		}
		return l;
	}
	
	@Override
	public List<Contributor> list(long start) {
		StructuredQueryBuilder qb = new StructuredQueryBuilder("contributors");
		QueryDefinition qdef = qb.directory(true, "/contributors/");
		SearchHandle handle = operations.search(qdef, start);
		return asList(handle);
	}

	
}
