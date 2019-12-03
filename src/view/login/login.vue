<template>
	<div class="login-container">
    <div class="login">
        <div class="login-wrap" v-show="showLogin">
          <h3>{{loginTitle}}</h3>
          <div class="login_fields_user">
              <div class='icon'>
                <img alt="" src='./../../assets/img/user_icon_copy.png'>
              </div>
              <i class="deleteIcon" v-on:click="deleteUsername" v-show="showUserIcon">x</i>
              <input type="text" placeholder="请输入用户名" v-model="username" @keydown="deleteUserShow"/>
          </div>
          <div class='login_fields_password' v-show="passwordLogin">
              <div class='icon'>
                <img alt="" src='./../../assets/img/lock_icon_copy.png'>
              </div>
              <i class="deleteIcon" v-show="showPassIcon" v-on:click="deletePassword">x</i>
              <input type="password" placeholder="请输入密码" v-model="password" @keydown="deletePassShow"/>
          </div>
          <div class='login_fields_password' v-show="!passwordLogin">
            <label>进行活体检测：</label><input type="checkbox" v-model="aliveCheck" class="alive-check-box" @click="changeActiveCheck">
          </div>
          <input style="margin-left: 30px;" type="text" value="" v-show="showTishi" id="errorMsg" class="errorMsg"/>
          <button class="passwordLogin" v-on:click="changeLogin(0)">密码</button>
          <button class="faceLogin"  v-on:click="changeLogin(1)">人脸识别</button>
          <button v-on:click="login">登录</button>
          <span v-on:click="ToRegister">没有账号？马上注册</span>

          <div class="face" v-show="!passwordLogin">
            <label class="active-title"  v-show="checkFlagShow">{{checkFlag}}</label>
            <video style="position: relative;top: 5px;" ref="loginVideo" width="300" height="300"></video>
            <canvas ref="loginCanvas" width="300" height="300"></canvas>
            <!--<img ref="previewImg" src="">-->
          </div>

        </div>

        <div class="register-wrap" v-show="showRegister">
          <div style="position: absolute;height: 330px;">
            <h3>注册账户</h3>
            <div class="login_fields_user">
                <div class='icon'>
                  <img alt="" src='./../../assets/img/user_icon_copy.png'>
                </div>
               <i class="deleteIcon" v-on:click="deleteRename" v-show="showReUserIcon">x</i>
               <input type="text" placeholder="请输入用户名" v-model="newUsername" @keydown="deleteReUserShow"/>
            </div>
            <div class='login_fields_password'>
                <div class='icon'>
                  <img alt="" src='./../../assets/img/lock_icon_copy.png'>
                </div>
                <i class="deleteIcon" v-on:click="deleteRePass" v-show="showRePassIcon">x</i>
                <input type="password" placeholder="请输入密码" v-model="newPassword" @keydown="deleteRePassShow"/>
            </div>
            <input type="text" value="" v-show="showTishi" id="errorMsg1" class="errorMsg"/>
            <button v-on:click="register">注册</button>
            <span v-on:click="ToLogin">已有账号？马上登录</span>
          </div>
          <div class="face-wrapper">
            <video ref="video" width="300" height="300"></video>
            <canvas ref="canvas" width="300" height="300"></canvas>
            <img ref="previewImg" src="">
          </div>
        </div>

        <div class="register-success" v-show="showSuccess">
          <h3>{{successInfo}}</h3>
          <p id="num">{{count}}</p>
          <p style="margin-left: 5px;color:#fff;">秒后转至登录页面</p>
        </div>
    </div>
    <vue-particles color="#fff" :particleOpacity="0.7" :particlesNumber="100" shapeType="circle" :particleSize="4"
                   linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4"
                   :linesDistance="150" :moveSpeed="2" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi"
    >
    </vue-particles>
	</div>
