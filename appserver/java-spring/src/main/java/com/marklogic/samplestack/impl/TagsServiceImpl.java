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
package com.marklogic.samplestack.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.marklogic.samplestack.domain.ClientRole;
import com.marklogic.samplestack.service.MarkLogicOperations;
import com.marklogic.samplestack.service.TagsService;

/**
 * Implementation of TagsService
 */
@Component
public class TagsServiceImpl implements TagsService {

	@Autowired
	MarkLogicOperations operations;
	
	@Override
	public String[] suggestTags(ClientRole role) {
		return suggestTags(role, "");
	}

	@Override
	public String[] suggestTags(ClientRole role, String pattern) {
		String suggestPattern = "*" + pattern;
		return operations.suggestTags(role, suggestPattern);
	}

}
