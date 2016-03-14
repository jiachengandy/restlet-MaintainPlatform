package com.asiainfo.bss.monitor.resource;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.asiainfo.bss.monitor.constant.RestDictionary;


@Path(RestDictionary.BASE_HELLO_WORLD_PATH)
public class HelloWorldresource extends StandardResource {
	
	@GET
	@Produces("text/plain")
	public String getPlain() {
		return "This is an easy resource (as plain text)";
	}
}
