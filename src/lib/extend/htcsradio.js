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
        }
    };
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
        admin.req({
            url: baseurl + 'api/SysUser/Sendyzm' //实际使用请改成服务端真实接口
                ,
            type: "POST",
            dataType: 'json',
            data: subdata,
            done: function(res) {
                layer.msg('验证码已成功发送至您的手机', {
                    offset: '15px',
                    icon: 1,
                    time: 3000
                }, function() {
                    $('#LAY-user-getsmscode').hide().next().show();
                    setTimeOut()
                });
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


