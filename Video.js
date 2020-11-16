/**
 * 一个视频播放器对象
 * @param {String} src 链接-必须是视频的完整引用地址，如http://127.0.0.1:8888/File/VID/test.mp4
 * @param {DoubleRange} width 宽度
 * @param {DoubleRange} height 高度
 * @param {Element} father_div 父DIV
 * @param {Function} screenshot_callback 截图按钮回调（参数是图片的blob）
 */
function Video(src, width, height, father_div, screenshot_callback, video_name = "Video", frame_rate = 25, video_list = null) {

    this.src = src;//视频mp4链接地址
    var this_src = src;//视频mp4链接地址
    var video_list = video_list;
    var width = width;//宽度
    var height = height;//高度
    var normal_width = width;//记录正常大小宽度
    var normal_height = height;//记录初始大小高度
    var father_div = father_div;//所属DIV
    var this_div = document.createElement("div");//当前控件div
    var Video_Obj = document.createElement("video");//视频控件对象          
    var Controls_div = document.createElement("div");//控制条
    var pause_button = document.createElement("div");//暂停按钮
    var pause_button_triangle = document.createElement("div");//暂停按钮内部1
    var pause_button_Line = document.createElement("div");//暂停按钮内部2
    var range_div = document.createElement("div");//滑动条区域
    var control_range = document.createElement("div");//滑动条/进度条
    var control_range_child = document.createElement("div");//滑动条-子元素
    var speed_up_btn = document.createElement("div");//播放加速
    var speed_down_btn = document.createElement("div");//播放减速
    var speed_div = document.createElement("div");//视频播放速度显示
    var cut_jpg_btn = document.createElement("button");//截图按钮
    var canvas = document.createElement("canvas");//截图临时保存位置
    var next_frame_btn = document.createElement("div");//下一帧按钮
    var before_frame_btn = document.createElement("div");//上一帧按钮
    var frame_text = document.createElement("div");//显示帧数
    var download_btn = document.createElement("div");//下载按钮
    var select_obj = document.createElement("input");
    var size = "min";//窗口大小标志

    var video_time;//视频总时长


    //加载控制条
    var control_load = function () {
        pause_button.style.cssText = "width:25px;height:25px;border:5px solid #888888;border-radius:25px;background-color: transparent;" +
            "padding:0;margin: 3px 3px;float:left; cursor:pointer;box-sizing: content-box;";

        pause_button_triangle.style.cssText = "width: 0;height: 0;border: 10px solid transparent;margin:3px 6px 3px 9px;" +
            "border-left-color: #888888;border-right: none;border-top-color: transparent;border-bottom-color: transparent;box-sizing: content-box;";
        pause_button.appendChild(pause_button_triangle);

        pause_button_Line.style.cssText = "width: 3px;height: 15px;border: 5px solid #888888;margin:5px 6px 5px 6px;box-sizing: content-box;" +
            "border-top: none;border-bottom: none;";
        pause_button_Line.style.display = "none";
        pause_button.appendChild(pause_button_Line);
        //暂停按钮点击事件
        pause_button.onclick = function () {
            var video_play_status = !Video_Obj.paused;
            if (video_play_status) {
                if (!select_obj.checked) {
                    Video_Obj.pause();
                    pause_button_triangle.style.display = "";
                    pause_button_Line.style.display = "none";
                }
                if (video_list != null && select_obj.checked) {
                    video_list.forEach(video => {
                        if (video.select_checked()) {
                            video.pause();
                        }
                    });
                }
            } else {
                if (!select_obj.checked) {
                    Video_Obj.play();
                    pause_button_Line.style.display = "";
                    pause_button_triangle.style.display = "none";
                }
                if (video_list != null && select_obj.checked) {
                    video_list.forEach(video => {
                        if (video.select_checked()) {
                            video.play();
                        }
                    });
                }
            }
        }
        Controls_div.appendChild(pause_button);
        //进度条
        control_range.style.width = width - 200 + "px";
        control_range.style.height = 15 + "px";
        control_range.style.margin = "2px 0px";
        control_range.style.backgroundColor = "#CCCCCC";
        control_range.style.borderRadius = "5px";
        control_range.style.cursor = "pointer";

        control_range_child.style.width = "0px";
        control_range_child.style.height = control_range.style.height;
        control_range_child.style.backgroundColor = "#AAAAAA";
        control_range_child.style.borderRadius = "5px";
        control_range.appendChild(control_range_child);

        var time_text_div = document.createElement("div");
        time_text_div.style.cssText = "font-size:10px;float:left;";

        /**
         * 进度条按下
         * @param {*} e 
         */
        control_range.onmousedown = function (e) {
            //进度条按下按钮 
            var length = e.offsetX;
            if (!select_obj.checked) {                
                var percent = video_time / this.offsetWidth;
                Video_Obj.currentTime = length * percent;
            }
            if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.SetVideoCurrentTime(length / this.offsetWidth);
                    }
                });
            }
        }
        //视频加载就绪时
        Video_Obj.addEventListener("canplay", function () {
            video_time = this.duration;
            time_text_div.innerText = parseInt(this.currentTime / 3600) + ":" + parseInt((this.currentTime % 3600) / 60) + ":" + parseInt(((this.currentTime % 3600) % 60)) + "/" + parseInt(video_time / 3600) + ":" + parseInt((video_time % 3600) / 60) + ":" + parseInt(((video_time % 3600) % 60));
            frame_text.innerText = parseInt(this.currentTime * frame_rate) + "/" + parseInt(video_time * frame_rate);
        });
        //视频播放时
        Video_Obj.addEventListener("timeupdate", function () {

            control_range_child.style.width = ((this.currentTime / video_time) * control_range.offsetWidth) + "px";
            time_text_div.innerText = parseInt(this.currentTime / 3600) + ":" + parseInt((this.currentTime % 3600) / 60) + ":" + parseInt(((this.currentTime % 3600) % 60)) + "/" + parseInt(video_time / 3600) + ":" + parseInt((video_time % 3600) / 60) + ":" + parseInt(((video_time % 3600) % 60));
            frame_text.innerText = parseInt(this.currentTime * frame_rate) + "/" + parseInt(video_time * frame_rate);
            if (this.currentTime == this.duration) {
                pause_button_triangle.style.display = "";
                pause_button_Line.style.display = "none";
            }

        });

        range_div.style.cssText = "margin:2px 2px 2px 2px;padding:0;float:left;";
        range_div.style.width = control_range.style.width;
        range_div.appendChild(control_range);
        range_div.appendChild(time_text_div);
        //显示视频播放速度       
        speed_div.style.cssText = "font-size:10px;float:right;margin:0px 0px 0px 0px;cursor:pointer;";
        speed_div.innerText = Video_Obj.playbackRate + "倍";
        //视频播放速度调整为1
        speed_div.onclick = function () {
            if (!select_obj.checked) {
                Video_Obj.playbackRate = 1;
                speed_div.innerText = Video_Obj.playbackRate + "倍";
            }
            if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.speed_normal();
                    }
                });
            }
        }
        range_div.appendChild(speed_div);
        Controls_div.appendChild(range_div);

        //减速按钮
        speed_down_btn.style.cssText = "width:25px;height:25px;border:5px solid #888888;border-radius:25px;background-color: transparent;" +
            "padding:0;margin: 3px 3px;float:left; cursor:pointer;box-sizing: content-box;";
        var speed_down_btn_triangle1 = document.createElement("div");
        speed_down_btn_triangle1.style.cssText = "width: 0;height: 0;border: 9px solid transparent;margin:4px 0px 3px 2px;" +
            "border-right-color: #888888;border-left: none;border-top-color: transparent;border-bottom-color: transparent;float:left;box-sizing: content-box;";
        speed_down_btn.appendChild(speed_down_btn_triangle1);
        var speed_down_btn_triangle2 = document.createElement("div");
        speed_down_btn_triangle2.style.cssText = "width: 0;height: 0;border: 9px solid transparent;margin:4px 2px 3px 0px;" +
            "border-right-color: #888888;border-left: none;border-top-color: transparent;border-bottom-color: transparent;float:left;box-sizing: content-box;";
        speed_down_btn.appendChild(speed_down_btn_triangle2);

        speed_down_btn.onmousedown = function () {
            speed_down_btn_triangle1.style.borderRightColor = "#BBBBBB";
            speed_down_btn_triangle2.style.borderRightColor = "#BBBBBB";
        }
        speed_down_btn.onmouseup = function () {
            speed_down_btn_triangle1.style.borderRightColor = "#888888";
            speed_down_btn_triangle2.style.borderRightColor = "#888888";
        }
        //减速按钮点击事件
        speed_down_btn.onclick = function () {
            if (!select_obj.checked)
                if (Video_Obj.playbackRate > 0.075) {
                    Video_Obj.playbackRate /= 2;
                    speed_div.innerText = Video_Obj.playbackRate + "倍";
                }
            if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.speed_down();
                    }
                });
            }
        }
        Controls_div.appendChild(speed_down_btn);

        //加速按钮
        speed_up_btn.style.cssText = "width:25px;height:25px;border:5px solid #888888;border-radius:25px;background-color: transparent;" +
            "padding:0;margin: 3px 3px;float:left; cursor:pointer;box-sizing: content-box;";
        var speed_up_btn_triangle1 = document.createElement("div");
        speed_up_btn_triangle1.style.cssText = "width: 0;height: 0;border: 9px solid transparent;margin:4px 0px 3px 5px;" +
            "border-left-color: #888888;border-right: none;border-top-color: transparent;border-bottom-color: transparent;float:left;box-sizing: content-box;";
        speed_up_btn.appendChild(speed_up_btn_triangle1);
        var speed_up_btn_triangle2 = document.createElement("div");
        speed_up_btn_triangle2.style.cssText = "width: 0;height: 0;border: 9px solid transparent;margin:4px 2px 3px 0px;" +
            "border-left-color: #888888;border-right: none;border-top-color: transparent;border-bottom-color: transparent;float:left;box-sizing: content-box;";
        speed_up_btn.appendChild(speed_up_btn_triangle2);

        speed_up_btn.onpointerdown = function () {
            speed_up_btn_triangle1.style.borderLeftColor = "#BBBBBB";
            speed_up_btn_triangle2.style.borderLeftColor = "#BBBBBB";
        }
        speed_up_btn.onpointerup = function () {
            speed_up_btn_triangle1.style.borderLeftColor = "#888888";
            speed_up_btn_triangle2.style.borderLeftColor = "#888888";
        }
        //加速按钮点击事件
        speed_up_btn.onclick = function () {
            if (!select_obj.checked)
                if (Video_Obj.playbackRate < 16) {
                    Video_Obj.playbackRate *= 2;
                    speed_div.innerText = Video_Obj.playbackRate + "倍";
                }
            if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.speed_up();
                    }
                });
            }
        }
        Controls_div.appendChild(speed_up_btn);
        //截图按钮
        cut_jpg_btn.style.border = "3px solid #888888";
        cut_jpg_btn.style.borderRadius = "5px";
        cut_jpg_btn.style.width = "45px";
        cut_jpg_btn.style.height = "25px";
        cut_jpg_btn.style.float = "left";
        cut_jpg_btn.innerText = "截图";
        cut_jpg_btn.style.fontSize = "8px";
        cut_jpg_btn.style.padding = "0";
        cut_jpg_btn.style.margin = "5px 3px";
        cut_jpg_btn.style.backgroundColor = "#DDDDDD";
        cut_jpg_btn.style.boxSizing = "content-box";

        Controls_div.appendChild(cut_jpg_btn);
        cut_jpg_btn.onmousedown = function () {
            this.style.border = "3px solid #BBBBBB";
            this.style.backgroundColor = "#AAAAAA"
        }
        cut_jpg_btn.onmouseup = function () {
            this.style.border = "3px solid #888888";
            this.style.backgroundColor = "#DDDDDD";
        }
        cut_jpg_btn.onmouseover = function () {
            this.style.backgroundColor = "#FFFFFF";
        }
        cut_jpg_btn.onmouseleave = function () {
            this.style.backgroundColor = "#DDDDDD";
        }
        //截图按钮单击
        cut_jpg_btn.onclick = function () {
            if (!select_obj.checked)
                pri_cut_pic();
            if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.Cut_Pic();
                    }
                });
            }
        }

        //复选框
        select_obj.type = "checkbox";
        select_obj.checked = true;
        select_obj.style.cssText = "float:left;margin:13px 0 12px 0;width:15px;";
        Controls_div.appendChild(select_obj);

    }

    //加载视频内控制按钮
    var Video_control_load = function () {
        download_btn.style.display = "none";
        download_btn.style.width = "60px";
        download_btn.style.height = "60px";
        download_btn.style.float = "right";
        download_btn.style.boxSizing = "content-box";
        download_btn.style.border = "3px solid #DDDDDD";
        download_btn.style.borderRadius = "10px";
        download_btn.style.position = "relative";
        download_btn.style.right = 20 + "px";
        download_btn.style.bottom = "120px";

        var download_btn_top = document.createElement("div");
        download_btn_top.style.cssText = "width:30px;height:30px;background-color:#EEEEEE;margin:5px 15px 25px 15px;"
        download_btn.appendChild(download_btn_top);
        var download_btn_bot = document.createElement("div");
        download_btn_bot.style.cssText = "margin:-25px 5px 0px 5px;width: 0;height: 0;border: 25px solid transparent;" +
            "border-top-color: #EEEEEE;border-bottom: none;border-left-color: transparent;border-right-color: transparent;box-sizing: content-box;"

        download_btn.appendChild(download_btn_bot);
        //鼠标经过下载按钮时变色
        download_btn.onmouseover = function (e) {
            download_btn_top.style.backgroundColor = "#888888";
            download_btn_bot.style.borderTopColor = "#888888";
        }
        //鼠标离开下载按钮时变色
        download_btn.onmouseleave = function (e) {
            download_btn_top.style.backgroundColor = "#EEEEEE";
            download_btn_bot.style.borderTopColor = "#EEEEEE";
        }
        //鼠标按下下载按钮时变色
        download_btn.onmousedown = function (e) {
            download_btn_top.style.backgroundColor = "#EEEEEE";
            download_btn_bot.style.borderTopColor = "#EEEEEE";
        }
        //鼠标抬起下载按钮时变色
        download_btn.onmouseup = function (e) {
            download_btn_top.style.backgroundColor = "#888888";
            download_btn_bot.style.borderTopColor = "#888888";
        }
        //鼠标点击下载按钮
        download_btn.onclick = function (e) {
            if (!select_obj.checked) {
                pri_download();
            }
            else if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.download();
                    }
                });
            }
        }
        this_div.appendChild(download_btn);

        //鼠标放置
        this_div.onmouseover = function (e) {
            download_btn.style.display = "";
            before_frame_btn.style.display = "";
            next_frame_btn.style.display = "";
        }
        //鼠标离开
        this_div.onmouseleave = function (e) {
            download_btn.style.display = "none";
            before_frame_btn.style.display = "none";
            next_frame_btn.style.display = "none";
        }
        frame_text.innerText = "0/0";
        frame_text.style.cssText = "color:#FFFFFF;background-color:#555555;border-radius:5px;font-size:8px;float:left;position:relative;bottom:" + 60 + "px;left:10px;";
        this_div.appendChild(frame_text);
        //上一帧按钮
        before_frame_btn.style.cssText = "width:80px;position:relative;bottom:" + "" + "50%;margin-top:-60px;left:0px;margin-left;0;display:none;";        
     
        var before_frame_btn_top = document.createElement("div");
        before_frame_btn_top.style.cssText = "width:60px;height:0px;border:10px solid #FFFFFF;border-radius:2px;box-sizing: content-box;";
        before_frame_btn_top.style.borderBottom="none";
        var before_frame_btn_top_rotate = -60;
        before_frame_btn_top.style.webkitTransform = "rotate(" + before_frame_btn_top_rotate + "deg)"
        before_frame_btn_top.style.MozTransform = "rotate(" + before_frame_btn_top_rotate + "deg)"
        before_frame_btn_top.style.msTransform = "rotate(" + before_frame_btn_top_rotate + "deg)"
        before_frame_btn_top.style.OTransform = "rotate(" + before_frame_btn_top_rotate + "deg)"
        before_frame_btn_top.style.transform = "rotate(" + before_frame_btn_top_rotate + "deg)";
        before_frame_btn.appendChild(before_frame_btn_top);
        var before_frame_btn_bot = document.createElement("div");
        before_frame_btn_bot.style.cssText = "width:60px;height:0px;border:10px solid #FFFFFF;border-radius:2px;box-sizing: content-box;position:relative;top:55px;";        
        before_frame_btn_bot.style.borderBottom="none";
        var before_frame_btn_bot_rotate = 60;
        before_frame_btn_bot.style.webkitTransform = "rotate(" + before_frame_btn_bot_rotate + "deg)"
        before_frame_btn_bot.style.MozTransform = "rotate(" + before_frame_btn_bot_rotate + "deg)"
        before_frame_btn_bot.style.msTransform = "rotate(" + before_frame_btn_bot_rotate + "deg)"
        before_frame_btn_bot.style.OTransform = "rotate(" + before_frame_btn_bot_rotate + "deg)"
        before_frame_btn_bot.style.transform = "rotate(" + before_frame_btn_bot_rotate + "deg)";
        before_frame_btn.appendChild(before_frame_btn_bot);
        //上一帧按钮鼠标放置
        before_frame_btn.onmouseover = function (e) {
            before_frame_btn_top.style.borderColor = "#888888";
            before_frame_btn_bot.style.borderColor = "#888888";
        }
        //上一帧按钮鼠标离开
        before_frame_btn.onmouseleave = function (e) {
            before_frame_btn_top.style.borderColor = "#FFFFFF";
            before_frame_btn_bot.style.borderColor = "#FFFFFF";
        }
        //上一帧按钮鼠标按下
        before_frame_btn.onmousedown = function (e) {
            before_frame_btn_top.style.borderColor = "#FFFFFF";
            before_frame_btn_bot.style.borderColor = "#FFFFFF";
        }
        //上一帧按钮鼠标抬起
        before_frame_btn.onmouseup = function (e) {
            before_frame_btn_top.style.borderColor = "#888888";
            before_frame_btn_bot.style.borderColor = "#888888";
        }
        //上一帧按钮鼠标单击
        before_frame_btn.onclick = function (e) {
            if (!select_obj.checked)
                if (Video_Obj.currentTime > 0)
                    Video_Obj.currentTime -= (1 / frame_rate);
            if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.before_frame();
                    }
                });
            }
        }
        this_div.appendChild(before_frame_btn);
        //下一帧按钮
        next_frame_btn.style.cssText = "width:80px;position:relative;bottom:" + "" + "50%;margin-top:-60px;right:-70px;margin-right;0;display:none;float:right;";
        var next_frame_btn_top = document.createElement("div");
        next_frame_btn_top.style.cssText = "width:60px;height:0px;border:10px solid #FFFFFF;border-radius:2px;box-sizing: content-box;border-bottom:none;";
        var next_frame_btn_top_rotate = 60;
        next_frame_btn_top.style.webkitTransform = "rotate(" + next_frame_btn_top_rotate + "deg)"
        next_frame_btn_top.style.MozTransform = "rotate(" + next_frame_btn_top_rotate + "deg)"
        next_frame_btn_top.style.msTransform = "rotate(" + next_frame_btn_top_rotate + "deg)"
        next_frame_btn_top.style.OTransform = "rotate(" + next_frame_btn_top_rotate + "deg)"
        next_frame_btn_top.style.transform = "rotate(" + next_frame_btn_top_rotate + "deg)";
        next_frame_btn.appendChild(next_frame_btn_top);
        var next_frame_btn_bot = document.createElement("div");
        next_frame_btn_bot.style.cssText = "width:60px;height:0px;border:10px solid #FFFFFF;border-radius:2px;box-sizing: content-box;position:relative;top:55px;border-bottom:none;";
        var next_frame_btn_bot_rotate = -60;
        next_frame_btn_bot.style.webkitTransform = "rotate(" + next_frame_btn_bot_rotate + "deg)"
        next_frame_btn_bot.style.MozTransform = "rotate(" + next_frame_btn_bot_rotate + "deg)"
        next_frame_btn_bot.style.msTransform = "rotate(" + next_frame_btn_bot_rotate + "deg)"
        next_frame_btn_bot.style.OTransform = "rotate(" + next_frame_btn_bot_rotate + "deg)"
        next_frame_btn_bot.style.transform = "rotate(" + next_frame_btn_bot_rotate + "deg)";
        next_frame_btn.appendChild(next_frame_btn_bot);
        //下一帧按钮鼠标放置
        next_frame_btn.onmouseover = function (e) {
            next_frame_btn_top.style.borderColor = "#888888";
            next_frame_btn_bot.style.borderColor = "#888888";
        }
        //下一帧按钮鼠标离开
        next_frame_btn.onmouseleave = function (e) {
            next_frame_btn_top.style.borderColor = "#FFFFFF";
            next_frame_btn_bot.style.borderColor = "#FFFFFF";
        }
        //下一帧按钮鼠标按下
        next_frame_btn.onmousedown = function (e) {
            next_frame_btn_top.style.borderColor = "#FFFFFF";
            next_frame_btn_bot.style.borderColor = "#FFFFFF";
        }
        //下一帧按钮鼠标抬起
        next_frame_btn.onmouseup = function (e) {
            next_frame_btn_top.style.borderColor = "#888888";
            next_frame_btn_bot.style.borderColor = "#888888";
        }
        //下一帧按钮鼠标单击
        next_frame_btn.onclick = function (e) {
            if (!select_obj.checked)
                if (Video_Obj.currentTime < Video_Obj.duration)
                    Video_Obj.currentTime += (1 / frame_rate);
            if (video_list != null && select_obj.checked) {
                video_list.forEach(video => {
                    if (video.select_checked()) {
                        video.next_frame();
                    }
                });
            }
        }
        this_div.appendChild(next_frame_btn);
    }
    /**
     * 公共的播放
     */
    this.play = function () {
        var video_play_status = !Video_Obj.paused;
        if (!video_play_status) {
            Video_Obj.play();
            pause_button_Line.style.display = "";
            pause_button_triangle.style.display = "none";
        }
    }
    /**
     * 从某个时间点播放
     * @param {*} time_off_set 时间点
     */
    this.play_time=function(time_off_set){
        var video_play_status = !Video_Obj.paused;
        if (!video_play_status) {
            Video_Obj.currentTime=time_off_set;
            Video_Obj.play();
            pause_button_Line.style.display = "";
            pause_button_triangle.style.display = "none";
        }else{
            Video_Obj.currentTime=time_off_set;
        }
    }
    /**
     * 公共的暂停
     */
    this.pause = function () {
        var video_play_status = !Video_Obj.paused;
        if (video_play_status) {
            Video_Obj.pause();
            pause_button_triangle.style.display = "";
            pause_button_Line.style.display = "none";

        }
    }
    /**
     * 公共的下一帧
     */
    this.next_frame = function () {
        if (Video_Obj.currentTime < Video_Obj.duration)
            Video_Obj.currentTime += (1 / frame_rate);
    }
    /**
     * 公共的上一帧
     */
    this.before_frame = function () {
        if (Video_Obj.currentTime > 0)
            Video_Obj.currentTime -= (1 / frame_rate);
    }
    /**
     * 公共的加速
     */
    this.speed_up = function () {
        if (Video_Obj.playbackRate < 16) {
            Video_Obj.playbackRate *= 2;
            speed_div.innerText = Video_Obj.playbackRate + "倍";
        }
    }
    /**
     * 公共的减速
     */
    this.speed_down = function () {
        if (Video_Obj.playbackRate > 0.075) {
            Video_Obj.playbackRate /= 2;
            speed_div.innerText = Video_Obj.playbackRate + "倍";
        }
    }
    /**
     * 恢复初始播放速度
     */
    this.speed_normal = function () {
        Video_Obj.playbackRate = 1;
        speed_div.innerText = Video_Obj.playbackRate + "倍";
    }
    /**
     * 公共的下载
     */
    this.download = function () {
        pri_download();
    }
    /**
     * 设置当前视频播放的百分比
     * @param {*} percent 百分比（浮点数）
     */
    this.SetVideoCurrentTime = function (percent) {
        Video_Obj.currentTime = Video_Obj.duration * percent;
    }
    /**
     * 公共的截图
     */
    this.Cut_Pic = function () {
        pri_cut_pic();
    }
    /**
     * 获取复选框状态
     */
    this.select_checked = function () {
        // console.log(select_obj.checked);
        return select_obj.checked;
    }
    /**
     * 私有的截图
     */
    var pri_cut_pic = function () {
        canvas.width = Video_Obj.videoWidth;
        canvas.height = Video_Obj.videoHeight;
        canvas.getContext('2d').drawImage(Video_Obj, 0, 0, canvas.width, canvas.height);
        // document.body.appendChild(canvas);
        var base64Data = canvas.toDataURL();
        //封装blob对象
        var blob = base64Data.replace(/^data:image\/(png|jpg);base64,/, "");
        screenshot_callback(blob);
    }
    /**
     * 私有的下载
     */
    var pri_download = function () {
        // 生成一个a元素
        var a = document.createElement('a')
        // 将a的download属性设置为我们想要下载的视频名称
        a.download = video_name || 'video'
        // 将生成的URL设置为a.href属性
        a.href = src;
        // 触发a的单击事件
        a.click();
    }
    //加载播放器
    this.load = function () {
        Video_Obj.src = this.src;
        Video_Obj.width = width;
        Video_Obj.height = height - 44;
        Video_Obj.autoplay = false;
        Video_Obj.controls = false;
        Video_Obj.style.cssText = "width:" + width + "px; height:" + height - 44 + "px; background-color: #EEEEEE;padding:0;border-radius:5px;margin:0;box-sizing: content-box;";
        Controls_div.style.cssText = "width:" + width + "px; height:" + 40 + "px; background-color: #CCDDFF; padding:0;border-radius:5px;margin:0;box-sizing: content-box;";
        this_div.appendChild(Video_Obj);
        this_div.appendChild(Controls_div);
        this_div.style.cssText = "border:2px solid #DDDDDD;border-radius:5px;background-color: #EEEEEE;padding:0;width:" + width + "px; height:" + height + "px;margin:4px;float:left;box-sizing: content-box;"
        father_div.appendChild(this_div);
        control_load();
        Video_control_load();
        //双击将控件放大到与父控件一样大（并隐藏父控件内所有其他视频控件）或缩小
        Video_Obj.ondblclick = function (e) {
            var videos = father_div.children;
            if (size == "min") {
                size = "max";
                width = father_div.clientWidth - 20;
                height = father_div.clientHeight - 20;
                if (videos != null && videos.length > 0)
                    for (var i = 0; i < videos.length; i++) {
                        if (videos[i] != this_div) {
                            videos[i].style.display = "none";
                        }
                        //  console.log(videos[i]);
                    }
            } else if (size == "max") {
                size = "min";
                width = normal_width;
                height = normal_height;
                if (videos != null && videos.length > 0)
                    for (var i = 0; i < videos.length; i++) {
                        if (videos[i] != this_div) {
                            videos[i].style.display = "";
                        }
                        //  console.log(videos[i]);
                    }
            }

            this_div.style.width = width + "px";
            this_div.style.height = height + "px";
            Video_Obj.width = width;
            Video_Obj.height = height - 44;
            Controls_div.style.width = width + "px";
            range_div.style.width = width - 200 + "px";
            control_range.style.width = width - 200 + "px";
        }
    }

}

