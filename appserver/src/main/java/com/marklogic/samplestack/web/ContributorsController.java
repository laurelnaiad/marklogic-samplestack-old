package com.marklogic.samplestack.web;

import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.marklogic.samplestack.domain.Contributor;
import com.marklogic.samplestack.service.ContributorService;

/**
 * Provides HTTP access to contributor objects. Contributors are the
 * applications users whose content makes up a samplestack corpus. This is a
 * typical CRUD interface to POJOs
 * 
 */
@Controller
public class ContributorsController {

	static Random random = new Random();

	@Autowired
	private ContributorService service;

	@RequestMapping(value = "contributors", method = RequestMethod.GET)
	public @ResponseBody
	@PreAuthorize("hasRole('ROLE_CONTRIBUTORS')")
	List<Contributor> listContributors(@RequestParam(required = false) String q) {
		if (q == null) {
			return service.list(0);
		} else {
			return service.search(q);
		}
	}

	@RequestMapping(value = "contributors/{id}", method = RequestMethod.GET)
	public @ResponseBody
	@PreAuthorize("hasRole('ROLE_CONTRIBUTORS')")
	Contributor get(@PathVariable("id") String id) {
		return service.get(id);
	}

	@RequestMapping(value = "contributors", method = RequestMethod.POST)
	public @ResponseBody
	@PreAuthorize("hasRole('ROLE_ADMINS')")
	@ResponseStatus(HttpStatus.CREATED)
	Contributor newContributor(@RequestBody Contributor contributor) {
		contributor.setId(UUID.randomUUID().toString());
		service.store(contributor);
		return contributor;
	}

	@RequestMapping(value = "contributors/{id}", method = RequestMethod.PUT)
	public @ResponseBody
	@PreAuthorize("hasRole('ROLE_ADMINS')")
	Contributor replaceContributor(@PathVariable("id") String id,
			@RequestBody Contributor contributor) {
		service.store(contributor);
		return contributor;
	}

	@RequestMapping(value = "contributors/{id}", method = RequestMethod.DELETE)
	public @ResponseBody
	@PreAuthorize("hasRole('ROLE_ADMINS')")
	void removeContributor(@PathVariable("id") String id) {
		service.delete(id);
	}
}
