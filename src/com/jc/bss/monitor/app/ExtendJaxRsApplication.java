package com.asiainfo.bss.monitor.app;

import org.restlet.Request;
import org.restlet.Response;
import org.restlet.data.Form;
import org.restlet.ext.jaxrs.JaxRsApplication;

public class ExtendJaxRsApplication extends JaxRsApplication {

	@Override
	public void handle(Request request, Response response) {
		Form responseForm = (Form) response.getAttributes().get(
				"org.restlet.http.headers");
		if (null == responseForm) {
			responseForm = new Form();
			response.getAttributes().put("org.restlet.http.headers",
					responseForm);
		}
		responseForm.add("Access-Control-Allow-Origin", "*");
		super.handle(request, response);
	}
}