/**
 * 一个图片对象
 * @param {string} src 链接
 * @param {Int16Array} width 宽度
 * @param {Int16Array} height 高度
 * @param {Element} father_div 父DIV
 */
function Pic(src, width, height, father_div, pic_name = "Pic") {
    this.src = src;//链接
    var width = width;//宽度
    var height = height;//高度
    var father_div = father_div;//父DIV
    var normal_width = width;//初始宽度
    var normal_height = height;//初始高度
    var this_div = document.createElement("div");//包含此图片标签的div
    var Img_Obj = document.createElement("img");//图片标签
    var download_btn = document.createElement("div");
    var size = "min";
    /**
     * 加载此对象
     */
    this.load = function () {
        Img_Obj.width = width - 4;
        Img_Obj.height = height - 4;
        Img_Obj.src = src;
        Img_Obj.style.border = "2px solid #EEEEEE";
        Img_Obj.style.borderRadius = "10px";
        Img_Obj.style.float = "left";
        this_div.style.cssText = "border:2px solid #DDDDDD;border-radius:10px;background-color: #EEEEEE;padding:0;width:" + width + "px; height:" + height + "px;margin:4px;float:left;box-sizing: content-box;"

        this_div.appendChild(Img_Obj);
        father_div.appendChild(this_div);
        download_btn.style.display = "none";
        download_btn.style.width = "60px";
        download_btn.style.height = "60px";
        download_btn.style.float = "right";
        download_btn.style.boxSizing = "content-box";
        download_btn.style.border = "3px solid #DDDDDD";
        download_btn.style.borderRadius = "10px";
        download_btn.style.position = "relative";
        download_btn.style.right = "10px";
        download_btn.style.bottom = "80px";
        //  download_btn.style.backgroundColor="#EEEEEE";
        var download_btn_top = document.createElement("div");
        download_btn_top.style.cssText = "width:30px;height:30px;background-color:#EEEEEE;margin:5px 15px 25px 15px;"
        download_btn.appendChild(download_btn_top);
        var download_btn_bot = document.createElement("div");
        download_btn_bot.style.cssText = "margin:-25px 5px 0px 5px;width: 0;height: 0;border: 25px solid transparent;" +
            "border-top-color: #EEEEEE;border-bottom: none;border-left-color: transparent;border-right-color: transparent;box-sizing: content-box;"

        download_btn.appendChild(download_btn_bot);
        //鼠标经过下载按钮时变色
        download_btn.onmouseover = function (e) {
            download_btn_top.style.backgroundColor = "#888888";
            download_btn_bot.style.borderTopColor = "#888888";
        }
        //鼠标离开下载按钮时变色
        download_btn.onmouseleave = function (e) {
            download_btn_top.style.backgroundColor = "#EEEEEE";
            download_btn_bot.style.borderTopColor = "#EEEEEE";
        }
        //鼠标按下下载按钮时变色
        download_btn.onmousedown = function (e) {
            download_btn_top.style.backgroundColor = "#EEEEEE";
            download_btn_bot.style.borderTopColor = "#EEEEEE";
        }
        //鼠标抬起下载按钮时变色
        download_btn.onmouseup = function (e) {
            download_btn_top.style.backgroundColor = "#888888";
            download_btn_bot.style.borderTopColor = "#888888";
        }
        //鼠标点击下载按钮
        download_btn.onclick = function (e) {
            // 生成一个a元素
            var a = document.createElement('a')
            // 将a的download属性设置为我们想要下载的图片名称
            a.download = pic_name || 'pic'
            // 将生成的URL设置为a.href属性
            a.href = src;
            // 触发a的单击事件
            a.click();
        }
        this_div.appendChild(download_btn);

        //鼠标放置
        this_div.onmouseover = function (e) {
            download_btn.style.display = "";

        }
        //鼠标离开
        this_div.onmouseleave = function (e) {
            download_btn.style.display = "none";
        }
        //双击事件
        Img_Obj.ondblclick = function (e) {
            var pics = father_div.children;
            if (size == "min") {
                size = "max";
                width = father_div.clientWidth - 10;
                height = father_div.clientHeight - 10;
                if (pics != null && pics.length > 0)
                    for (var i = 0; i < pics.length; i++) {
                        if (pics[i] != this_div) {
                            pics[i].style.display = "none";
                        }
                        //  console.log(pics[i]);
                    }
            } else if (size == "max") {
                size = "min";
                width = normal_width;
                height = normal_height;
                if (pics != null && pics.length > 0)
                    for (var i = 0; i < pics.length; i++) {
                        if (pics[i] != this_div) {
                            pics[i].style.display = "";
                        }
                        //  console.log(pics[i]);
                    }
            }

            this_div.style.width = width + "px";
            this_div.style.height = height + "px";
            Img_Obj.width = width - 4;
            Img_Obj.height = height - 4;

        }

    }
}