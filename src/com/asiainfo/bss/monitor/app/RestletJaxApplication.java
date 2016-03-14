package com.asiainfo.bss.monitor.app;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.asiainfo.bss.monitor.bean.JaxBeanCollection;
import com.asiainfo.bss.monitor.resource.StudentResource;

/***
 * 
 * @author jiacheng
 */
public class RestletJaxApplication extends Application {

	private static ApplicationContext context = new ClassPathXmlApplicationContext(
			"applicationContext-restlet.xml");

	@Override
	public Set<Class<?>> getClasses() {
		Set<Class<?>> rrcs = new HashSet<Class<?>>();
		JaxBeanCollection jaxBeanCollection = context.getBean(
				"jaxBeanCollection", JaxBeanCollection.class);
		List<String> beanNames = jaxBeanCollection.getBeanNames();
		try {
			for (String bean : beanNames) {
				rrcs.add(Class.forName(bean));
			}
			rrcs.add(StudentResource.class);
		} catch (Exception e) {
		}
		return rrcs;
	}
}
