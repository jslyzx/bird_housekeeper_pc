layui.define([ "htcsLG"],function (exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery
  , jQuery = layui.jquery;
  var $ = layui.$,
  layer = layui.layer,
  laytpl = layui.laytpl,
  setter = layui.setter,
  admin = layui.admin;
  var doc = layui.htcsLG;
  var form = layui.form;
    var obj = {
        sendyzm:function(type){
            cmdsend(type);
        },
        CreateInput:function(Dom, options, cllback) {
         
            
            var _self = Dom;
            var result = "";
            var id = _self.attr("id");
            if (options.data == null) {
                options.data = [{ "value": 1, "text": "整租" }, { "value": 2, "text": "合租" }, { "value": 3, "text": "独栋" }];
            }
            $.each(options.data, function (index, value) {
                if (options.rdefault == value.value) {
                    result = '<span class="htcsspan i-radio-wrapper" htscvalue=' + value.value + '>' + value.text + '</span>';
                } else {
                    result = '<span class="htcsspan" htscvalue=' + value.value + '>' + value.text + '</span>';
                }
                _self.append(result);
            });

            _self.children().click(function (event) {
                $(this).siblings().removeClass("i-radio-wrapper");
                if ($(this).hasClass("i-radio-wrapper") == false) {
                    $(this).addClass("i-radio-wrapper");
                }
                var result = $(this).attr("htscvalue");
                cllback(result);
                event.stopPropagation();
            });
            return _self;
        },
        getnowdate: function (fmt) {
            var myDate = new Date();
            var o = {
                "M+": myDate.getMonth() + 1, //月份     
                "d+": myDate.getDate(), //日     
                "H+": myDate.getHours(), //小时     
                "m+": myDate.getMinutes(), //分     
                "s+": myDate.getSeconds(), //秒     
                "q+": Math.floor((myDate.getMonth() + 3) / 3), //季度     
                "S": myDate.getMilliseconds() //毫秒     
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (myDate.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        initfgy:function(dom){
            var url="api/BaseData/Queryfgy";
            var vdom="#"+dom;
            doc.objectQuery(url,  {}, function (data) {
                var list=[];
                var rdata=data.numberData;
                for (var i in rdata) {
                    list.push('<option value="'+ rdata[i].Id +'">'+ rdata[i].RealName +'</option>');
                }
                $('select[name="'+dom+'"]').append(list.join(''));
                var userid=layui.data('layuiAdmin').userid;
                $(vdom).val(userid);
                form.render('select');
            });
        },
        editinitfgy:function(dom,rid){
            var url="api/BaseData/Queryfgy";
            var vdom="#"+dom;
            doc.objectQuery(url,  {}, function (data) {
                var list=[];
                var rdata=data.numberData;
                for (var i in rdata) {
                    list.push('<option value="'+ rdata[i].Id +'">'+ rdata[i].RealName +'</option>');
                }
                $('select[name="'+dom+'"]').append(list.join(''));
                $(vdom).val(rid);
                form.render('select');
            });
        },
        initbank:function(dom,rid){
            var url="api/bankcard/Query";
            var vdom="#"+dom;
            doc.objectQuery(url,  {}, function (data) {
                var list=[];
                var rdata=data.numberData;
                for (var i in rdata) {
                    list.push('<option value="'+ rdata[i].Name +'">'+ rdata[i].Name +'</option>');
                }
                $('select[name="'+dom+'"]').append(list.join(''));
                if(rid!=""){
                    $(vdom).val(rid);
                }
                form.render('select');
            });
        },
        // JS日期系列：根据出传入的日期 ，得到当前日期与传入日期的差，返回的格式是“y年m月”
	   // 传入参数strKeyDate要求格式为“yyyy年mm月dd日”这样的日期字符串，如果不是自行先转换，或者调整下方“传入的日期，将其产分为年、月、日”的拆分方法
	   // 后续再增加相关的如日期判断等JS关于日期处理的相关方法
	   jsGetYears(begin,strKeyDate){
        debugger;
		// 需要返回的值，分别是：年数、月数、返回的字符串
	    var returnYears= 0;
	    var returnMonths = 0;
	    var yearmonth = -1;
	    // 传入的日期，将其产分为年、月、日
	    var str =getDate(strKeyDate);
	    var keyYear = str.getFullYear();
	    var keyMonth = str.getMonth()+1;
	    var keyDay = str.getDate();
	 	// 当天日期，将其产分为年、月、日
	    var now =getDate(begin);
	    var nowYear = now.getFullYear();
	    var nowMonth = now.getMonth() + 1;
	    var nowDay = now.getDate();
	    // 分别计算年、月、日的差
	    var yearDiff = nowYear - keyYear;
	    var monthDiff = nowMonth - keyMonth;
	    var dayDiff = (nowDay - keyDay)+1;
	    // 以下是得到当前日期与传入日期的差的过程，返回的格式是“y年m月”；如果传入日期大于当前日期，则返回“-1”（大家也可以自行修改之）
	    if(yearDiff < 0){
	    	return yearmonth;
	    }

	    if(yearDiff == 0 && monthDiff < 0){
	    	return yearmonth;
	    }

	    if(yearDiff == 0 && monthDiff == 0 && dayDiff < 0){
	    	return yearmonth;
	    }
	    	
	    returnYears = yearDiff;
	    if(monthDiff < 0){
	    	returnYears = returnYears - 1;
	    	monthDiff = 12 + monthDiff;
	    }
	    returnMonths = monthDiff
	    if(dayDiff < 0){
	    	returnMonths = returnMonths -1;
        }
        if(dayDiff> 0){
	    	returnMonths = returnMonths +dayDiff/30;
	    }	    
        yearmonth = returnYears;
        if(returnMonths>0){
            yearmonth=yearmonth+returnMonths/12;
        }
	  	// 返回日期差，格式是“y年m月”
	    return Math.ceil(yearmonth);
    }
    };
    function getDate(strDate){    
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,    
        function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');    
        return date;    
    }
    function cmdsend(type) {
        var $phone = $('#LAY-user-login-cellphone'),
            phone = $phone.val();
        var subdata = { "Phone": phone, "Type": type };
        if (!/^1\d{10}$/.test(phone)) {
            $phone.focus();
            return layer.msg('请先输入正确的手机号');
        }


        var baseurl = setter.baseurl;
        //请求发送短信的接口
        $.ajax({
            url: baseurl + 'api/SysUser/Sendyzm',
            type: "POST",
            async: false,
            data: subdata,
            success: function(resultData) {
                if (resultData.Code == 0) {
                    layer.msg('验证码已成功发送至您的手机', {
                        offset: '15px',
                        icon: 1,
                        time: 3000
                    }, function() {
                        $('#LAY-user-getsmscode').hide().next().show();
                        setTimeOut()
                    });
                }else{
                    layer.msg(resultData.Message, {
                        offset: '15px',
                        icon: 2,
                        time: 3000
                    })
                }
            }
        });
    }
    var timeOut = 60;
    function setTimeOut() {
        var timer = setTimeout(function() {
            setTimeOut()
            if (timeOut > 0) {
                timeOut--;
                $('#timeout i').text(timeOut);
            }
        }, 1000)
        if (timeOut <= 0) {
            timeOut = 60
            clearTimeout(timer)
            $('#timeout i').text(timeOut);
            $('#timeout').hide();
            $('#LAY-user-getsmscode').show();
        }
    }
    //输出test接口
    exports('htcsradio', obj);
}).addcss("htcsradio.css");


