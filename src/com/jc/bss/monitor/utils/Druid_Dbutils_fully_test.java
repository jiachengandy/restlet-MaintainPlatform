package com.asiainfo.bss.monitor.utils;

import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.dbutils.handlers.ArrayHandler;
import org.apache.commons.dbutils.handlers.ArrayListHandler;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ColumnListHandler;
import org.apache.commons.dbutils.handlers.KeyedHandler;
import org.apache.commons.dbutils.handlers.MapHandler;
import org.apache.commons.dbutils.handlers.MapListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;

public class Druid_Dbutils_fully_test {

	public static void main(String[] args) throws SQLException {
		DBUtilsHelper dbh = new DBUtilsHelper();
		QueryRunner runner = dbh.getRunner();

		runner.update("insert into ssq(qishu) values('1883')");

		runner.update("update ssq set qishu='1890' where qishu=?", "1880");

		// 返回ArrayHandler结果,第一行结果：Object[]
		System.out.println("A:返回ArrayHandler结果......");
		Object[] arrayResult = runner.query("select * from ssq",
				new ArrayHandler());
		for (int i = 0; i < arrayResult.length; i++) {
			System.out.print(arrayResult[i] + "    ");
		}
		System.out.println();

		// 返回ArrayListHandler结果,第一行结果：List<Object[]>
		System.out.println("B:返回ArrayListHandler结果(仅显示5行).........");
		List<Object[]> arrayListResult = runner.query("select * from ssq",
				new ArrayListHandler());
		for (int i = 0; i < arrayListResult.size() && i < 5; i++) {
			for (int j = 0; j < arrayListResult.get(i).length; j++) {
				System.out.print(arrayListResult.get(i)[j] + "    ");
			}
			System.out.println();
		}
		System.out.println();

		// 返回bean
		System.out.println("X:单条返回bean结果.");
		Object ssq = runner.query("select * from ssq where qishu like ?",
				new BeanHandler<Object>(Object.class), "2009%");
		//System.out.println("bean:" + ssq.getQishu());
		System.out.println("X1:单条返回bean结果");
		ResultSetHandler<Object> h = new BeanHandler<Object>(
				Object.class);
		Object p = runner.query(
				"select * from ssq where qishu like ? limit 1", h, "2009%");
		//System.out.println(p.getQishu());

		// 返回beanlist
		System.out.println("C:返回BeanList结果(仅显示5行)......");
		List<Object> beanListResult = runner.query("select * from ssq",
				new BeanListHandler<Object>(Object.class));
		Iterator<Object> iter_beanList = beanListResult.iterator();
		int shownum = 0;
		while (iter_beanList.hasNext() && shownum < 5) {
			//System.out.println(iter_beanList.next().getQishu());
			shownum++;
		}

		// 返回指定列
		System.out.println("D:返回ColumnList结果......");
		List<Object> columnResult = runner.query("select * from ssq",
				new ColumnListHandler<Object>("qishu"));
		Iterator<Object> iter = columnResult.iterator();
		shownum = 0;
		while (iter.hasNext() && shownum < 5) {
			System.out.println(iter.next());
			shownum++;
		}

		// 返回KeyedHandler结果：Map<Object,Map<String,Object>>：map的key为KeyedHandler指定
		System.out.println("E:返回KeyedHandler结果,期数:2003001的a列值.........");
		Map<Object, Map<String, Object>> keyedResult = runner.query(
				"select * from ssq", new KeyedHandler<Object>("qishu"));
		System.out.println(keyedResult.get("2003001").get("a"));

		// MapHandler
		System.out.println("F:返回MapHandler结果.........");
		Map<String, Object> mapResult = runner.query("select * from ssq",
				new MapHandler());
		Iterator<String> iter_mapResult = mapResult.keySet().iterator();
		while (iter_mapResult.hasNext()) {
			System.out.print(mapResult.get(iter_mapResult.next()) + "   ");
		}
		System.out.println();

		// 返回MapListHandler结果
		System.out.println("G:返回MapListHandler结果.........");
		List<Map<String, Object>> mapListResult = runner.query(
				"select * from ssq", new MapListHandler());
		for (int i = 0; i < mapListResult.size() && i < 5; i++) {
			Iterator<String> values = mapListResult.get(i).keySet().iterator();
			while (values.hasNext()) {
				System.out.print(mapListResult.get(i).get(values.next())
						+ "   ");
			}
			System.out.println();
		}

		Object increaseId = runner.query("select last_insert_id()",
				new ScalarHandler<Object>());
		System.out.println(increaseId);
	}

}