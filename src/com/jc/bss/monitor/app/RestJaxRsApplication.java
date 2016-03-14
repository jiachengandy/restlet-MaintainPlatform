package com.asiainfo.bss.monitor.app;

import org.restlet.Context;
import org.restlet.ext.jaxrs.JaxRsApplication;

/***
 * 
 * @author jiacheng
 */
public class RestJaxRsApplication extends JaxRsApplication {
	
	public RestJaxRsApplication(Context context) {
		super(context);
		this.add(new RestletJaxApplication());
	}
	
}
