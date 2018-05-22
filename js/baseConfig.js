//dicom图像、用户习惯、流媒体
var clinic = "http://report.lanwon.com:9698";
//var clinic = "http://192.168.171.207:8080";
//var clinic = "http://172.16.0.237:8085";//超算
//var clinic="http://122.13.2.27:8004/"//联通云环境
//var clinic = "http://192.168.121.143:8080";//大表哥

var wadoOrFapForDicom = "/wadoOrFap/dicom";//dicom
var videoOfMedia="/wadoOrFap/video/";//获取流媒体数组
var mediaOfMedia = "/wadoOrFap/media/";//获取流媒体时长
var mediaOfM3u8 = "/wadoOrFap/mediaMU/";//获取ts文件
var mediaOfDownLoad="/wadoOrFap/downloadMU/";//下载视频影像
var downLoadSeries="/wadoOrFap/downloadSeries/"; //获取序列影像AVI
var getUserHabits="/userHabits/getUserHabitsByUserId";//获取用户习惯
var saveUserHabiys = "/dicomImage/saveUsingToolLog"//保存用户习惯
