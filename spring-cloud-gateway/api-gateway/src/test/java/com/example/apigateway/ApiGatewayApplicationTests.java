package com.example.apigateway;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ApiGatewayApplicationTests {

	@Autowired
	WebTestClient webTestClient;

	@Test
	public void testCorsConfiguration() {
		WebTestClient.ResponseSpec response = webTestClient.put()
				.uri("/")
				.header("Origin", "http://example.com")
				.exchange();

		response.expectHeader().valueEquals("Access-Control-Allow-Origin", "*");
	}
}
