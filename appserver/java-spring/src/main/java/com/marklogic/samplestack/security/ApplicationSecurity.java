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
package com.marklogic.samplestack.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * The Spring Security configuration for Samplestack.
 * Contains configuration for the web-tier security,
 * including the embedded LDAP backend configuration and the
 * user-facing method for securing the application's endpoints.
 */
@EnableWebSecurity
@Component
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApplicationSecurity extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthenticationSuccessHandler successHandler;

	@Autowired
	private AuthenticationFailureHandler failureHandler;

	@Autowired
	private LogoutSuccessHandler logoutSuccessHandler;
	
	@Autowired
	private AuthenticationEntryPoint entryPoint;

	@Autowired
	private AccessDeniedHandler samplestackAccessDeniedHandler;
	

	@Override
	/**
	 * Standard practice in Spring Security is to provide
	 * this implementation method for building security.  This method
	 * configures the endpoints' security characteristics.
	 * @param http  Security object projided by the framework.
	 */
	protected void configure(HttpSecurity http) throws Exception {
		http
			.authorizeRequests()
				.antMatchers(HttpMethod.GET, "/session", "/questions/**", "/tags/**").permitAll()
			.and()
			.authorizeRequests()
				.antMatchers(HttpMethod.POST, "/search").permitAll()
			.and()
				.authorizeRequests().antMatchers("/questions/**", "/contributors/**")
				.authenticated()
			.and()
				.authorizeRequests().anyRequest().denyAll();
		http.formLogin()
		        .failureHandler(failureHandler)
				.successHandler(successHandler)
				.permitAll().and()
			.logout()
				.logoutSuccessHandler(logoutSuccessHandler)
				.permitAll();
		http.csrf().disable();
		http.exceptionHandling().authenticationEntryPoint(entryPoint)
		.accessDeniedHandler(samplestackAccessDeniedHandler);
		
	}

	@Override
	/**
	 * Standard practice in Spring Security is to provide a hook for configuring
	 * the authentication manager.  This configuration sets up an embedded LDAP
	 * server.
	 * @param authManagerBuilder  a builder provided by the framework.
	 */
	protected void configure(AuthenticationManagerBuilder authManagerBuilder)
			throws Exception {

		authManagerBuilder.ldapAuthentication()

		.userDnPatterns("uid={0},ou=people", "uid={0},ou=apps")
				.groupSearchBase("ou=groups").contextSource()
				.ldif("classpath:samplestack-ds.ldif")
				.root("dc=samplestack,dc=org");

	}

}