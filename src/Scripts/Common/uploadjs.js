
function LoadData(img,type,layerindex){
    layui.use(['upload',"setter",'layer'], function () {
        var imagearr = [];
        var index;
       
        var $ = layui.jquery
        , upload = layui.upload;
        var currindex;
        var uploadInst;
        var setter = layui.setter;
        var baseurl = setter.baseurl;
        var imgurl = setter.imgurl;
        Initimg();
        removeEvent();
        var url=baseurl+'api/webupload/uploadimage';
        //多图片上传
        uploadInst=upload.render({
           elem: '#test2'
          ,url: url
          ,multiple: true
          ,accept:'file'
          ,before: function(obj){
              //预读本地文件示例，不支持ie8
              index = layer.load(1);
              obj.preview(function (index, file, result) {
                  if (currindex == index) {
                      return;
                  }
                  currindex = index;
                  if(file.type!="image/png"&&file.type!="image/jpeg"&&file.type!="image/jpeg"&&file.type!="image/gif"){
                      result="../Images/timg.jpg";
                  }
                  var html = "<div class='col-6-24 item' id=item-" +index+ "><span class='error'>上传中</span><span class='cc' id='cc-"+index+"'><button class='layui-btn layui-btn-sm btcc'>重新上传</button></span><img src='" + result + "' alt='" + file.name + "' class='layui-upload-img'>"+file.name+"<i class='layui-icon remove' style='font-size: 30px;color:#FF5722;'>&#x1007;</i></div>"
                  $('#demo2').append(html);
                  removeEvent();
                  $("#cc-" + index).click(function (event) {
                      obj.upload(index, file);         
                      //event.stopPropagation();
                  });
              });
          }
          ,done: function (res){
              if (res.Code == 0) {
                  imagearr.push(res.numberData);
                  $("#item-" + currindex).append('<i class="layui-icon success" style="font-size: 30px;color:#5FB878;">&#x1005;</i>');
                  $("#item-" + currindex + " .cc").hide();
                  $("#item-" + currindex + " .error").hide();
                  
              } else {
                $("#item-" + currindex + " .error").html("上传失败");
              }
              layer.close(index);
              return true;
              //上传完毕
          }, error: function () {
            $("#item-" + currindex + " .error").html("上传失败");
              layer.close(index);
          }
        });
      
       
        function removeEvent() {
            $(".remove").click(function () {
                var removeItem = "";
                removeItem = $(this).prev("img").attr("alt");
                $(this).parent().remove();
                imagearr = $.grep(imagearr, function (value) {
                    return value != removeItem;
                });
            });
        }
        function Initimg() {
            var name = img;
            if (name != null && name != "undefined" && name != "") {
                imagearr = getarr(name);
                $.each(imagearr, function (index, value) {
                    var html = '<div class="col-6-24 item"><img src="' + imgurl+value + '" alt="' + value + '"  class="layui-upload-img"><i class="layui-icon remove" style="font-size: 30px;color:#FF5722;">&#x1007;</i><i class="layui-icon success" style="font-size: 30px;color:#5FB878;">&#x1005;</i><i class="layui-icon view">&#xe615;</i><i class="layui-icon download">&#xe601;</i></div>';
                    $('#demo2').append(html);
                });
                layer.photos({
                  photos: '#demo2'
                  ,anim: 5
                });
            }
        };
        function getarr(name) {
            name = name.substr(0, name.length - 1);
            return name.split(";");
        }
        function getstr(arr) {
            var revalue = "";
            $.each(arr, function (index,value) {
                revalue+=value+";";
            });
            return revalue;
        }
        $("#cancel1").click(function () {
            layer.close(layerindex); 
        });
        $("#imgsave").click(function () {
            var revalue = getstr(imagearr);
            layer.close(layerindex); 
           
            complteimg(revalue,type, imagearr.length);
            
        });
        //下载
        $('.layui-upload-list').on('click', '.download', function(){
          var file = $(this).siblings('img').attr('alt');
          location.href = baseurl + 'HtcsExcel/DownloadFile?filename=' + file;
        });
        //预览
        $('.layui-upload-list').on('click', '.view', function(){
          $(this).siblings('img').click();
        });
        return false;
});
}

