package com.asiainfo.bss.monitor.spring;

import java.util.Set;

import com.asiainfo.bss.monitor.bean.JaxBeanCollection;


/**
 * The spring-friendly class responsible for configuring the jax-rs context.
 * @author jiacheng
 *
 */
public class SpringJaxConfig extends javax.ws.rs.core.Application {
    /** The jax-bean collection that drives this component. **/
    private JaxBeanCollection myBeanCollection;

    /**
     * Create the Spring Jax Config.
     * @param beanCollection The jax-bean collection that will drive this component.
     */
    public SpringJaxConfig(final JaxBeanCollection beanCollection) {
        this.myBeanCollection = beanCollection;
    }

    @Override
    public Set<Class<?>> getClasses() {
        return myBeanCollection.getBeanTypes();
    }
}
