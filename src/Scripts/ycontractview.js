
function LoadData(id,tableid,layerindex){
  layui.use(['laydate', 'laypage', 'layer','htcsradio', 'laytpl', 'jquery', 'form'], function () {
          var laytpl = layui.laytpl;
          var doc = layui.htcsLG;
          var url = "api/Contract/GetEnum";
          var xqurl="api/OwerContract/QuerybyId";
          var $ = layui.jquery;
          var util = layui.util;
          var jQuery=layui.jquery;
          var form = layui.form;
          var alldata=[];
          var table = layui.table;
          var element = layui.element;
          var getTpl = zcontractaddscript1.innerHTML
         , view = document.getElementById('zcontract-add-view1');
          var laydate = layui.laydate;
          var mymod = layui.htcsradio;
          var contract=0;
          var nowDate = mymod.getnowdate("yyyy-MM-dd");
          element.on('tab(test1)', function(){
          var layid=this.getAttribute('lay-id');
          if(layid=="333"){
              debugger;
        
      bill=1;
          var tableoption = {
  domid: "#bill-main-table-cont",
  formid: "#bill-search-form",
  arr: [
      [ //表头
          { type: 'checkbox' }, { field: 'Id', width: 100, title: '编号' }, { title: '处理时间', templet: formadaoqi, width: 150 }, { width: 100, title: '状态', templet: formastatus }, { title: '处理时间', width: 150, templet: formatterreveice }, { title: '账单周期', width: 200, templet: formatterzhouqi } , { field: 'Amount', width: 100, title: '金额' }, {  templet: formasign, width:200, title: '标记' }
      ]
  ],
  height: 620,
  url: 'api/Bill/Querylist',
  ismuilti: true,
  "tabfield": "PayStatus",
  tablebtnid: '#billbtnintable1',
  "search":{"BillType":2,"PayStatus":0,"ContractId":id,"Object":1,"OrderbyTime":1}
};
  var BtnOption = {
  area: ['900px', '90%'],
  tableid: "bill-main-table-cont",
  btnview: "bill-button-view",
  tableView: "bill-table-btn",
  toolview: 'bill-view-btn',
  tooladd: "bill-add-btn",
  tooledit: "bill-edit-btn",
  tooldelete: "bill-delete-btn",
  menuid: 108,
  "realtable": "T_BILL",
  formatterbtn:['formatterbtn']
};
doc.InitButton(BtnOption, billbtnscribt2, tableoption);
//监听工具栏按钮
table.on('tool(demoEvent3)', function(obj) {
  var data = obj.data,
      layEvent = obj.event,
      url = $(this).data('url');
      debugger;
  if (layEvent === 'bill-receivebtn') { //收款
      if(data.type!=0){
          layer.msg("不是收款单，无法进行收款操作");
          return;
      }
      var editid = "layuibillreceivebtn";
      var view = layui.view;
      layer.open({
          id: editid,
          type: 1,
          title: '收款',
          skin: 'two-layer',
          shadeClose: true, //开启遮罩关闭
          maxmin: true, //开启最大化最小化按钮
          area: ['1000px', '90%'],
          success: function(layero, index) {
              view(this.id).render(url, {
                  id: data.Id,
                  tableid: "bill-main-table-cont",
                  layerindex: index
              });
          }
      });
  }
  if (layEvent === 'bill-receivebtn') { //收款
    if(data.BillType!=0){
        layer.msg("不是收款单，无法进行收款操作");
        return;
    }
    var editid = "layuibillreceivebtn";
    var view = layui.view;
    layer.open({
        id: editid,
        type: 1,
        title: '收款',
        skin: 'two-layer',
        shadeClose: true, //开启遮罩关闭
        maxmin: true, //开启最大化最小化按钮
        area: ['1000px', '90%'],
        success: function(layero, index) {
            view(this.id).render(url, {
                id: data.Id,
                tableid: "bill-main-table",
                layerindex: index,
                btnOption:BtnOption
            });
        }
    });
}
if (layEvent === 'signbill') { //标记账单
    var url="api/Procedure/signbill";
    var pdata={};
    pdata.Ids=data.Id;
    pdata.Other=data.PayStatus;
    doc.objectQuery(url, pdata, function (data) {
        debugger;
        if(data.Code==0){
            layer.msg(data.Message, {
                icon: 1,
                time: 800 //2秒关闭（如果不配置，默认是3秒）
            });
        doc.reflash(BtnOption.tableid,BtnOption);
        }else{
            layer.open({
                title: '温馨提示'
                , content: data.Message
            });
        }
    });
}
if (layEvent=== 'fukuan') { //处理账单
    if(data.BillType!=1&&data.BillType!=0){
        layer.msg("未知账单无法操作");
        return;
    }
    var editid = "layuibillreceivebtn";
    var view = layui.view;
    var lurl="";
    var ltitle="";
    if(data.BillType==1){
        lurl="bill/z-bill/fukuan";
        ltitle="付款";
    }
    if(data.BillType==0){
        lurl="bill/y-bill/receive";
        ltitle="收款";
    }
    layer.open({
        id: editid,
        type: 1,
        title: ltitle,
        skin: 'two-layer',
        shadeClose: true, //开启遮罩关闭
        maxmin: true, //开启最大化最小化按钮
        area: ['1000px', '90%'],
        success: function(layero, index) {
            view(this.id).render(lurl, {
                id: data.Id,
                tableid: "bill-main-table",
                layerindex: index,
                btnOption:BtnOption
            });
        }
    });
}
 
  doc.bindCommonEvents(BtnOption, data, layEvent, url);
});
         }

         })
          debugger;
          doc.objectQuery(url, { }, function (data) {
              debugger;
               alldata.push(data.numberData);
               doc.objectQuery(xqurl, {"Id":id }, function (data) {
                  alldata.push(data.numberData);
                  var Teant={};
                  if(alldata[1].Teant!=null){
                  Teant.Name=alldata[1].Teant.Name;
                  Teant.Phone=alldata[1].Teant.Phone;
                  Teant.Sex=alldata[1].Teant.Sex;
                  Teant.BatethDay =alldata[1].Teant.BatethDay;
                  Teant.Social=alldata[1].Teant.Social;        
              }
            
              alldata.push(Teant);
                  laytpl(getTpl).render(alldata, function (html) {
                  view.innerHTML = html;
                  
              //执行一个laydate实例
              laydate.render({
                  elem: '#BatethDay' //指定元素
              });
              laydate.render({
                  elem: '#BeginTime' //指定元素
              });
              laydate.render({
                  elem: '#EndTime' //指定元素
              }); 
              });
              debugger;
              form.render('');
              $("#DocumentType").val(alldata[1].Teant.DocumentType);
              $("#Document").val(alldata[1].Teant.Document);
              $("#Work").val(alldata[2].Work);
              $("#Hobby").val(alldata[2].Hobby);
            
              $("#PinLv").val(alldata[1].Pinlv);
              $("#DepositType").val(alldata[1].DepositType);
              $("#Recivetype").val(alldata[1].Recivetype);
              $("#BeforeDay").val(alldata[1].BeforeDay);
              $("#Image").val(alldata[1].Image);
              $("#zjImage").val(alldata[1].zjImage);
              $("#bank").val(alldata[1].bank); 
              //查询附件个数
                if(alldata[1].Enclosure!=null){
                    $("#Image").val(alldata[1].Enclosure);
                    var arr=new Array();
                    var str=alldata[1].Enclosure; 
                    str=str.substr(0, str.length - 1);  
                    arr=str.split(';');
                    $("#imgnumber").html(arr.length);
                }
                debugger;
                if(alldata[1].Teant.Zidcard!=null){
                    $("#zjImage").val(alldata[1].Teant.Zidcard);
                    var arr1=new Array();
                    var str=alldata[1].Teant.Zidcard;
                    str=str.substr(0, str.length - 1);  
                    arr1=str.split(';');
                    $("#imgzjnumber").html(arr1.length);
                }
              form.render('');
              //初始化杂费
              initzafei();
              //初始化押金
              inityajin();
               //验证规则
              Create();
              EventOther();
              viewbtn();
              //免租期事件
              debugger;
             initrecentfreevalue(alldata[1].tRentFree);
          });
          });
          function initzafei(){
            debugger;
            var name ="";
            var type = 0;
            var yajin=0;
            var id = "";
            var title="";
        $.each(alldata[1].Otherfee,function(index,item){
            if(item.IsYajin==0){
            name=item.Name;
            type=item.Type;
            yajin=item.IsYajin;
            title=item.Name;
            $("[name='"+name+"']").attr("checked",true); 
            var id = "viewzafei-" + name;
            var content = '<div id="viewzafei-' + name + '" class="zafeilist"><div class="layui-form-item"><label class="layui-form-label zafeitit">' + title + '</label><label class="layui-form-label zisyajin">' +yajin + '</label><div class="wrap-jstype"><label class="layui-form-label">结算方式</label><div class="layui-input-inline zafeiType" style="width: 140px;"><select lay-verify="required" lay-filter="' + id + 'zafeiType" id="' + id + 'zafeiType" name="zafeiType" ><option value="1">按固定费用结算</option><option value="2">预充值</option><option value="3">按抄表结算</option></select></div></div><div class="wrappinlv"><label class="layui-form-label">付款频率</label><div class="layui-input-inline" style="width: 120px;"><select lay-verify="required" id="' + id + 'zafeiPinlv" class="zafeiPinlv" name="zafeiPinlv"><option value="0">随租金结算</option><option value="1">一月一付</option><option value="2">二月一付</option><option value="3">三月一付</option><option value="4">四月一付</option><option value="5">五月一付</option></select></div></div><div class="wraprice"><label class="layui-form-label">费用单价</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeiPrice" lay-verify="" autocomplete="off" class="layui-input zafeiPrice" ></div></div><div class="wrapguding"><label class="layui-form-label">金额</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeiJine" lay-verify="" autocomplete="off" class="layui-input zafeiJine" ></div></div></div><div class="layui-form-item wrapbiao"><label class="layui-form-label">当前读数</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeidushu" lay-verify="" autocomplete="off" class="layui-input zafeidushu" ></div><label class="layui-form-label">抄表日期</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="Chaobiao" lay-verify="" autocomplete="off" class="layui-input Chaobiao"  placeholder=""></div></div></div>';
            $(".viewzafeicontent").append(content);
            initvalue(id,type,item.Amount,item.Pinlv,item.Reading,util.toDateString(item.ChaobiaoTime, 'yyyy-MM-dd'),item.Price);
            form.render('');
            Eventzafei(type,id,yajin);
            }
        });
    }
    function initrecentfreevalue(arr){
        $.each(arr,function(index,value){
            var dom= '<div class="layui-form-item rentfreerow" id="'+"idfield"+index+'"><div class="layui-inline"><div class="layui-input-inline" style="width:160px"><input type="tel" lay-verify="required" autocomplete="off" class="layui-input Begin gray" disabled placeholder="开始时间"></div></div><div class="layui-inline"><div class="layui-input-inline" style="width:160px"><input type="tel"   autocomplete="off"  class="layui-input End gray" disabled  placeholder="结束时间"></div></div><div class="layui-inline"><div class="layui-input-inline" style="width:100px"><input type="tel"  lay-verify="required" autocomplete="off" class="layui-input Amount gray" disabled  placeholder="减免金额"></div></div></div>';
            debugger;
            $(".wraprecent").append(dom);
            //赋值
            var id="#idfield"+index;
            $(id+" .Begin").val(util.toDateString(value.Begin.replace(/-/g, '/'), 'yyyy-MM-dd'));
            $(id+" .End").val(util.toDateString(value.End.replace(/-/g, '/'), 'yyyy-MM-dd'));
            $(id+" .Amount").val(value.Amount+'元');
            var len=$(".rentfreerow").length;
            $("#recentfree").val(len); 
            event();     
        })
        initrecentfree();
    }
    function initrecentfree(){
          event();
          var dom= '<div class="layui-form-item rentfreerow"><div class="layui-inline"><div class="layui-input-inline" style="width:160px"><input type="tel" lay-verify="required" autocomplete="off" class="layui-input Begin"  placeholder="开始时间"></div></div><div class="layui-inline"><div class="layui-input-inline" style="width:160px"><input type="tel"   autocomplete="off"  class="layui-input End"  placeholder="结束时间"></div></div><div class="layui-inline"><div class="layui-input-inline" style="width:100px"><input type="tel"  lay-verify="required" autocomplete="off" class="layui-input Amount"  placeholder="减免金额"></div></div><div class="layui-inline"><button type="button" class="layui-btn layui-btn-primary layui-btn-sm delete" ><i class="layui-icon">&#xe640;</i></button></div></div>';
          $("#add").click(function(){
            debugger;
            $(".wraprecent").append(dom);
            var len=$(".rentfreerow").length;
            $("#recentfree").val(len); 
            event();
          });
          
          form.on('select(recentfree)', function(data){
            debugger;
             var number=data.value;
             var len=$(".rentfreerow").length;
            
             if(number>len){
               var result=number-len;
              
               for (i = 0; i < result; i++) {
              
               $(".wraprecent").append(dom);
               
             }
             }
             if(number<len){
                 var gtdom=':gt('+(number-1)+')';
                  $(".rentfreerow").filter(gtdom).remove()
             }
             if(number==0){
                  $(".rentfreerow").remove()
             }
             event();
          });  
           
}      
function event(){
          
          $('.Begin').each(function(){
            laydate.render({
           elem:this
          });
          }) 
          $('.End').each(function(){
            laydate.render({
            elem:this
          });
          }) 
          $(".delete").click(function(){
           debugger;
           var dom= $(this).parent().parent('.rentfreerow');
           dom.remove();
           var len=$(".rentfreerow").length;
           $("#recentfree").val(len); 
           form.render('');  
          })
          form.render('');  
         }
    function inityajin(){
            debugger;
            var name ="";
            var type = 0;
            var yajin=0;
            var id = "";
            var title="";
            $.each(alldata[1].Yajin,function(index,item){
            if(item.IsYajin==1){
            name=item.Name;
            type=item.Type;
            yajin=item.IsYajin;
            title=item.Name;
            $("[name='"+name+"']").attr("checked",true); 
            var id = "yajin-" + name;
            var content = '<div id="yajin-' + name + '" class="yajinlist"><div class="layui-form-item"><label class="layui-form-label yajintit">' + title + '</label><label class="layui-form-label zisyajin">' +yajin + '</label><div class="wrap-jstype"><label class="layui-form-label">结算方式</label><div class="layui-input-inline zafeiType" style="width: 140px;"><select lay-verify="required" lay-filter="' + id + 'zafeiType" id="' + id + 'zafeiType" name="zafeiType" ><option value="1">按固定费用结算</option><option value="2">预充值</option><option value="3">按抄表结算</option></select></div></div><div class="wrappinlv"><label class="layui-form-label">付款频率</label><div class="layui-input-inline" style="width: 120px;"><select lay-verify="required" class="zafeiPinlv" name="zafeiPinlv"><option value="0">随租金结算</option><option value="1">一月一付</option><option value="2">二月一付</option><option value="3">三月一付</option><option value="4">四月一付</option><option value="5">五月一付</option></select></div></div><div class="wraprice"><label class="layui-form-label">费用单价</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeiPrice" lay-verify="" autocomplete="off" class="layui-input" class="zafeiPrice"></div></div><div class="wrapguding"><label class="layui-form-label">金额</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeiJine" lay-verify="" autocomplete="off" class="layui-input yajinJine" ></div></div></div><div class="layui-form-item wrapbiao"><label class="layui-form-label">当前读数</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeidushu" lay-verify="" autocomplete="off" class="layui-input zafeidushu" ></div><label class="layui-form-label">抄表日期</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="Chaobiao" lay-verify="" autocomplete="off" class="layui-input Chaobiao"  placeholder=""></div></div></div>';
            $(".viewzafeicontent").append(content);
            $( "#" +id+" .yajinJine").val(item.Amount);
            initvalue(id,type,item.Amount,item.Pinlv,item.Reading,item.ChaobiaoTime,0);
            form.render('');
            Eventzafei(type,id,yajin);
            }
        });
    }
    function initvalue(id,type,Amount,Pinlv,Reading,ChaobiaoTime,Price){
        var rid = "#" + id;
        $(rid + "zafeiType").val(type);
        $(rid+" .zafeiJine").val(Amount);
        $(rid+" .zafeiPinlv").val(Pinlv);
        $(rid+" .zafeidushu").val(Reading);
        $(rid+" .zafeiPrice").val(Price);
        $(rid+" .Chaobiao").val(ChaobiaoTime);
        

    }
          function viewbtn(){
            var BtnviewOption = {
                menuid:191,
                tablebtnid: '#btnintableview',
                area: ['1200px', '90%'],
                editarea: ['1200px', '90%'],
                tableid: "ycontract-index-table",
                ismuilti:true,
                btnview:  "ycontract-button-view",
                toolview: "ycontract-view-btn",
                tooladd:  "ycontract-add-btn",
                tooledit: "ycontract-edit-btn",
                tooldelete:"ycontract-delete-btn",
                deletespname:"sp_plyzdeletecontract",
                url:'contract/y-contract/view',//查看界面路径
                layindex:layerindex,
       
            };
            doc.viewbutton(BtnviewOption, zcontractbtnscribt);
            $("#btnintableview a").click(function(){
                debugger;
                var data=$(this).attr("lay-event");
                var url =$(this).attr("data-url");
                if (data === 'ycontract-tuizu-btn') { //退租
                    if(alldata[1].Status!=1&&alldata[1].Status!=5&&alldata[1].Status!=6&&alldata[1].Status!=9){
                        layer.msg("合同状态不为待签约和在租中不能进行退租操作");
                        return;
                    }
                    var editid="layuizcontracttuizubtn";
                    var view = layui.view;
                    layer.open({
                        id: editid,
                        type: 1,
                        title: '退租',
                        skin: 'two-layer',
                        shadeClose: false, //开启遮罩关闭
                        maxmin: true, //开启最大化最小化按钮
                        area: ['1000px', '90%'],
                        success: function(layero, index) {
                            view(this.id).render(url, {
                                id: alldata[1].Id,
                                tableid: "bill-main-table",
                                layerindex: index
                            });
                        }
                    });
                }
                if (data === 'ycontract-xuzu-btn') { 
                    if(alldata[1].Status!=1&&alldata[1].Status!=5&&alldata[1].Status!=2&&alldata[1].Status!=6&&alldata[1].Status!=9){
                        layer.msg("合同状态不为待签约和在租中不能进行续租操作");
                        return;
                    }
                    var editid="layuizcontracttuizubtn";
                    var view = layui.view;
                    layer.open({
                        id: editid,
                        type: 1,
                        title: '续租',
                        skin: 'two-layer',
                        shadeClose: false, //开启遮罩关闭
                        maxmin: true, //开启最大化最小化按钮
                        area: ['1000px', '90%'],
                        success: function(layero, index) {
                            view(this.id).render(url, {
                                id: alldata[1].Id,
                                tableid: "bill-main-table",
                                layerindex: index
                            });
                        }
                    });
                }
                if (data ===BtnviewOption.tooledit) { 
                    doc.bindCommonEvents(BtnviewOption,alldata[1].Id,BtnviewOption.tooledit,url);
                }
                if (data ===BtnviewOption.tooldelete) { 
                    doc.bindCommonEvents(BtnviewOption,alldata[1],BtnviewOption.tooldelete,url);
                }
            })
          }
          function Create() {
            form.on('checkbox(zafei)', function (data) {
                debugger;
                var dom = data.elem;
                var name = dom.name;
                var type = dom.attributes.ztype.nodeValue;
                var yajin=dom.attributes.zyajin.nodeValue;
                var id = "viewzafei-" + name;
                var content = '<div id="viewzafei-' + name + '" class="zafeilist"><div class="layui-form-item"><label class="layui-form-label zafeitit">' + dom.title + '</label><label class="layui-form-label zisyajin">' +yajin + '</label><div class="wrap-jstype"><label class="layui-form-label">结算方式</label><div class="layui-input-inline zafeiType" style="width: 140px;"><select lay-verify="required" lay-filter="' + id + 'zafeiType" id="' + id + 'zafeiType" name="zafeiType" ><option value="1">按固定费用结算</option><option value="2">预充值</option><option value="3">按抄表结算</option></select></div></div><div class="wrappinlv"><label class="layui-form-label">付款频率</label><div class="layui-input-inline" style="width: 120px;"><select lay-verify="required" class="zafeiPinlv" name="zafeiPinlv"><option value="0">随押金结算</option><option value="1">一月一付</option><option value="2">二月一付</option><option value="3">三月一付</option><option value="4">四月一付</option><option value="5">五月一付</option></select></div></div><div class="wraprice"><label class="layui-form-label">费用单价</label><div class="layui-input-inline zafeiPrice" style="width: 100px;"><input type="tel" name="zafeiPrice" lay-verify="" autocomplete="off" class="layui-input zafeiPrice" ></div></div><div class="wrapguding"><label class="layui-form-label">金额</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeiJine" lay-verify="" autocomplete="off" class="layui-input zafeiJine" ></div></div></div><div class="layui-form-item wrapbiao"><label class="layui-form-label">当前读数</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="zafeidushu" lay-verify="" autocomplete="off" class="layui-input zafeidushu" ></div><label class="layui-form-label">抄表日期</label><div class="layui-input-inline" style="width: 100px;"><input type="tel" name="Chaobiao" lay-verify="" autocomplete="off" class="layui-input Chaobiao"  placeholder=""></div></div></div>';
              
                if (dom.checked == true)
                {
                    $(".viewzafeicontent").append(content);
                } else {
                    $("#"+id).remove();
                }
                form.render('');
                $("#"+id+" .zafeiType").val(type);
                Eventzafei(type,id,yajin);
            });
            form.on('checkbox(yajin)', function (data) {
                debugger;
                var dom = data.elem;
                var name = dom.name;
                var type = dom.attributes.ztype.nodeValue;
                var yajin=dom.attributes.zyajin.nodeValue;
                var id = "yajin-" + name;
                var content = '<div id="yajin-' + name + '" class="yajinlist"><div class="layui-form-item"><label class="layui-form-label yajintit">' + dom.title + '</label><div class="layui-input-inline zafeiType" style="width: 140px;"><input type="tel" name="yajinJine" lay-verify="" autocomplete="off" class="layui-input yajinJine" ></div></div>';
              
                if (dom.checked == true)
                {
                    $(".viewviewzafeicontent").append(content);
                } else {
                    $("#"+id).remove();
                }
                form.render('');
                $(id+" .zafeiType").val(type);
                Eventzafei(type,id,yajin);
        });
        }
          
         form.on('select(Recivetype)', function(data){
             debugger;
             var hao='<option value="1">1号</option><option value="2">2号</option><option value="3">3号</option><option value="3">3号</option><option value="4">4号</option><option value="5">5号</option><option value="6">6号</option><option value="7">7号</option><option value="8">8号</option><option value="9">9号</option><option value="10">10号</option>';
             var tian='<option value="0">0天</option><option value="1">1天</option><option value="2">2天</option><option value="3">3天</option><option value="3">3天</option><option value="4">4天</option><option value="5">5号</option><option value="6">6天</option><option value="7">7天</option><option value="8">8天</option><option value="9">9天</option><option value="10">10天</option>';
             if(data.value==1){
                    $("#BeforeDay").empty();
                    $("#BeforeDay").append(hao);
             }
             if(data.value==2){
              $("#BeforeDay").empty();
               $("#BeforeDay").append(tian);
              }
              form.render('select');
         });
         function EventOther(){
             //监听提交
   $("#viewcontract").click(function(){
       debugger;
      var editid = "layuibillreceivebtn";
      var view = layui.view;
      layer.open({
          id: editid,
          type: 1,
          title: '收款',
          skin: 'two-layer',
          shadeClose: true, //开启遮罩关闭
          maxmin: true, //开启最大化最小化按钮
          area: ['1000px', '90%'],
          success: function(layero, index) {
              view(this.id).render('contract/z-contract/view1', {
                  id: id,
                  tableid: "bill-main-table-cont",
                  layerindex: index
              });
          }
      });
   })
          
          $("#addimage").click(function () {
              debugger;
           var addid="layui-contract-addimage";
           var view = layui.view;
           layer.open({
              id:addid,
              type: 1,
              title: '上传文件',
              skin: 'two-layer',
              //anim: 4,
              shadeClose: true,//开启遮罩关闭
              //shade: ['0.5'],
              maxmin: true, //开启最大化最小化按钮
              area:['800px', '500px'],
              success: function(layero,index){
                  view(this.id).render('upload/index', {
                      img:$("#Image").val(),
                      type:1,
                      layerindex:index
                  });
                }
          });  
         });
         $("#addzjimage").click(function () {
              debugger;
           var addid="layui-contract-addzjimage";
           var view = layui.view;
           indexclose=layer.open({
              id:addid,
              type: 1,
              title: '上传文件',
              skin: 'two-layer',
              //anim: 4,
              shadeClose: true,//开启遮罩关闭
              //shade: ['0.5'],
              maxmin: true, //开启最大化最小化按钮
              area:['800px', '500px'],
              success: function(layero,index){
                  view(this.id).render('upload/index', {
                      img:$("#zjImage").val(),
                      type:2,
                      layerindex:index
                  });
                }
          });  
         });
         }
          function Eventzafei(type,id,isyajin) {
              debugger;
              var rid = "#" + id;
              if(isyajin==1){
                  $(rid+" .wraprice").hide();
                  $(rid+" .wrapbiao").hide();
                  $(rid+" .wrap-jstype").hide();
                  $(rid+" .wrapguding").show();
                  $(rid+" .wrappinlv").hide();
                  return;
              }
              if (type == 1) {
                  $(rid+" .wraprice").hide();
                  $(rid+" .wrapbiao").hide();
                  $(rid+" .wrapguding").show();
                  $(rid+" .wrappinlv").show();
              }
              if (type == 2) {
                  $(rid+" .wrappinlv").hide();
                  $(rid+" .wraprice").hide();
                  $(rid+" .wrapbiao").hide();
                  $(rid+" .wrapguding").hide();
              }
              if (type == 3) {
                  $(rid+" .wrapguding").hide();
                  $(rid+" .wrappinlv").hide();
                  $(rid+" .wraprice").show();
                  $(rid+" .wrapbiao").show();
                  
              }
              form.on('select('+id+'zafeiType)', function (data) {
                  debugger;
                  if ($(rid + "zafeiType").val() == 1) {
                      $(rid + " .wraprice").hide();
                      $(rid + " .wrapbiao").hide();
                      $(rid + " .wrapguding").show();
                  }
                  if ($(rid + "zafeiType").val() == 2) {
                      $(rid + " .wrappinlv").hide();
                      $(rid + " .wraprice").hide();
                      $(rid + " .wrapbiao").hide();
                      $(rid + " .wrapguding").hide();
                  }
                  if ($(rid + "zafeiType").val() == 3) {
                      $(rid + " .wrapguding").hide();
                      $(rid + " .wrappinlv").show();
                      $(rid + " .wraprice").show();
                      $(rid + " .wrapbiao").show();
                  }
              });
              var laydate = layui.laydate;
              laydate.render({
                  elem: rid+' .Chaobiao' //指定元素
              });
          }
          form.verify({
              EndTime : function(value, item){
              if(value <= $("#BeginTime").val()){
          return "开始时间必须大于结束时间";
      }
  },
  HouseName: function(value, item){
      debugger
              if($("#HouseId").val()==""||$("#HouseType").val()==""){
          return "房源不存在";
      }}
})
   
function formadaoqi(value) {
    // debugger;
    var day = value.Day;
    
    if (value.ShouldReceive == null) {
        return '<span>' + "未知" + '</span>';
    }
    if (value.PayStatus == 1) {
        return '<span>' + util.toDateString(value.BeginTime.replace(/-/g, '/'), 'yyyy/MM/dd') + '</span>'
    } 
   
    if (day == 0) {
        return '<span>' + "今日收款" + '</span>';
    }
    if (day > 0) {
       
        return '<span style="color:#ff5153">' + "逾期" + day + "天" + '</span>';
    }
    if (day < 0) {
        day=0-day;
        return '<span>' + day + "天后收款" + '</span>';
    }
}
  function formastatus(value) {
      if (value.Status ==1) {
          return '<span>' + "已逾期" + '</span>'
      } 
      if (value.Status ==2) {
          return '<span>' + "应处理" + '</span>'
      } 
      if (value.Status ==3) {
          return '<span>' + "待处理" + '</span>'
      } 
      if (value.Status ==4) {
          return '<span>' + "已处理" + '</span>'
      } 
      
  }
  function formatype(value) {
  if (value.BillType == 0) {
      return '<span>' + "收款单" + '</span>'
  } if (value.BillType ==1) {
      return '<span>' + "付款单" + '</span>'
  }
  if (value.BillType ==3) {
      return '<span>' + "退款单" + '</span>'
  }
  return '<span>' + "未知" + '</span>'
}

function formasign(value) {
    debugger;
    var result="";
    var result1="";
    var retu=value.sign;
    if(value.stage!=0){
        retu+="-"+value.stage+"期"
    }
   
    if(value.PayStatus==5){
      
        result1='<span style="background-color: #FF5722;color:white;padding:3px;margin-left:2px;">暂停打款</span>'
    }
    result='<span>' +retu+ '</span>';
    return result+result1;
}
  function formatterzhouqi(value) {
      debugger;
      if(value.BeginTime==null||value.EndTime==null){
          return '<div>'+'</div>'
      }
      if(value.BeginTime=="0001-01-01 00:00:00"||value.EndTime=="0001-01-01 00:00:00"){
          return '<div>'+'</div>'
      }
      debugger;
      var begintime=util.toDateString(value.BeginTime, 'yyyy-MM-dd');
      var endtime=util.toDateString(value.EndTime, 'yyyy-MM-dd');
      return '<div>' + begintime+" - "+endtime + '</div>';
  }
  function formatterreveice(value)
  {
      if(value.ShouldReceive==null){
          return "";
      }
     return  util.toDateString(value.ShouldReceive, 'yyyy-MM-dd')
  }    
  });
}
function complteimg(name,type, number){
  layui.use(['jquery'], function () {
      var $ = layui.jquery;
      if(type==1){
       $("#Image").val(name);
       $("#imgnumber").html(number);
      }
      if(type==2){
       $("#zjImage").val(name);
       $("#imgzjnumber").html(number);
      }
  })
} 
function formatterbtn(value,field,name){
    debugger;
     if(field=="signbill"){
        if(value.PayStatus==0){
            return "标记暂停打款";
        }
        if(value.PayStatus==5){
         return "恢复正常打款";
        }
        return name;
     }
     if(field=="fukuan"){
        if(value.sign=="租客退款"){
            return "租客退款";
        }
        if(value.sign=="业主退款"){
            return "业主退款";
        }
       if(value.BillType==0){
           return "收款";
       }
       if(value.BillType==1){
        return "付款";
       }
       return name;
    }
     return name;
 }