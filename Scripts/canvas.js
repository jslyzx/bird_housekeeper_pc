  //JS分两大部分，
//第一部分实现整体功能，第二部分调用：
//第一部分：
　　//第一部分功能原理大概是，画两个圆，一个是底色圆，第二个是动态加载的圆弧，进度通过定时器加载；颜色加渐变色；
    function toCanvas(id ,progress,content){
        //  canvas进度条
                var canvas = document.getElementById(id),
                ctx = canvas.getContext("2d"),
                percent = progress,  //最终百分比
                circleX = canvas.width / 2, // 中心x坐标
                circleY = canvas.height / 2,  //中心y坐标
                radius = 90,// 圆环半径
                lineWidth = 10, // 圆形线条的宽度
                fontSize = 15; //字体大小
                //  两端圆点
                function smallcircle1(cx, cy, r) {
                    ctx.beginPath();
                    //ctx.moveTo(cx + r, cy);
                    ctx.lineWidth = 1;
                    ctx.fillStyle = '#06a8f3';
                    ctx.arc(cx, cy, r,0,Math.PI*2);
                    ctx.fill();
                }
                 function smallcircle2(cx, cy, r) {
                     ctx.beginPath();
                     //ctx.moveTo(cx + r, cy);
                     ctx.lineWidth = 1;
                     ctx.fillStyle = '#00f8bb';
                     ctx.arc(cx, cy, r,0,Math.PI*2);
                     ctx.fill();
                 }
                 debugger;
                 //画圆
                 function circle(cx, cy, r) {
                     ctx.beginPath();
                     //ctx.moveTo(cx + r, cy);
                     ctx.lineWidth = lineWidth;
                     ctx.strokeStyle = '#eee';
                     ctx.arc(cx, cy, r,0,2*Math.PI);
                     ctx.stroke();
                 }

                 // 画弧线
                 function sector(cx, cy, r, startAngle, endAngle) {
                     ctx.beginPath();
                     //ctx.moveTo(cx, cy + r); // 从圆形底部开始画
                     ctx.lineWidth = lineWidth;

                     // 渐变色 - 可自定义
                     var linGrad = ctx.createLinearGradient(
                         circleX-radius-lineWidth, circleY, circleX+radius+lineWidth, circleY
                     );
                     linGrad.addColorStop(0.0, '#06a8f3');
                     //linGrad.addColorStop(0.5, '#9bc4eb');
                     linGrad.addColorStop(1.0, '#00f8bb');
                     ctx.strokeStyle = linGrad;

                     // 圆弧两端的样式
                     ctx.lineCap = 'round';

                     // 圆弧
                     ctx.arc(
                         cx, cy, r,
                         (Math.PI*0.5),
                         (Math.PI*0.5) + endAngle/100 * (Math.PI*2),
                         false
                     );
                     ctx.stroke();
                 }

                 //刷新
                 function loading() {
                     if (process >= percent) {
                         clearInterval(circleLoading);
                     }

                     //   清除canvas内容
                     ctx.clearRect(0, 0, circleX * 2, circleY * 2);

                     //中间的字
                     ctx.font = fontSize + 'px April';
                     ctx.textAlign = 'center';
                     ctx.textBaseline = 'middle';
                     ctx.fillStyle = '#999';
                     ctx.fillText(parseFloat(process).toFixed(0) +"%", circleX, circleY);   
                     //第二行 
                     ctx.fillText(content, circleX, circleY+30);    
                     //  圆形
                     circle(circleX, circleY, radius);
                     
                     // 圆弧
                     sector(circleX, circleY, radius, 0, process);
                     //  两端圆点
                     //smallcircle1(150+Math.cos(2*Math.PI/360*120)*100, 150+Math.sin(2*Math.PI/360*120)*100, 5);
                    // smallcircle2(150+Math.cos(2*Math.PI/360*(120+process*3))*100, 150+Math.sin(2*Math.PI/360*(120+process*3))*100, 5);
                     //  控制结束时动画的速度
                     if (process / percent > 0.90) {
                         process += 0.30;
                     } else if (process / percent > 0.80) {
                         process += 0.55;
                     } else if (process / percent > 0.70) {
                         process += 0.75;
                     } else {
                         process += 1.0;
                     }
                 }

                 var process = 0.0;  //进度
                 var circleLoading = window.setInterval(function () {
                     loading();
                 }, 20);
                     
            }
            function toCanvas1(id ,progress,content){
                //  canvas进度条
                        var canvas = document.getElementById(id),
                        ctx = canvas.getContext("2d"),
                        percent = progress,  //最终百分比
                        circleX = canvas.width / 2, // 中心x坐标
                        circleY = canvas.height / 2,  //中心y坐标
                        radius = 90,// 圆环半径
                        lineWidth = 10, // 圆形线条的宽度
                        fontSize = 15; //字体大小
                        //  两端圆点
                        function smallcircle1(cx, cy, r) {
                            ctx.beginPath();
                            //ctx.moveTo(cx + r, cy);
                            ctx.lineWidth = 1;
                            ctx.fillStyle = '#06a8f3';
                            ctx.arc(cx, cy, r,0,Math.PI*2);
                            ctx.fill();
                        }
                         function smallcircle2(cx, cy, r) {
                             ctx.beginPath();
                             //ctx.moveTo(cx + r, cy);
                             ctx.lineWidth = 1;
                             ctx.fillStyle = '#00f8bb';
                             ctx.arc(cx, cy, r,0,Math.PI*2);
                             ctx.fill();
                         }
                         debugger;
                         //画圆
                         function circle(cx, cy, r) {
                             ctx.beginPath();
                             //ctx.moveTo(cx + r, cy);
                             ctx.lineWidth = lineWidth;
                             ctx.strokeStyle = '#eee';
                             ctx.arc(cx, cy, r,0,2*Math.PI);
                             ctx.stroke();
                         }
        
                         // 画弧线
                         function sector(cx, cy, r, startAngle, endAngle, anti) {
                             ctx.beginPath();
                             //ctx.moveTo(cx, cy + r); // 从圆形底部开始画
                             ctx.lineWidth = lineWidth;
        
                             // 渐变色 - 可自定义
                             var linGrad = ctx.createLinearGradient(
                                 circleX-radius-lineWidth, circleY, circleX+radius+lineWidth, circleY
                             );
                             linGrad.addColorStop(0.0, '#06a8f3');
                             //linGrad.addColorStop(0.5, '#9bc4eb');
                             linGrad.addColorStop(1.0, '#00f8bb');
                             ctx.strokeStyle = linGrad;
        
                             // 圆弧两端的样式
                             ctx.lineCap = 'round';
        
                             // 圆弧
                             ctx.arc(
                                 cx, cy, r,
                                 (Math.PI*2/3),
                                 (Math.PI*2/3) + (Math.PI*2),
                                 false
                             );
                             ctx.stroke();
                         }
        
                         //刷新
                         function loading() {
                             if (process >= percent) {
                                 clearInterval(circleLoading);
                             }
        
                             //   清除canvas内容
                             ctx.clearRect(0, 0, circleX * 2, circleY * 2);
        
                             //中间的字
                             ctx.font = fontSize + 'px April';
                             ctx.textAlign = 'center';
                             ctx.textBaseline = 'middle';
                             ctx.fillStyle = '#999';
                             ctx.fillText(parseFloat(process).toFixed(0) +"元", circleX, circleY);   
                             //第二行 
                             ctx.fillText(content, circleX, circleY+30);    
                             //  圆形
                             circle(circleX, circleY, radius);
                             
                             // 圆弧
                             sector(circleX, circleY, radius, Math.PI*2/3, process);
                             //  两端圆点
                             //smallcircle1(150+Math.cos(2*Math.PI/360*120)*100, 150+Math.sin(2*Math.PI/360*120)*100, 5);
                            // smallcircle2(150+Math.cos(2*Math.PI/360*(120+process*3))*100, 150+Math.sin(2*Math.PI/360*(120+process*3))*100, 5);
                             //  控制结束时动画的速度
                             if (process / percent > 0.90) {
                                 process += 0.30;
                             } else if (process / percent > 0.80) {
                                 process += 0.55;
                             } else if (process / percent > 0.70) {
                                 process += 0.75;
                             } else {
                                 process += 1.0;
                             }
                         }
        
                         var process = 0.0;  //进度
                         var circleLoading = window.setInterval(function () {
                             loading();
                         }, 20);
                             
                    }