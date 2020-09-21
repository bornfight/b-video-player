(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Custom video player
 */
var CustomVideoPlayer = /*#__PURE__*/function () {
  function CustomVideoPlayer(container) {
    _classCallCheck(this, CustomVideoPlayer);

    /**
     * Custom video player DOM selectors
     * @type {{volumeInput: string, videoDurationEl: string, volumeButton: string, timeInput: string, fullScreenButton: string, playButton: string, videoEl: string, videoPlayer: string, videoProgressBarEl: string, videoCurrentTimeEl: string, states: {paused: string, fullscreen: string, playing: string, mute: string}}}
     */
    this.DOM = {
      videoPlayer: ".js-custom-video-player",
      videoEl: ".js-custom-video-player-media",
      videoProgressBarEl: ".js-custom-video-player-progress-bar",
      videoDurationEl: ".js-custom-video-player-video-duration",
      videoCurrentTimeEl: ".js-custom-video-player-current-time",
      timeInput: ".js-custom-video-player-time-input",
      volumeInput: ".js-custom-video-player-volume-input",
      volumeButton: ".js-custom-video-player-volume-button",
      playButton: ".js-custom-video-player-play",
      fullScreenButton: ".js-custom-video-player-full-screen",
      states: {
        playing: "is-playing",
        paused: "is-paused",
        mute: "is-muted",
        fullscreen: "is-full-screen"
      }
    };
    /**
     * Custom wrapper, if not provided everything will be related to document
     * Custom wrapper can be passed to class or to every instance od init() method
     * @type {Element|Document}
     */

    this.container = container || document;
  }
  /**
   *
   * @param {Element} container
   */


  _createClass(CustomVideoPlayer, [{
    key: "init",
    value: function init() {
      var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.container;

      /**
       *
       * @type {NodeListOf<HTMLElement>}
       */
      this.videoPlayer = container.querySelectorAll(this.DOM.videoPlayer);

      if (this.videoPlayer.length < 1) {
        return;
      }

      this.customVideoPlayer();
    }
    /**
     * Main player method
     * Get all elements from each player in DOM
     * Init events for elements from each player
     */

  }, {
    key: "customVideoPlayer",
    value: function customVideoPlayer() {
      var _this = this;

      console.log("Custom video player init()");

      var _loop = function _loop(i) {
        var videoContainer = _this.videoPlayer[i];
        var videoEl = videoContainer.querySelector(_this.DOM.videoEl);
        var videoProgressBarEl = videoContainer.querySelector(_this.DOM.videoProgressBarEl);
        var videoDurationEl = videoContainer.querySelector(_this.DOM.videoDurationEl);
        var videoCurrentTimeEl = videoContainer.querySelector(_this.DOM.videoCurrentTimeEl);
        var timeInput = videoContainer.querySelector(_this.DOM.timeInput);
        var volumeInput = videoContainer.querySelector(_this.DOM.volumeInput);
        var playButton = videoContainer.querySelector(_this.DOM.playButton);
        var volumeButton = videoContainer.querySelector(_this.DOM.volumeButton);
        var fullScreenButton = videoContainer.querySelector(_this.DOM.fullScreenButton);
        /**
         * Await meta data
         */

        _this.awaitMeta(videoEl, timeInput, videoProgressBarEl, videoDurationEl);
        /**
         * Video timeupdate event
         */


        videoEl.addEventListener("timeupdate", function () {
          _this.updateCurrentVideoTime(videoEl, videoCurrentTimeEl);

          _this.updateProgress(videoEl, timeInput, videoProgressBarEl);
        });
        /**
         * Click on video event
         */

        videoEl.addEventListener("click", function () {
          _this.togglePlay(videoEl, videoContainer);
        });
        /**
         * Change time slider event
         */

        timeInput.addEventListener("input", function (event) {
          _this.goToTime(event, videoEl, videoProgressBarEl, timeInput);
        });
        /**
         * Change volume slider event
         */

        volumeInput.addEventListener("input", function () {
          _this.updateVolume(videoEl, volumeInput, videoContainer);
        });
        /**
         * Click on play button event
         */

        playButton.addEventListener("click", function () {
          _this.togglePlay(videoEl, videoContainer);
        });
        /**
         * Click on volume button event
         */

        volumeButton.addEventListener("click", function () {
          _this.toggleMute(videoEl, volumeInput, videoContainer);
        });
        /**
         * Click on full screen button event
         */

        fullScreenButton.addEventListener("click", function () {
          _this.toggleFullScreen(videoContainer);
        });
      };

      for (var i = 0; i < this.videoPlayer.length; i++) {
        _loop(i);
      }
    }
    /**
     * Recursive function that checks if video metadata is loaded
     * If video duration is NaN that indicates that video meta is not loaded
     * @param videoEl
     * @param timeInput
     * @param videoProgressBarEl
     * @param videoDurationEl
     */

  }, {
    key: "awaitMeta",
    value: function awaitMeta(videoEl, timeInput, videoProgressBarEl, videoDurationEl) {
      var _this2 = this;

      if (!isNaN(videoEl.duration)) {
        this.videoSetup(videoEl, timeInput, videoProgressBarEl, videoDurationEl);
        console.log("Video meta loaded");
      } else {
        setTimeout(function () {
          _this2.awaitMeta(videoEl, timeInput, videoProgressBarEl, videoDurationEl);
        }, 10);
      }
    }
    /**
     * Setup video from preloaded metadata
     * @param videoEl
     * @param timeInput
     * @param videoProgressBarEl
     * @param videoDurationEl
     */

  }, {
    key: "videoSetup",
    value: function videoSetup(videoEl, timeInput, videoProgressBarEl, videoDurationEl) {
      timeInput.setAttribute("max", videoEl.duration);
      videoProgressBarEl.setAttribute("max", videoEl.duration);
      var time = this.formatTime(videoEl.duration);
      videoDurationEl.innerText = "".concat(time.minutes, ":").concat(time.seconds);
    }
    /**
     * Update video volume
     * @param videoEl
     * @param volumeInput
     * @param videoContainer
     */

  }, {
    key: "updateVolume",
    value: function updateVolume(videoEl, volumeInput, videoContainer) {
      videoEl.volume = volumeInput.value;

      if (videoEl.muted || videoEl.volume === 0) {
        videoContainer.classList.add(this.DOM.states.mute);
      } else {
        videoContainer.classList.remove(this.DOM.states.mute);
      }
    }
    /**
     * Update current video time
     * @param videoEl
     * @param videoCurrentTimeEl
     */

  }, {
    key: "updateCurrentVideoTime",
    value: function updateCurrentVideoTime(videoEl, videoCurrentTimeEl) {
      var time = this.formatTime(videoEl.currentTime);
      videoCurrentTimeEl.innerText = "".concat(time.minutes, ":").concat(time.seconds);
    }
    /**
     * Update video progress
     * @param videoEl
     * @param timeInput
     * @param videoProgressBarEl
     */

  }, {
    key: "updateProgress",
    value: function updateProgress(videoEl, timeInput, videoProgressBarEl) {
      timeInput.value = videoEl.currentTime;
      videoProgressBarEl.value = videoEl.currentTime;
      timeInput.setAttribute("data-bla", timeInput.value);
    }
    /**
     * Go to time when user uses range slider
     * @param event
     * @param videoEl
     * @param videoProgressBarEl
     * @param timeInput
     */

  }, {
    key: "goToTime",
    value: function goToTime(event, videoEl, videoProgressBarEl, timeInput) {
      var time = event.target.dataset.time ? event.target.dataset.time : event.target.value;
      videoEl.currentTime = time;
      videoProgressBarEl.value = time;
      timeInput.value = time;
    }
    /**
     * Toggle play or pause states
     * @param videoEl
     * @param videoContainer
     */

  }, {
    key: "togglePlay",
    value: function togglePlay(videoEl, videoContainer) {
      if (videoEl.paused || videoEl.ended) {
        videoEl.play();
        videoContainer.classList.remove(this.DOM.states.paused);
        videoContainer.classList.add(this.DOM.states.playing);
      } else {
        videoEl.pause();
        videoContainer.classList.remove(this.DOM.states.playing);
        videoContainer.classList.add(this.DOM.states.paused);
      }
    }
    /**
     * Toggle fullscreen mode
     * Requested on wrapper so default browser player is not showed
     * @param videoContainer
     */

  }, {
    key: "toggleFullScreen",
    value: function toggleFullScreen(videoContainer) {
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(function (err) {
          alert("Error attempting to enable full-screen mode: ".concat(err.message, " (").concat(err.name, ")"));
        });
        videoContainer.classList.add(this.DOM.states.fullscreen);
      } else {
        document.exitFullscreen();
        videoContainer.classList.remove(this.DOM.states.fullscreen);
      }
    }
    /**
     * Toggle video mute
     * @param videoEl
     * @param volumeInput
     * @param videoContainer
     */

  }, {
    key: "toggleMute",
    value: function toggleMute(videoEl, volumeInput, videoContainer) {
      if (volumeInput.value > 0) {
        volumeInput.setAttribute("data-previous-volume", volumeInput.value);
        volumeInput.value = 0;
        this.updateVolume(videoEl, volumeInput, videoContainer);
      } else {
        volumeInput.value = volumeInput.dataset.previousVolume;
        this.updateVolume(videoEl, volumeInput, videoContainer);
      }
    }
    /**
     * Get time in minutes and seconds
     * @param time
     * @returns {{seconds: string, minutes: string}}
     */

  }, {
    key: "formatTime",
    value: function formatTime(time) {
      var formattedTime = new Date(time * 1000).toISOString().substr(11, 8);
      return {
        minutes: formattedTime.substr(3, 2),
        seconds: formattedTime.substr(6, 2)
      };
    }
  }]);

  return CustomVideoPlayer;
}();

