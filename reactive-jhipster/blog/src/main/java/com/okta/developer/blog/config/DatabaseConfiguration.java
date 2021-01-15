package com.okta.developer.blog.config;

import org.neo4j.springframework.data.repository.config.EnableReactiveNeo4jRepositories;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tech.jhipster.config.JHipsterConstants;

@Configuration
@EnableReactiveNeo4jRepositories("com.okta.developer.blog.repository")
public class DatabaseConfiguration {}
