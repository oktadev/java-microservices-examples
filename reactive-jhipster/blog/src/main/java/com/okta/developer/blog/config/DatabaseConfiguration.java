package com.okta.developer.blog.config;

import org.neo4j.driver.Driver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.ReactiveDatabaseSelectionProvider;
import org.springframework.data.neo4j.core.transaction.ReactiveNeo4jTransactionManager;
import org.springframework.data.neo4j.repository.config.EnableReactiveNeo4jRepositories;
import org.springframework.data.neo4j.repository.config.ReactiveNeo4jRepositoryConfigurationExtension;
import org.springframework.transaction.ReactiveTransactionManager;

@Configuration
@EnableReactiveNeo4jRepositories("com.okta.developer.blog.repository")
public class DatabaseConfiguration {

    @Bean(ReactiveNeo4jRepositoryConfigurationExtension.DEFAULT_TRANSACTION_MANAGER_BEAN_NAME)
    public ReactiveTransactionManager transactionManager(Driver driver, ReactiveDatabaseSelectionProvider databaseNameProvider) {
        return new ReactiveNeo4jTransactionManager(driver, databaseNameProvider);
    }
}
