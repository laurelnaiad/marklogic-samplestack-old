package com.marklogic.sasquatch;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.marklogic.sasquatch.domain.SecureObject;
import com.marklogic.sasquatch.marklogic.SecureObjectDao;


@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = SasquatchConfiguration.class)
/**
 * TODO
 * These are non-functional test stubs for examining secured objects.
 * Post Milestone 1
 * @author cgreer
 *
 */
public class SecureObjectTest {

	@Autowired
	private SecureObjectDao secureDao;

	@Test
	public void testUnauthenticatedAccess() {
		SecureObject secureObject = new SecureObject();

		secureObject.setData("I'm unt authorized");
		secureObject.setAnnotatesDocument("/nope/doesn't/exist.json");
		secureDao.storeSecureObject("/nope/1.json", secureObject);

	}

	@Test
	public void testAuthenticatedAccess() {

	}

	@Test
	public void testAuthorizedAccess() {

	}

	@Test
	public void testDocumentReference() {

	}
}
