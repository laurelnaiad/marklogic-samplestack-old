package com.marklogic.samplestack.exception;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(HttpStatus.NOT_FOUND)
public class SamplestackNotFoundException extends RuntimeException {

	private final Logger logger = LoggerFactory
			.getLogger(SamplestackNotFoundException.class);

	public SamplestackNotFoundException() {
		logger.info("Resource Not Found Exception thrown by MarkLogic Client API");
	}

}
