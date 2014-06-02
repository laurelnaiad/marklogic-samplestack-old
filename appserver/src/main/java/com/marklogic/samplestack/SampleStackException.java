package com.marklogic.samplestack;


@SuppressWarnings("serial")
public class SampleStackException extends RuntimeException {

	@SuppressWarnings("unused")
	private Exception thrown;
	
	public SampleStackException(Exception e) {
		this.thrown = e;
		e.printStackTrace();
	}

}