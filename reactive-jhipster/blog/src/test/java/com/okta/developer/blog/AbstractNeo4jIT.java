package com.okta.developer.blog;

import java.util.concurrent.atomic.AtomicBoolean;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.testcontainers.containers.Neo4jContainer;

public class AbstractNeo4jIT implements BeforeAllCallback {

    private static AtomicBoolean started = new AtomicBoolean(false);

    private static Neo4jContainer neo4jContainer = new Neo4jContainer("neo4j:4.2.2").withoutAuthentication();

    public void beforeAll(ExtensionContext extensionContext) {
        if (!started.get()) {
            neo4jContainer.start();
            System.setProperty("org.neo4j.driver.uri", neo4jContainer.getBoltUrl());
            started.set(true);
        }
    }
}
