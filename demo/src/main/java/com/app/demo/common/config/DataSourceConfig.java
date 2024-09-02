package com.app.demo.common.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;

import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.lookup.DataSourceLookupFailureException;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;

import javax.naming.NamingException;
import javax.sql.DataSource;

@Slf4j
@MapperScan(value = "com.app.demo.domain.**.dao")
@Configuration
public class DataSourceConfig {

    public final static String MYBATIS_CONFIG_LOCATION_PATH = "classpath:mybatis-config.xml";
    public final static String MAPPER_LOCATIONS_PATH = "classpath:mapper/**/*.xml";
    private final static String JNDI_NAME = "java:/comp/env/jdbc/jndiName";

    @Bean
    public DataSource dataSource() throws NamingException {
        try {
            JndiDataSourceLookup dataSourceLookup = new JndiDataSourceLookup();

            log.info("================= :: DB Connection Info  :: =================");
            log.info(">> Connection JNDI : {} ", JNDI_NAME);
            log.info("=============================================================");

            return dataSourceLookup.getDataSource(JNDI_NAME);
        } catch (DataSourceLookupFailureException ex) {
            throw new NamingException("Could not find DataSource via JNDI lookup");
        }
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setConfigLocation(resolver.getResource(MYBATIS_CONFIG_LOCATION_PATH));
        sqlSessionFactoryBean.setMapperLocations(resolver.getResources(MAPPER_LOCATIONS_PATH));

        return sqlSessionFactoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}
