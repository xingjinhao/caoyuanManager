/**
	 @Name： 系统管理
	 @Author：郭宇
 */
layui.define(['table', 'form', 'upload'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,upload = layui.upload;
  
  
  //常见问题列表
  table.render({
    elem: '#LAY-system-problem'
    ,url:layui.setter.urll+'/api/admin/problem/list'
    ,method:'get'
    ,cols: [[
      {type: 'checkbox', 		fixed: 'left',		align:'center'}
      ,{field: 'problem', 		title: '问题名称',		align:'center'}
      ,{field: 'answer', 		title: '回复描述',		align:'center'}
      ,{field: 'createTime', 	title: '创建时间',		align:'center'}
      ,{title: '操作', 			align:'center',		align:'center', fixed: 'right', toolbar: '#table-system-webuser'}
    ]]
    ,page: true
    ,text:{none: '暂无数据', error:'对不起，加载出现异常！'}
    ,done: function (data) {
	    if (data.code == 403) {
	      layer.closeAll();
	      admin.exit();
	      setTimeout(function () {
	        layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
	      }, 666);
	    }
  	}
  });
    
  /*监听常见问题编辑、删除操作*/
  table.on('tool(LAY-system-problem)', function(obj){
    var data = obj.data;
    console.log(data);
    if(obj.event === 'del'){
        layer.confirm('是否确认删除?', function(index){
          	$.ajax({
		      	url:layui.setter.urll+'/api/admin/problem/del'
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
	             	,'id':data.id
              	}),
		          	success:function(data){
		          	layer.alert("已删除",{icon:1});
		          	layui.table.reload('LAY-system-problem');
		        },
		         	error:function(data){
		            layer.alert("操作失败",{icon:2});
		        }
		    });
          layer.close(index);
        });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['900px', '600px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('system/editProblem', data).done(function(){
            //监听提交
            form.on('submit(LAY-problem-front-submit)', function(data){
	            var field = data.field;
				$.ajax({
	              	url:layui.setter.urll+"/api/admin/problem/edit"
	                ,method:"post"
	              	,contentType:'application/json;charset=UTF-8'
	              	,data: JSON.stringify({
	              		 'token': layui.data('data').token
              			,'answer':field.content			/*回复描述*/
	                  	,'problem':field.name			/*问题名称*/
	                  	,'id':field.id
	              	}),
	                success:function(data){
	                	if(data.data==1){
	                		layer.alert('已更新',{icon:1});
	                    	layui.table.reload('LAY-system-problem');
	                	}else{
	                		layer.alert('请稍后重试',{icon:2});
	                	}
	                },
	                error:function(data){
                        layer.alert('请稍后重试',{icon:2});
	                }
	            });
	            layer.close(index);
            });
          });
        }
      });
    }
  });
  
  //反馈列表
  table.render({
    elem: '#LAY-system-manage'
    ,url:layui.setter.ajaxUrl+'/api/admin/feedback/list'
    ,method:'get'
    ,cols: [[
       {field: 'uid',			title: '用户ID',		align:'center'}
      ,{field: 'username',		title: '用户昵称',		align:'center'}
      ,{field: 'phone', 		title: '手机号',			align:'center'}
      ,{field: 'content', 		title: '反馈内容',		align:'center'}
      ,{field: 'createTime', 	title: '反馈时间',		align:'center'}
      ,{field: 'status', 		title: '状态',			align:'center', 	templet: '#Status'}
      ,{title: '操作', 			width: 150, 			align:'center',		align:'center', fixed: 'right', toolbar: '#table-system-webuser'}
    ]]
    ,page: true
    ,text:{none: '暂无数据', error:'对不起，加载出现异常！'}
    ,done: function (data) {
	    if (data.code == 403) {
	      layer.closeAll();
	      admin.exit();
	      setTimeout(function () {
	        layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
	      }, 666);
	    }
  	}
  });
  
  /*监听意见反馈回复、删除操作*/
  table.on('tool(LAY-system-manage)', function(obj){
    var data = obj.data;
    console.log(data);
    if(obj.event === 'del'){
        layer.confirm('是否确认删除?', function(index){
          	$.ajax({
		      	url:layui.setter.urll+"/api/admin/feedback/del"
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
	             	,'id':data.id
              	}),
	          	success:function(data){
	          		if(data.data==1){
	          			layer.alert("已删除",{icon:1});
	            		layui.table.reload('LAY-system-manage');
	          		}else{
	          			layer.alert("操作失败",{icon:2});
	          		}
		        },
	         	error:function(data){
	            	layer.alert("操作失败",{icon:2});
		        }
		    });
          	layer.close(index);
        });
    } else if(obj.event === 'reply'){
      admin.popup({
        title: '回复'
        ,area: ['900px', '550px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('system/reply', data).done(function(){
            //监听提交
            form.on('submit(LAY-reply-front-submit)', function(data){
	            var field = data.field;
				$.ajax({
	              	url:layui.setter.urll+"/api/admin/feedback/reply"
	                ,method:"post"
	              	,contentType:'application/json;charset=UTF-8'
	              	,data: JSON.stringify({
	              		 'token': layui.data('data').token
              			,'reply':field.content	/*回复内容*/
	                  	,'id':field.uid			/*回复给谁*/
	              	}),
	                success:function(data){
	                	if(data.data==1){
	                		layer.alert('已回复',{icon:1});
	                    	layui.table.reload('LAY-system-manage');
	                	}else{
	                		layer.alert('请稍后重试',{icon:2});
	                	}
	                },
	                error:function(data){
                        layer.alert('请稍后重试',{icon:2});
	                }
	            });
	            layer.close(index);
            });
          });
        }
      });
    }
  });
  
