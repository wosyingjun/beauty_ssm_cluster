//存放主要交互逻辑的js代码

var handler = {
	//封装相关ajax的url
	URL : {
		goodsList : function() {
			return '/beauty_ssm_cluster/goods/list';
		},
		userList : function() {
			return '/beauty_ssm_cluster/user/list';
		},
		goodsBuy : function(goodsId) {
			return '/beauty_ssm_cluster/goods/' + goodsId + '/buy';
		}
	},
	//验证手机号
	validatePhone : function(phone) {
		if (phone && phone.length == 11 && !isNaN(phone)) {
			return true;//直接判断对象会看对象是否为空,空就是undefine就是false; isNaN 非数字返回true
		} else {
			return false;
		}
	},
	//详情页秒杀逻辑
	goods : {
		//详情页初始化
		init : function(params) {
			//在cookie中查找手机号
			var userPhone = $.cookie('userPhone');
			//验证手机号
			if (!handler.validatePhone(userPhone)) {
				//绑定手机 控制输出
				var loginModal = $('#loginModal');
				loginModal.modal({
					show : true,//显示弹出层
					backdrop : 'static',//禁止位置关闭
					keyboard : false
				//关闭键盘事件
				});

				$('#loginBtn')
						.click(
								function() {
									var inputPhone = $('#userPhone').val();
									if (handler.validatePhone(inputPhone)) {
										//电话写入cookie(7天过期)
										$.cookie('userPhone', inputPhone, {
											expires : 7
										});
										//验证通过　　刷新页面
										window.location.reload();
									} else {
										$('#userPhoneMessage')
												.hide()
												.html(
														'<label class="label label-danger">手机号错误!</label>')
												.show(300);
									}
								});
			} else {
				//加载商品数据
				$('#goods_table').bootstrapTable({
					url : handler.URL.goodsList(), //请求后台的URL（*）
					method : 'get', //请求方式（*）
					columns : [ {
						field : 'goodsId',
						title : '商品ID'
					}, {
						field : 'title',
						title : '标题'
					}, {
						field : 'price',
						title : '价格'
					}, {
						field : 'state',
						title : '状态',
						formatter:function(value,row,index){ 
							var ret="";
							if(value==0){
								ret="下架";
							}
							if(value==1){
								ret="正常";
							}
					        return ret; 
						}
					}, {
						field : 'number',
						title : '数量'
					}, {
						field : 'goodsId',
						title : '操作',
						formatter:function(value,row,index){  
					        var ret = '<button class="btn btn-info" onclick="handler.goodsBuy('+value+');">购买</button> ';  
					        return ret; 
						}
					},]
				});
			}
		}
	},

	user : {
		//详情页初始化
		init : function(params) {
			//加载商品数据
			$('#user_table').bootstrapTable({
				url : handler.URL.userList(), //请求后台的URL（*）
				method : 'get', //请求方式（*）
				columns : [ {
					field : 'userId',
					title : '用户ID'
				}, {
					field : 'userName',
					title : '用户名'
				}, {
					field : 'userPhone',
					title : '用户手机'
				}, {
					field : 'score',
					title : '积分'
				}, {
					field : 'createTime',
					title : '创建时间'
				},]
			});
		}
	},

	goodsBuy : function(goodsId) {
		//执行购买请求
		$.post(handler.URL.goodsBuy(goodsId), {}, function(result) {
			if (result && result['success']) {
				alert("购买成功！");
				window.location.reload();
			} else {
				alert(result['error']);
			}

		});

	},

}