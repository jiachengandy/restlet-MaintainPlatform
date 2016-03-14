package com.asiainfo.bss.monitor.client;

import java.io.IOException;

import junit.framework.TestCase;

import org.restlet.data.Form;
import org.restlet.resource.ClientResource;
import org.restlet.resource.ResourceException;
/***
 * 
 * @author jiacheng
 */
public class Client extends TestCase{
	//public static String url="http://localhost:8085/";
	
	public static String url="http://localhost:8080/RestletServlet/";
	
	public static void testXml() {
		ClientResource client = new ClientResource(url+"student/1/xml");
		try {
			System.out.println(client.get().getText());
		} catch (ResourceException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void testJson() {
		ClientResource client = new ClientResource(url+"student/1/json");
		try {
			System.out.println(client.get().getText());
		} catch (ResourceException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void testPost() {
		ClientResource client = new ClientResource(url+"student/add");
		try {
			Form form = new Form();
			form.add("name", "lifeba");
			form.add("clsId","201001");
			form.add("sex","0");
			String id = client.post(form.getWebRepresentation()).getText();
			System.out.println(id);
			/*client = new ClientResource(url+"student/"+id+"/xml");
			System.out.println(client.get().getText());*/
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void testUpdate() {
		ClientResource client = new ClientResource(url+"student/update");
		try {
			Form form = new Form();
			form.add("name", "steven2");
			form.add("clsId","201002");
			form.add("sex","0");
			form.add("id","1");
			String id = client.put(form.getWebRepresentation()).getText();
			System.out.println(id);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	public static void testDelete() {
		ClientResource client = new ClientResource(url+"student/delete/1");
		try {
			System.out.println(client.delete().getText());
			System.out.println(client.delete().getText());
		} catch (ResourceException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	

}
