package com.asiainfo.bss.monitor.spring;


import org.restlet.ext.jaxrs.InstantiateException;
import org.restlet.ext.jaxrs.ObjectFactory;

import com.asiainfo.bss.monitor.bean.JaxBeanCollection;

/**
* The spring-friendly class responsible for configuring the jax-rs object construction.
* @author jiacheng
*
*/
public class SpringJaxObjectFactory implements ObjectFactory {
   /** The jax-bean collection that drives this component. **/
   private JaxBeanCollection myBeanCollection;

   /**
    * Create the Spring Jax Object Factory.
    * @param beanCollection The jax-bean collection that will drive this component.
    */
   public SpringJaxObjectFactory(final JaxBeanCollection beanCollection) {
       this.myBeanCollection = beanCollection;
   }

   @Override
   public <T> T getInstance(final Class<T> jaxRsClass) throws InstantiateException {
       T bean = myBeanCollection.getBean(jaxRsClass);
       return bean;
   }
}
