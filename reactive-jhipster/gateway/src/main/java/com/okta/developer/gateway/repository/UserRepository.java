package com.okta.developer.gateway.repository;

import com.okta.developer.gateway.domain.Authority;
import com.okta.developer.gateway.domain.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.core.DatabaseClient;
import org.springframework.data.r2dbc.core.ReactiveDataAccessStrategy;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

/**
 * Spring Data R2DBC repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends R2dbcRepository<User, String>, UserRepositoryInternal {
    Mono<User> findOneByLogin(String login);

    Flux<User> findAllByIdNotNull(Pageable pageable);

    Flux<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    Mono<Long> count();

    @Query("INSERT INTO jhi_user_authority VALUES(:userId, :authority)")
    Mono<Void> saveUserAuthority(String userId, String authority);

    @Query("DELETE FROM jhi_user_authority")
    Mono<Void> deleteAllUserAuthorities();
}

interface UserRepositoryInternal {
    Mono<User> findOneWithAuthoritiesByLogin(String login);

    Mono<User> create(User user);
}

class UserRepositoryInternalImpl implements UserRepositoryInternal {

    private final DatabaseClient db;
    private final ReactiveDataAccessStrategy dataAccessStrategy;

    public UserRepositoryInternalImpl(DatabaseClient db, ReactiveDataAccessStrategy dataAccessStrategy) {
        this.db = db;
        this.dataAccessStrategy = dataAccessStrategy;
    }

    @Override
    public Mono<User> findOneWithAuthoritiesByLogin(String login) {
        return findOneWithAuthoritiesBy("login", login);
    }

    private Mono<User> findOneWithAuthoritiesBy(String fieldName, Object fieldValue) {
        return db
            .execute(
                "SELECT * FROM jhi_user u LEFT JOIN jhi_user_authority ua ON u.id=ua.user_id WHERE u." + fieldName + " = :" + fieldName
            )
            .bind(fieldName, fieldValue)
            .map(
                (row, metadata) ->
                    Tuples.of(
                        dataAccessStrategy.getRowMapper(User.class).apply(row, metadata),
                        Optional.ofNullable(row.get("authority_name", String.class))
                    )
            )
            .all()
            .collectList()
            .filter(l -> !l.isEmpty())
            .map(
                l -> {
                    User user = l.get(0).getT1();
                    user.setAuthorities(
                        l
                            .stream()
                            .filter(t -> t.getT2().isPresent())
                            .map(
                                t -> {
                                    Authority authority = new Authority();
                                    authority.setName(t.getT2().get());
                                    return authority;
                                }
                            )
                            .collect(Collectors.toSet())
                    );
                    return user;
                }
            );
    }

    @Override
    public Mono<User> create(User user) {
        return db
            .insert()
            .into(User.class)
            .using(user)
            .map(dataAccessStrategy.getConverter().populateIdIfNecessary(user))
            .first()
            .defaultIfEmpty(user);
    }
}

class UserSqlHelper {

    static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("login", table, columnPrefix + "_login"));
        columns.add(Column.aliased("first_name", table, columnPrefix + "_first_name"));
        columns.add(Column.aliased("last_name", table, columnPrefix + "_last_name"));
        columns.add(Column.aliased("email", table, columnPrefix + "_email"));
        columns.add(Column.aliased("activated", table, columnPrefix + "_activated"));
        columns.add(Column.aliased("lang_key", table, columnPrefix + "_lang_key"));
        columns.add(Column.aliased("image_url", table, columnPrefix + "_image_url"));
        return columns;
    }
}
