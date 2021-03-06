/**
	 @Name： 用户管理 平台用户
	 @Author：郭宇
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;
  form.render();
  //用户列表
  table.render({
    elem: '#LAY-user-manage'
    ,url:layui.setter.urll+'/api/admin/user/list'
    ,method:'get'
  	,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter', 'exports', 'print', {
        title: '提示'
        , layEvent: 'LAYTABLE_TIPS'
        , icon: 'layui-icon-tips'
    }]
    ,cols: [[
       {field: 'uid', 	   		title: 'ID'			,align:'center'}
      ,{field: 'phone', 		title: '手机号'		,align:'center'}
      ,{field: 'nickname', 		title: '昵称'			,align:'center'}
      ,{field: 'sex', 			title: '性别'			,align:'center',	templet: '#sex'}
      ,{field: 'city', 			title: '所在城市'		,align:'center',	templet: '#city'}
      ,{field: 'birthday', 		title: '出生日期'		,align:'center',	templet: '#birthday'}
      ,{field: 'createTime', 	title: '注册时间'		,align:'center'}
      ,{field: 'isVip', 		title: '是否会员'		,align:'center',	templet: '#isVip'}
      ,{field: 'vipDueTime', 	title: '会员到期时间'	,align:'center',	templet: '#vipDueTime'}
      ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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
  
  
  //监听删除
  table.on('tool(LAY-user-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
        layer.confirm('是否确认删除?', function(index){
          	$.ajax({
		      	url:layui.setter.urll+"/api/admin/user/del"
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		'token': layui.data('data').token
	                ,'uid'  : data.uid
              	}),
	          	success:function(data){
	          		if(data.data==1){
	          			layer.alert("已删除",{icon:1});
	            		layui.table.reload('LAY-user-manage');
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
    } else if(obj.event === 'frozenAccount'){
        layer.confirm('真的冻结用户账号吗?', function(index){
          	$.ajax({
		      	url:layui.setter.urll+"/api/admin/user/freeze"
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
	                ,'id'  : data.id
              	}),
		          	success:function(data){
		          		if(data.data==1){
		          			layer.alert("已冻结",{icon:1});
		            		layui.table.reload('LAY-user-manage');
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
    } else if(obj.event === 'frozenComment'){
        layer.confirm('真的冻结用户评论功能吗?', function(index){
          	$.ajax({
		      	url:layui.setter.ajaxUrl+"/api/admin/user/freezeCom"
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
	                ,'uid'  : data.uid
              	}),
		          	success:function(data){
		          		if(data.data==1){
		          			layer.alert("已冻结用户评论功能",{icon:1});
		            		layui.table.reload('LAY-user-manage');
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
    }else if(obj.event === 'thawAccount'){
        layer.confirm('真的解除用户冻结吗?', function(index){
          	$.ajax({
		      	url:layui.setter.urll+"/api/admin/user/freeze"
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
	                ,'id'  : data.id
              	}),
		          	success:function(data){
		          		if(data.data==1){
		          			layer.alert("已解冻",{icon:1});
		            		layui.table.reload('LAY-user-manage');
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
    }else if(obj.event === 'thawComment'){
        layer.confirm('真的解除冻结用户评论功能吗?', function(index){
          	$.ajax({
		      	url:layui.setter.ajaxUrl+"/api/admin/user/freezeCom"
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
	                ,'uid'  : data.uid
              	}),
		          	success:function(data){
		          		if(data.data==1){
		          			layer.alert("已解冻用户评论功能",{icon:1});
		            		layui.table.reload('LAY-user-manage');
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
    }
  });
  exports('user', {})
});