layui.use(['layer', 'form', 'table', 'layedit', 'laydate', 'jquery'], function () {
    var form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    $ = layui.jquery;
    	
    	form.on('submit(LAY-contactUs-front-submit)', function(data){
	        var field = data.field; //获取提交的字段
	        console.log(field.tel);
	        console.log(field.url);
	        console.log(field.email);
	        $.ajax({
	       	url:layui.setter.urll+'/api/admin/about/edit',
	      	method:'post',
		       	contentType:"application/json",
		        data: JSON.stringify({
		         	 'token': layui.data('data').token
			 		,'phone':field.tel		/*电话*/
					,'url':field.url		/*网址*/
					,'email':field.email	/*邮箱*/
				}),
	            success:function(data){
	            	if(data.data==1){
	            		layer.alert("已更新",{icon:1});
	           			location.reload();
	            	}else{
	            		layer.alert('操作失败',{icon:2});
	            	}
	           },
	            error:function(data){
	            	layer.alert('操作失败',{icon:2});
	         }
	       });
	    });
	    
	    /*关于我们--确认*/
	    form.on('submit(LAY-aboutUs-submit)', function(data){
	        var field = data.field; //获取提交的字段
	        console.log(field.introduction);
	        console.log(field.law);
	        console.log(field.platform);
	        $.ajax({
		       	url:layui.setter.urll+'/api/admin/about/edit',
		      	method:'post',
		       	contentType:"application/json",
		        data :JSON.stringify({
		         	 'token': layui.data('data').token
			 		,'function':field.introduction		/*功能介绍*/
					,'legalStatement':field.law			/*法律声明*/
					,'agreement':field.platform			/*平台协议*/
				}),
	            success:function(data){
	            	if(data.data==1){
	            		layer.alert('已更新',{icon:1});
	           			location.reload();
	            	}else{
	            		layer.alert('操作失败',{icon:2});
	            	}
	           },
	            error:function(data){
	            	layer.alert('操作失败',{icon:2});
	           }
	       });
	    });
	    
	    /*用户协议--确认*/
	    form.on('submit(LAY-system-front-submit)', function(data){
	        var field = data.field; //获取提交的字段
	        $.ajax({
		       	url:layui.setter.urll+'/api/admin/about/edit',
		      	method:'post',
		       	contentType:"application/json",
		        data :JSON.stringify({
		         	 'token': layui.data('data').token
					,'agreement':field.userText			/*用户协议*/
				}),
	            success:function(data){
	            	if(data.data==1){
	            		layer.alert('已更新',{icon:1});
	           			location.reload();
	            	}else{
	            		layer.alert('操作失败',{icon:2});
	            	}
	           },
	            error:function(data){
	            	layer.alert('操作失败',{icon:2});
	           }
	       });
	    });
	    exports('system', {});
	});
});