exports.default = CustomVideoPlayer;

},{}],2:[function(require,module,exports){
"use strict";

var _CustomVideoPlayer = _interopRequireDefault(require("./components/CustomVideoPlayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ready = function ready(callbackFunc) {
  if (document.readyState !== "loading") {
    /**
     * Document is already ready, call the callback directly
     */
    callbackFunc();
  } else if (document.addEventListener) {
    /**
     * All modern browsers to register DOMContentLoaded
     */
    document.addEventListener("DOMContentLoaded", callbackFunc);
  } else {
    /**
     * Old IE browsers
     */
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState === "complete") {
        callbackFunc();
      }
    });
  }
};
/**
 * Document ready callback
 */


ready(function () {
  var credits = ["background-color: #000000", "color: white", "display: block", "line-height: 24px", "text-align: center", "border: 1px solid #ffffff", "font-weight: bold"].join(";");
  console.info("dev by: %c Bornfight ", credits);
  /**
   * mainVideoWrapper provides opportunity to pass different container|wrapper on every page transition
   * @type {Element} mainVideoWrapper
   */

  var mainVideoWrapper = document.querySelector(".js-main-video-wrapper");
  var video = new _CustomVideoPlayer.default();
  video.init(mainVideoWrapper);
});

},{"./components/CustomVideoPlayer":1}]},{},[2])

//# sourceMappingURL=bundle.js.map
