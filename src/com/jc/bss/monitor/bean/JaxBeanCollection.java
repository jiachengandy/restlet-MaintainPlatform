package com.asiainfo.bss.monitor.bean;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;

public class JaxBeanCollection implements BeanFactoryAware {
	private BeanFactory factory;
	private List<String> beanNames = new ArrayList<String>();

	public Set<Class<?>> getBeanTypes() {

		Set<Class<?>> scs = new HashSet<Class<?>>();
		for (String beanName : beanNames) {
			Class<?> t = factory.getBean(beanName).getClass();
			scs.add(t);
		}
		return scs;
	}

	@SuppressWarnings("unchecked")
	public <T> T getBean(Class<?> cla) {
		try {
			String clazz = StringUtils.uncapitalize(cla.getSimpleName()); 
			return (T) factory.getBean(clazz);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		this.factory = beanFactory;
	}

	public List<String> getBeanNames() {
		return beanNames;
	}

	public void setBeanNames(List<String> beanNames) {
		this.beanNames = beanNames;
	}

	public BeanFactory getFactory() {
		return factory;
	}

	public void setFactory(BeanFactory factory) {
		this.factory = factory;
	}

}
