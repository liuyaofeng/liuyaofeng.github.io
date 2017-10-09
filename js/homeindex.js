layui.use(['flow','layer'], function(){
	var flow = layui.flow;
	var layer = layui.layer;
	flow.load({
		elem: '#article_list' ,
		end: '没有更多的文章了~QAQ',
		isAuto: true,
		done: function(page, next){ //执行下一页的回调
			$.ajax({
				url:'/getArticleList',
				type:'POST',
				timeout:30000,
				data:{
					'pageNo':page,
				},
				async:false,
				success:function(data){
					if(data.result == 1){
						var datas = data.response.data;
						var lis = [];
						for(var i = 0; i < datas.length; i++){
							var dataDoms = " <div class='article shadow animated zoomIn'> "+
								"  <div class='article-left'> "+
								" <img src='"+datas[i].article_pic+"' alt="+datas[i].article_title+" /> "+
								" </div> "+
								" <div class='article-right'> "+
								"  <div class='article-title'> ";
								if(datas[i].is_top  == 1){
									dataDoms +="<span class ='article_is_top'>置顶</span>";
								}
								dataDoms +="  <a target='_blank' href="+__path+"/articles/detail/"+datas[i].id_key+">"+datas[i].article_title+"</a> "+
								"</div> "+
								"<div class='article-abstract'>"+datas[i].remark+"</div>"+
								" </div> "+
								" <div class='clear'></div> "+
								"<div class='article-footer'> "+
								" <span><i class='fa fa-clock-o'></i>&nbsp;&nbsp;"+datas[i].create_time+"</span> "+
								" <span class='article-author'><i class='fa fa-user'></i>&nbsp;&nbsp;"+datas[i].anchor.user_name+"</span> "+
								" <span><i class='fa fa-tag'></i>&nbsp;&nbsp;<a target='_blank' href="+__path+"/articles/category/"+datas[i].article_type.id_key+">"+datas[i].article_type.param_name+"</a></span> "+
								" <span class='article-viewinfo'><i class='fa fa-eye'></i>&nbsp;"+datas[i].browse_num+"</span> "+
								" <span class='article-viewinfo'><i class='fa fa-commenting'></i>&nbsp;"+datas[i].comment_count+"</span> "+
								" </div> "+
								" </div>";
							lis.push(dataDoms)
						}
						//执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
						next(lis.join(''), page < data.response.totalpage); //假设总页数为 10
					}else{
						layer.msg(data.msg,{icon:2,time:2000,shade:0.5});
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					layer.msg('获取文章列表失败',{icon:2,time:2000,shade:0.5});
					flag = false;
				}
			});
		}
	});
	//获取热门文章
	$.ajax({
		url:__path+'/articles/getHotArticle',
		type:'POST',
		timeout:30000,
		async:false,
		success:function(data){
			if(data.result == 1){
				var datas = data.response;
				var lis = [];
				for(var i = 0; i < datas.length; i++){
					if(i<2){
						lis.push("<li><i class='fa-li fa fa-hand-o-right'></i><a class='redHotArticle' target='_blank' href="+__path+"/articles/detail/"+datas[i].id_key+">"+datas[i].article_title+"</a><span style='font-size: 12px;'>"+datas[i].browse_num+"阅/"+datas[i].comment_count+"评</span></li>");
					}else{
						lis.push("<li><i class='fa-li fa fa-hand-o-right'></i><a class='blackHotArticle' target='_blank' href="+__path+"/articles/detail/"+datas[i].id_key+">"+datas[i].article_title+"</a><span style='font-size: 12px;'>"+datas[i].browse_num+"阅/"+datas[i].comment_count+"评</span></li>");
					}
				}
				$(".fa-ul").html(lis.join(''));
			}
		},
		error:function(){
			layer.msg('获取文章分类失败~',{icon:2,time:2000,shade:0.5});
			flag = false;
		}
	});
	//获取友链
    $.ajax({
        type: 'post',
        url: __path+'/link/links',
        async:false,
        success: function (data) {
            if (data.result == 1) {
            	var  datas = data.response;
            	var __html="";
            	for (var i = 0; i < datas.length; i++) {
            		__html+="<li><a target='_blank' href='"+datas[i].link_url+"' title='"+datas[i].site_name+"'>"+datas[i].site_name+"</a></li>";
				}
            	$(".blogroll").html(__html);
            } else {
            	 if (data.msg != undefined) {
                     layer.msg(data.msg, { icon: 5});
                 } else {
                     layer.msg('程序异常，请重试或联系作者', { icon: 5 });
                 }
            }
        },
        error: function (data) {
            layer.msg("获取友链异常。", { icon: 2 });
        }
    });
    //获取热评用户
    $.ajax({
    	type: 'post',
        url: __path+'/comment/getHotUserComment',
        async:false,
        success: function (data) {
            if (data.result == 1) {
            	var  datas = data.response;
            	var __html="";
            	var j = 1;
            	for (var i = 0; i < datas.length; i++) {
            		var count= datas[i].hotcount;//
            		var title = "";
            		if(count<=10){
            			title="潜水";
            		}else if(count <=20){
            			title="冒泡";
            		}else if(count <=30){
            			title="吐槽";
            		}else if(count <=50){
            			title="活跃";
            		}else if(count <=80){
            			title="话痨";
            		}else if(count <=100){
            			title="传说";
            		}
            		__html+="<li class=\"hotusers-list-item\">";
            			__html+="<div class=\"hotusers-top hotusers-num\">"+j+"</div>";
            			__html+="<div class=\"hotusers-avator\"><img src='"+datas[i].user_pic+"' width=\"45\" height=\"45\"></div>   ";
            			__html+="<div>";
            				__html+="<div class=\"hotusers-nick\">"+datas[i].user_name+"</div> ";
            				__html+="<span class=\"hotusers-level\" title=\"等级"+j+"\" style=\" background-image: url(https://changyan.itc.cn/v2/asset/scs/imgs/p-lv0"+j+".png);\">";
            				__html+="<i style=\" background-image:url(https://changyan.itc.cn/v2/asset/scs/imgs/p-lv01-04.png);\">"+title+"</i></span>";	
            				__html+="<span class=\"hotusers-totalcmt\">本站评论数："+datas[i].hotcount+" </span>  ";
            			__html+="</div> ";
            		__html+="<span class=\"hotusers-icons\"></span>";
            		__html+="</li>";
            		j++;
				}
            	$(".hotusers-list").html(__html);
            } else {
            	 if (data.msg != undefined) {
                     layer.msg(data.msg, { icon: 5});
                 } else {
                     layer.msg('程序异常，请重试或联系作者', { icon: 5 });
                 }
            }
        },
        error: function (data) {
            layer.msg("获取热评用户异常。", { icon: 2 });
        }
    });
});
$(function (){
	 //获取网站公告
    $.ajax({
    	type: 'post',
        url: '/siteNotice',
        async:false,
        success: function (data) {
            if (data.result == 1) {
            	var  datas = data.response;
            	var __html="";
            	for (var i = 0; i < datas.length; i++) {
            		var type= datas[i].param_code;
            		var color="";
            		if(type == 1){
            			color= "red"
            		}else{
            			color= "#009688"
            		}
            		__html+="<span style='color:"+color+"'>"+datas[i].notice_content+"</span>"
				}
            } else {
            	 if (data.msg != undefined) {
            		 __html="<span style='color:red'>博主暂未发布公告！</span>"
                 } else {
                     layer.msg('程序异常，请重试或联系作者', { icon: 5 });
                 }
            }
            $(".home-tips-container").html(__html);
        },
        error: function (data) {
            layer.msg("获取网站公告异常。", { icon: 2 });
        }
    });
    //轮播公告
    playAnnouncement(3000);
})
 function playAnnouncement(interval) {
        var index = 0;
        var $announcement = $('.home-tips-container>span');
        //自动轮换
        setInterval(function () {
            index++;    //下标更新
            if (index >= $announcement.length) {
                index = 0;
            }
            $announcement.eq(index).stop(true, true).fadeIn().siblings('span').fadeOut();  //下标对应的图片显示，同辈元素隐藏
        }, interval);
    }
$(function(){
    $("#admin").hover(function(){  
        layer.tips('后台管理系统~','#admin',{tips: [1, '#000']});
    },function(index){  
       layer.close(index);
    }) 
    $("#comments").hover(function(){  
        layer.tips('去留言~','#comments',{tips: [1, '#000']});
    },function(index){  
    	 layer.close(index);
    }) 
    $("#Q_Q").hover(function(){  
        layer.tips('QQ交流~','#Q_Q',{tips: [1, '#000']});
    },function(index){  
    	 layer.close(index);
    }) 
    $("#weibo").hover(function(){  
        layer.tips('去我的微博~','#weibo',{tips: [1, '#000']});
    },function(index){  
    	 layer.close(index);
    })
})  