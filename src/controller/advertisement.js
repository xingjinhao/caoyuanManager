/**
	 @Name：layuiAdmin 广告管理  轮播图管理
	 @Author：郭宇
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

  /*轮播图列表*/
  table.render({
    elem: '#LAY-advertisement-manage'
    ,url:layui.setter.urll+'/api/admin/banner/list'
    ,method:'get'
    ,cols: [[
       {field: 'imgName', 		title: '轮播图名称',	align:'center'}
      ,{field: 'imgState', 		title: '状态', 		align:'center',		templet: '#topLowerStatus'}
      ,{field: 'imgTitle', 		title: '标题',		align:'center'}
      ,{field: 'imgSort',  		title: '排序',		align:'center'}
      ,{field: 'photo', 		title: '图片',		align:'center',		templet: '#imgTpl'}
      ,{field: 'createTime', 	title: '上传时间',	align:'center'}
      ,{field: 'imgAddress', 	title: '跳转音频',	align:'center',		templet: '#tAudio'}
      ,{title: '操作', 			align:'center', 	toolbar: '#table-advertisement-operation'}
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
  
  /*监听编辑、删除操作*/
  table.on('tool(LAY-advertisement-manage)', function(obj){
    var data = obj.data;
    console.log(data);
    if(obj.event === 'del'){
        layer.confirm('是否确认删除?', function(index){
          	$.ajax({
		      	url:layui.setter.urll+"/api/admin/banner/del"
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
	                ,'id'   : data.id
              	}),
		          	success:function(data){
		          		if (data.code == 403) {
		                    layer.closeAll();
		                    admin.exit();
		                    setTimeout(function () {
		                        layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
		                    }, 666);
		                }
		          		if(data.data==1){
		          			layer.alert("已删除",{icon:1});
		            		layui.table.reload('LAY-advertisement-manage');
		          		}else{
		          			layer.alert("删除失败,请稍后重试",{icon:2});
		          		}
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
        ,area: ['500px', '450px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('advertisement/edit', data).done(function(){
            form.on('submit(LAY-advertisement-front-submit)', function(data){
	            var field = data.field;
	            console.log(field);
				$.ajax({
	              	url:layui.setter.urll+"/api/admin/banner/edit"
	                ,method:"post"
	              	,contentType:'application/json;charset=UTF-8'
	              	,data: JSON.stringify({
	              		 'token': layui.data('data').token
	              		,'imgName':field.name			/*轮播图名称*/
	                  	,'imgTitle':field.title			/*标题*/
	                  	,'imgSort':field.sort			/*排序值*/
	                  	,'imgUrl':field.photo			/*图片路径*/
	                  	,'id':field.id					/*id*/
	                  	,'imgAddress':field.jump	 	/*跳转音频*/
	              	}),
	                success:function(data){
                    	if(data.data==1){
                    		layer.alert('已更新',{icon:1});
	                    	layui.table.reload('LAY-advertisement-manage');
                    	}else{
                    		layer.alert('编辑失败，请稍后重试',{icon:2});
                    	}
                    	if (data.code == 403) {
		                    layer.closeAll();
		                    admin.exit();
		                    setTimeout(function () {
		                        layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
		                    }, 666);
		                }
	                },
	                error:function(data){
                        layer.alert('编辑失败，请稍后重试',{icon:2});
	                }
	            });
	            layer.close(index);
            });
          });
        }
      });
    }
  });

	/*监听上下架开关*/
	form.on('switch(switchTest)', function (data) {
        var flag = this.checked;
        var id = data.elem.attributes['switch_id'].nodeValue;
        console.log(flag);
        console.log(id);
        $.ajax({
            url: layui.setter.urll + '/api/admin/banner/upper',
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify({
            	 token: layui.data('data').token
            	,id :id
            }),
            success: function (data) {
            	if(data.data==1){
            		if(flag==false){
            			layer.alert('已下架',{icon:1});
            		}else{
            			layer.alert('已上架',{icon:1});
            		}
            	}else{
            		layer.alert('操作失败,请稍后重试',{icon:2});
            	}
            	if (data.code == 403) {
                    layer.closeAll();
                    admin.exit();
                    setTimeout(function () {
                        layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
                    }, 666);
                }
                $('checkbox').prop('checked', false); 
                layui.table.reload('LAY-advertisement-manage');
            },
            error: function (err) {
                layer.alert("操作失败",{icon:2});
                layui.table.reload('LAY-advertisement-manage');
            }
        });
    });
    
  exports('advertisement', {})
});
    
    
