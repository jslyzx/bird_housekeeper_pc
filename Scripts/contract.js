debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate','util'], function () {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var table = layui.table;
    var form=layui.form;
    var view = layui.view;
    laydate.render({
        elem: '#ShouldReceive'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#Zafei-main-table",table:"Zafei-main-table",formid:"#Zafei-search-form",url:"api/template/Query"
,btnview:"Zafei-button-view",toolview:"viewmubanr",tooladd:"www",tooledit:"www",tooldelete:"deletemuban",tabfield:"Type"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' },
  { field: 'title', width: 200, title: '名称' }
  ,{field:'isdefault', title:'是否默认', width:105, templet: '#switchTpl', unresize: true}
]], height: 620, url: config.url,ismuilti: true,
tablebtnid: '#btnintable',
"tabfield": "IsYajin",
    };
    var BtnOption = {
        area: ['1100px', '90%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: "",
        tooldelete:config.tooldelete,
        menuid:215,
        "realtable": "T_TEMPLATE"
    };
    doc.InitButton(BtnOption, Zafeibtnscribt, tableoption);
    //监听工具栏按钮
   table.on('tool(demoEvent)', function(obj) {
       debugger;
       var data = obj.data,
       layEvent = obj.event,
       url = $(this).data('url');
      if (layEvent=== 'editmuban') { //预览
        var editid = "layuibilleditbtn";
        var view = layui.view;
        layer.open({
            id: editid,
            type: 1,
            title: '编辑',
            skin: 'two-layer',
            shadeClose: true, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['1000px', '90%'],
            success: function(layero, index) {
                view(this.id).render(url, {
                    id:data.Id,
                    tableid: 'Zafei-main-table',
                    layerindex: index,
                    title: data.title,
                    content: data.content
                   
                });
            }
        });
    }
    if (layEvent=== 'viewmuban') { //预览
        var editid = "layuibillreceivebtn";
        var view = layui.view;
        layer.open({
            id: editid,
            type: 1,
            title: '预览',
            skin: 'two-layer',
            shadeClose: true, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['1000px', '90%'],
            success: function(layero, index) {
                view(this.id).render(url, {
                 
                    tableid: 'Zafei-main-table',
                    layerindex: index,
                    title: data.title,
                    content: data.content
                });
            }
        });
    }
    doc.bindCommonEvents(BtnOption, data, layEvent, url);
   });
   $('#addmuban').click(function () {
    var url = $(this).attr('hturl');
    layer.open({
      type: 1,
      title: '添加模板',
      area: '300px',
      resize: false,
      btn: ['确定', '取消'],
      content: '<form class="layui-form" style="margin-top: 15px;padding-right: 20px;"><div class="layui-form-item"><label class="layui-form-label">模板名称</label><div class="layui-input-block"><input type="text" placeholder="请填写模板名称" class="layui-input template-title"></div></div></form>',
      success: function (layero) {
        layero.find('.layui-layer-btn0').on("click", function () {
          var title = layero.find('.template-title').val();
          if (title !== '') {
            layer.open({
              id: 'layui-contract-add-btn',
              type: 1,
              title: '添加模板',
              skin: 'two-layer',
              shadeClose: true,
              maxmin: true,
              area: ['900px', '90%'],
              success: function (layero, index) {
                view(this.id).render(url, {
                  tableid: 'Zafei-main-table',
                  layerindex: index,
                  title: title,
                  content: ''
                });
              }
            })
          }
        })
        layero.find('.layui-layer-btn1').on("click", function () {
          layer.closeAll();
        })
      }
    })
  })
    form.on('switch(sexDemo)', function(obj){
        debugger;
        var Id=$(obj.elem).attr("datas");
        var isactive=0;
        if(obj.elem.checked){
            isactive=1;
        }
        var tjdata={"Id":Id,"IsActive":isactive,"NotUpdatefield":["Name","Code","Type","IsYajin","TuiType"]};
        var saveoption={
            url:'api/Zafei/Savezafei',
            data:tjdata,
            tableid:config.table,
            callBack:function(resultData){
              if (resultData.Code == 0) {
                  
              
              }
          }
         }
        doc.Submit(saveoption);
       
    });  
    function yajintemp(value) {
        if (value.IsYajin == 0) {
            return '<div>' + "否" + '</div>'
        } 
        if (value.IsYajin == 1) {
            return '<div>' + "是" + '</div>'
        } 
        return '<div>' + "未知" + '</div>'
    }
    function tuitemp(value) {
       
        if (value.TuiType == 0) {
            return '<div>' + "普通项" + '</div>'
        } 
        if (value.TuiType == 1) {
            return '<div>' + "退款项" + '</div>'
        } 
        return '<div>' + "未知" + '</div>'
    
        
    }
    function Typetemp(value) {
       
        if (value.Type == 1) {
            return '<div>' + "固定费用" + '</div>'
        } 
        if (value.Type == 2) {
            return '<div>' + "预充值" + '</div>'
        } 
        if (value.Type == 3) {
            return '<div>' + "抄表结算" + '</div>'
        } 
        return '<div>' + "未知" + '</div>'
    
        
    }
});