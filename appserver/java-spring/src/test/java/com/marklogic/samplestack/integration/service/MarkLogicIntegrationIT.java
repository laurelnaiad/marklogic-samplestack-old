/*
 * Copyright 2012-2014 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
package com.marklogic.samplestack.integration.service;

import java.io.IOException;

import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.marklogic.client.document.JSONDocumentManager;
import com.marklogic.client.io.JacksonHandle;
import com.marklogic.samplestack.domain.ClientRole;
import com.marklogic.samplestack.domain.SamplestackType;
import com.marklogic.samplestack.exception.SamplestackIOException;
import com.marklogic.samplestack.service.ContributorService;
import com.marklogic.samplestack.service.MarkLogicOperations;
import com.marklogic.samplestack.service.QnAService;
import com.marklogic.samplestack.testing.Utils;

public abstract class MarkLogicIntegrationIT {

	@Autowired
	protected MarkLogicOperations operations;

	@Autowired
	protected ContributorService contributorService;

	@Autowired
	protected QnAService qnaService;

	@Autowired
	protected ObjectMapper mapper;

	protected JSONDocumentManager contribManager;

	protected ObjectNode content;

	public void setup(String testUri) {
		// write a document using writer connection.
		content = mapper.createObjectNode();
		content.put("body", "content");
		contribManager = operations
				.newJSONDocumentManager(ClientRole.SAMPLESTACK_CONTRIBUTOR);
		contribManager.write(testUri, new JacksonHandle(content));
	}

	protected JsonNode getTestJson(String testPath) {
		ClassPathResource r = new ClassPathResource(testPath);
		try {
			return mapper.readValue(r.getInputStream(), JsonNode.class);
		} catch (IOException e) {
			throw new SamplestackIOException(e);
		}
	}

	private boolean initialized = false;

	@Before
	public void cleanout() {
		if (!initialized) {
			operations.deleteDirectory(ClientRole.SAMPLESTACK_CONTRIBUTOR,

			SamplestackType.QUESTIONS);
			operations.deleteDirectory(ClientRole.SAMPLESTACK_CONTRIBUTOR,
					SamplestackType.CONTRIBUTORS);
			contributorService.store(Utils.joeUser);
			contributorService.store(Utils.maryUser);
		}
		initialized = true;
	}
}
