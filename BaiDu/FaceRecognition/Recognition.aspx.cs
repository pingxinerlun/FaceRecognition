using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Configuration;

namespace FaceRecognition
{
    public partial class Recognition : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // 设置APPID/AK/SK
            var APP_ID = ConfigurationManager.AppSettings["APP_ID"];
            var API_KEY = ConfigurationManager.AppSettings["API_KEY"];
            var SECRET_KEY = ConfigurationManager.AppSettings["SECRET_KEY"];

            var client = new Baidu.Aip.Face.Face(API_KEY, SECRET_KEY);
            string imgsrc = " D:/Project/Git/C#/AI/FaceRecognition/FaceRecognitionTest/FaceRecognition/BaiDu/FaceRecognition/img/ldh.jpg";
            var image = File.ReadAllBytes(imgsrc);
            // 调用人脸检测，可能会抛出网络等异常，请使用try/catch捕获
            var result = client.FaceDetect(image);
            //{ "result_num": 1, "result": [ { "location": { "left": 112, "top": 202, "width": 280, "height": 256 }, "face_probability": 1, "rotation_angle": 4, "yaw": -10.597146034241, "pitch": 4.6834144592285, "roll": 4.6553287506104 } ], "log_id": 3473511017011916 }{ "result_num": 1, "result": [ { "location": { "left": 112, "top": 202, "width": 280, "height": 256 }, "face_probability": 1, "rotation_angle": 4, "yaw": -10.597146034241, "pitch": 4.6834144592285, "roll": 4.6553287506104, "age": 26 } ], "log_id": 3474425141011916 }
            Response.Write(result);
            // 如果有可选参数
            var options = new Dictionary<string, object>{
	                    {"max_face_num", 2},
	                    {"face_fields", "age"}
	                };
            // 带参数调用人脸检测
            result = client.FaceDetect(image, options);
            Response.Write(result);
        }
    }
}