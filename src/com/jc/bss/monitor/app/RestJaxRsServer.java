package com.asiainfo.bss.monitor.app;

import org.restlet.Component;
import org.restlet.data.Protocol;

/***
 * 
 * @author jiacheng
 */
public class RestJaxRsServer {
	public static void main(String[] args) throws  Exception { 
		Component component = new Component(); 
        component.getServers().add(Protocol.HTTP, 8085);         
        component.getDefaultHost().attach(new RestJaxRsApplication(null)); 
        component.start();  
    } 


}