</template>
<script>
  import { setCookie,getCookie } from '../../assets/js/cookie.js'
  const CODE_SUCCESS = 0;
  const CODE_ERROR = 1;
  // 活体检测类型
  const [CHECK_TYPE_MOUTH, CHECK_TYPE_EYE] = ['mouth', 'eye'];
  var mediaStreamTrack;
  var mediaStreamTrackLogin;
  // 活体检测结果 1：通过 0：需要继续检测 -1：失败，摄像头前的对象没有活动
  const [CHECK_SUCCESS, CHECK_NORMAL, CHECK_FAILED] = [1, 0, -1];
	export default{
		data(){
			return{
				username: '',
				password: '',
				newUsername: '',
				newPassword: '',
        successInfo: '',
				tishi: '',
        count:"",//倒计时
				showTishi: false,
				showLogin: true,
				showRegister: false,
        showSuccess: false,
        showPassIcon: false,
        showReUserIcon: false,
        showRePassIcon: false,
        showUserIcon:false,
        passwordLogin: true, // 密码登陆方式
        loginTitle:"",
        aliveCheck: false,   // 登陆时是否进行活体检测，默认 false
        checkFlagShow: true,
        checkFlag:"请按照要求进行活体检测"
			}
		},
		mounted(){
			if(getCookie('username')){
				this.$router.push('/home');
			}
			if(this.username != null){
        this.showUserIcon = true;
      }else{
        this.showUserIcon = false;
      }
      if(this.password != null){
        this.showPassIcon = true;
      }else{
        this.showPassIcon = false;
      }
      if(this.newUsername != null){
        this.showReUserIcon = true;
      }else{
        this.showReUserIcon = false;
      }
      if(this.newPassword != null){
        this.showRePassIcon = true;
      }else{
        this.showRePassIcon = false;
      }
      this.loginTitle = "密码登录";
		},
		methods: {
      changeLogin(type){
        if(type == "0"){
          this.loginTitle = "密码登录";
          this.passwordLogin = true;
          document.getElementsByClassName('passwordLogin')[0].style.backgroundColor = "#4492e6";
          document.getElementsByClassName('faceLogin')[0].style.backgroundColor = "#2dcac3";
          this.showTishi = false;
          mediaStreamTrackLogin.getTracks()[0].stop(); //关闭摄像头
        }else{
          this.loginTitle = "人脸识别登录";
          this.passwordLogin = false;
          document.getElementsByClassName('passwordLogin')[0].style.backgroundColor = "#2dcac3";
          document.getElementsByClassName('faceLogin')[0].style.backgroundColor = "#4492e6";
          this._intiLoginMedia();
          this.showTishi = false;
          this.checkFlag="请端正姿势进行人脸识别";
        }
      },
      changeActiveCheck(){
        if(!this.aliveCheck){
          this.checkFlag="请按照要求进行活体检测";
        }else{
          this.checkFlag="请端正姿势进行人脸识别";
        }
      },
      _intiMedia() {
        let constraints = {
          audio: false,
          video: {width: 300, height: 300}
        };

        let _this = this;
        navigator.mediaDevices.getUserMedia(constraints)
          .then((mediaStream) => {
            _this.video = this.$refs.video;
            _this.video.srcObject = mediaStream;
            mediaStreamTrack = mediaStream;
            _this.video.onloadedmetadata = function (e) {
              _this.video.play();
            }
          })
          .catch((err) => {
            console.log(err.name + ":" + err.message)
          })
      },
      // canvas 截取图片
      _captureImg() {
        // 取到 canvas
        this.canvas = this.$refs.canvas;
        // 获取 canvas 上下文
        let ctx = this.canvas.getContext('2d')
        // 截图
        ctx.drawImage(this.video,0, 0, 300, 300)
        // 将截图转换成 base64
        this.image = this.canvas.toDataURL('image/png')
        // 只保留 base64 部分
        let base64Str = this.image.split('base64,')[1]

        // console.log(base64Str)

        return base64Str
      },
      _intiLoginMedia() {
        let constraints = {
          audio: false,
          video: {width: 300, height: 300}
        };

        let _this = this;
        navigator.mediaDevices.getUserMedia(constraints)
          .then((mediaStream) => {
            _this.video = this.$refs.loginVideo;
            _this.video.srcObject = mediaStream;
            mediaStreamTrackLogin = mediaStream;
            _this.video.onloadedmetadata = function (e) {
              _this.video.play();
            }
          })
          .catch((err) => {
            console.log(err.name + ":" + err.message)
          })
      },
      // 处理活体检测
      _handleAliveCheck(user) {
        // 延时一下执行
        setTimeout(() => {
          this._postAliveCheck(CHECK_TYPE_MOUTH, user.id)
        }, 2000)
      },
      // 活体检测请求，这里会递归调用，其实也可以用定时，这里
      // 用递归主要是希望每一次检测请求都在检测完成之后才继续调下一次
      _postAliveCheck(checkType, userId) {
        console.log(checkType)
        if(checkType===CHECK_TYPE_MOUTH ){
          this.checkFlagShow = true;
          this.checkFlag = "请张张嘴";
        }else{
          this.checkFlagShow = true;
          this.checkFlag = "请眨眨眼";
        }
        let imgBase64 = this._captureImg();
        let data = {
          imgbase64: imgBase64,
          checkType: checkType,
          username: userId
        };
        this.$http.post('http://localhost:9898/users/aliveCheck',JSON.stringify(data)).then((resp)=>{
          console.log(resp);
          if(resp.data.code == CODE_SUCCESS){
            if (resp.data.data === CHECK_SUCCESS) {
              //this.checkFlag = "张嘴检测成功";
              if (checkType === CHECK_TYPE_EYE) {
                // 如果眨眨眼也检测完成之后，这样流程就走完了
                this.checkFlag = "活体检测成功";
                //this.tishi = "登录成功";
                sessionStorage.setItem("username", this.username);
                /*setCookie('username',this.username,1000*60);*/
                setTimeout(function(){
                  this.$router.push({path:'home',query:{id:1}});
                }.bind(this),1000)
              }else{
                // 如果张张嘴检测完之后，接着检测眨眨眼
                this._postAliveCheck(CHECK_TYPE_EYE, userId);
              }
            }else if (resp.data.data === CHECK_NORMAL) {
              console.log('继续检测...')
              this._postAliveCheck(checkType, userId);
            }
          }else if (resp.data.code === CODE_ERROR && resp.data.data === CHECK_FAILED) {
            this.checkFlag = "检测失败，检测对象没有活动";
          } else {
            // 脸部识别不到提示的信息，继续检测
            this.checkFlag = resp.data.message;
            this._postAliveCheck(checkType, userId);
          }
        })
      },
			login(){
        this.showTishi = false;
			  var errorMsg = document.getElementById("errorMsg");
			  var flag = "true";
			  if(this.passwordLogin) {
          if (this.username == "" && this.password == "") {
            errorMsg.value = "请输入用户名和密码";
            this.showTishi = true;
            flag = "false";
          } else if (this.username == "") {
            errorMsg.value = "请输入用户名";
            this.showTishi = true;
            flag = "false";
          } else if (this.password == "") {
            errorMsg.value = "请输入密码";
            this.showTishi = true;
            flag = "false";
          }
        }else{
          if (this.username == ""){
            errorMsg.value = "请输入用户名";
            this.showTishi = true;
            flag = "false";
          }
        }
				if(flag == "false"){
          return;
        }else{
          let base64Str = '';
          // 判断登陆方式
          if (!this.passwordLogin) {
            // 刷脸登陆
            base64Str = this._captureImg()
          }
					let user = {
            'username':this.username,
            'password':this.password,
            'imgbase64':base64Str,
            'passwordLogin':this.passwordLogin};
					console.log(user);
					this.$http.post('http://localhost:9898/users/login',JSON.stringify(user)).then((res)=>{
						if(res.data.code == "8888"){
              errorMsg.value = res.data.desc;
							this.showTishi = true;
						}else{
              if (this.aliveCheck) {
                this._handleAliveCheck(res.data.data);
              }else{
                this.tishi = "登录成功";
                sessionStorage.setItem("username", this.username);
                /*setCookie('username',this.username,1000*60);*/
                setTimeout(function(){
                  this.$router.push({path:'home',query:{id:1}});
                }.bind(this),1000)
              }
						}
					})
				}
			},
      //几秒跳转
      goGrdoupRecor(){
        const TIME_COUNT = 5;
        if(!this.timer){
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(()=>{
            if(this.count > 0 && this.count <= TIME_COUNT){
              this.count--;
            }else{
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              this.showLogin = true;
              this.showSuccess = false;
              //跳转的页面写在此处
            }
          },1000)
        }
      },
      deleteUserShow(){
			    if(this.value != ""){
              this.showUserIcon = true;
          }else{
             this.showUserIcon = false;
          }
      },
      deleteRePassShow(){
        if(this.value != ""){
          this.showRePassIcon = true;
        }else{
          this.showRePassIcon = false;
        }
      },
      deleteReUserShow(){
        if(this.value != ""){
          this.showReUserIcon = true;
        }else{
          this.showReUserIcon = false;
        }
      },
      deletePassShow(){
        if(this.value != ""){
          this.showPassIcon = true
        }else{
          this.showPassIcon = false
        }
      },
			ToRegister(){
				this.showRegister = true;
				this.showLogin = false;
				this.showTishi = false;
				this._intiMedia();
			},
			ToLogin(){
				this.showRegister = false;
				this.showLogin = true;
        this.showTishi = false;
        mediaStreamTrack.getTracks()[0].stop(); //关闭摄像头
			},
      deleteUsername(){
        this.username = "";
        this.showUserIcon = false;
      },
      deleteRename(){
        this.newUsername = "";
        this.showReUserIcon = false;
      },
      deleteRePass(){
        this.newPassword = "";
        this.showRePassIcon = false;
      },
      deletePassword(){
        this.password = "";
        this.showPassIcon = false;
      },
			register(){
        var errorMsg = document.getElementById("errorMsg1");
				if(this.newUsername == "" && this.newPassword == ""){
          errorMsg.value = "请输入用户名和密码";
          this.showTishi = true;
				}else if(this.newUsername == ""){
          errorMsg.value = "请输入用户名";
          this.showTishi = true;
        }else if(this.newPassword == ""){
          errorMsg.value = "请输入密码";
          this.showTishi = true;
        }else{
          this.canvas = this.$refs.canvas;
          let ctx = this.canvas.getContext('2d');
          ctx.drawImage(this.video,0, 0, 300, 300);
          this.image = this.canvas.toDataURL('image/png');
          this.$refs.previewImg.src = this.image;
          let base64Str = this.image.split('base64,')[1];
          console.log(base64Str);
					let user = {
					  'username':this.newUsername,
            'password':this.newPassword,
            'imgbase64': base64Str};
					console.log(user);
					this.$http.post('http://localhost:9898/users/registerUser',JSON.stringify(user)).then((res)=>{
						//console.log(res)
						if(res.data.code == "0000"){
							this.successInfo = "注册成功";
							//this.showTishi = true
							 this.username = this.newUsername;
							 this.password = this.newPassword;
              this.showRegister = false;
              this.showTishi = false;
              this.showSuccess = true;
              //this.count = "6";
              this.goGrdoupRecor();
						}else if(res.data.code == "1111"){
              errorMsg.value = "用户名已经存在";
              this.showTishi = true;
              return;
            }else if(res.data.code == "8888"){
              errorMsg.value = res.data.desc;
              this.showTishi = true;
              return;
            }
					})
				}
			}
		}
	}

</script>
