<template>
	<div>
    <div  class="home">
      <h3 class="system-name">AI智能人脸识别平台</h3>
      <a class="quit" href="javascript:void(0);" @click="quit">退出</a>
      <div class="separate">|</div>
      <h3 class="welcome">欢迎 {{name}}</h3>
    </div>
    <div style="width: 100%;height: 91.1%">
      <!--<img class="main-box" src="./../../assets/img/login4.jpg"/>-->
      <div style="background-color: rgb(17, 200, 78);width:600px;margin-left: 500px;">
        <video-player  class="vjs-custom-skin"
                       ref="videoPlayer"
                       :playsinline="true"
                       :options="playerOptions1"
        >
        </video-player>
      </div>
    </div>
	</div>
</template>

<script>
import { setCookie,getCookie,delCookie } from '../../assets/js/cookie.js';
import {videoPlayer} from 'vue-video-player'
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';
import 'videojs-flash'
export default{
    components: {
      videoPlayer
    },
    data(){
      const that = this;
			return {
        name: '',
        playerOptions1: {
          height: '360',
          flash: {
            swf: './../../../static/media/video-js.swf'
          },
          sources: [
            { // 流配置，数组形式，会根据兼容顺序自动切换
              type: 'rtmp/mp4',
              //src:"rtmp://58.200.131.2:1935/livetv/hunantv",
              //src: 'rtmp://184.72.239.149/vod/&mp4:BigBuckBunny_115k.mov'
              //src:"rtmp://www.kindergartenwutai.cn/live/34020000001320000002?auth_key=1559882164-0-0-17327daf6b8a32b09cb084aa72df0c1c"
              src:"rtmp://mobliestream.c3tv.com:554/live/goodtv.sdp",
              //src:"rtmp://live.hkstv.hk.lxdns.com/live/hks"
              withCredentials: false
            }],
          techOrder: ['flash'],
          autoplay: true,
          controls: false
        }
      }
		},
  mounted(){
			let uname = sessionStorage.getItem('username')
			this.name = uname
			if(uname == ""){
				this.$router.push('/')
			}
  },
		methods:{
			quit(){
				sessionStorage.setItem('username','');
				this.$router.push('/')
			}
		}
	}
</script>
