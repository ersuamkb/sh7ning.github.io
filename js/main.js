$(function(){

	// Bind the event.
	$(window).hashchange( function(){
	// Alerts every time the hash changes!
		router();
	})

	// Trigger the event (useful on page load).
	$(window).hashchange();
	
	
});
//解析url获取文章
function router() {
	if (location.hash) {
		md_page = location.hash.substr(1);
	} else {
		md_page = 'index';//初始化为index.md
	}
	var ret = is_page(md_page);
	if (ret[0]) {
		showPage(ret[1]);
	} else {
		showCate(ret[1])
	}
}
//显示文章内容
function showPage(page) {
	var page = '/post/'+page+'.md';
	$.get(page, function(data){
		preview(md2html(data));
	});
}
//显示归档中的内容
function showCate(cate) {
	var url = '/post/cates.js';
	$.getJSON(url, function(data){
		switch (cate) {
			default ://cates
				doCate(data);
		}
	});
}
//处理cates归档
function doCate(data) {
	artMap = mapArticles(data);
	var html = '';
	$.each(artMap, function (k, v){
		html += '<h3>'+k+'</h3>';
		html += '<ul>';
		$.each(v, function (v_k, v_v){
			html += '<li><a href="/#'+v_v+'">'+v_v+'</a></li>';
		});
		html += '</ul>';
	});
	preview(html);
}
function mapArticles(data) {
	var articles = {};
	$.each(data.articles, function (k, v){
		if ('undefined' == typeof(articles[v.info[2]])) 
			articles[v.info[2]] = [];
		articles[v.info[2]].push(v.info[0]);
	});
	return articles;
}
//解析md->html
function md2html(data) {
	var converter = new Showdown.converter();
	return converter.makeHtml(data);
}
function preview(html) {
	$('#preview').html(html);
}
//是否文章
function is_page(md_page) {
	if (md_page.charAt(0) == '!') {
		return [false, md_page.substr(1)];
	}
	return [true, md_page];
}
