/**
 * Custom video player
 */
export default class CustomVideoPlayer {
    constructor() {
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
                initialized: "is-initialized",
                playing: "is-playing",
                paused: "is-paused",
                mute: "is-muted",
                fullscreen: "is-full-screen",
            },
        };

        /**
         *
         * @type {NodeListOf<HTMLElement>}
         */
        this.videoPlayer = document.querySelectorAll(this.DOM.videoPlayer);
    }

    /**
     * Init
     */
    init() {
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
    customVideoPlayer() {
        console.log("Custom video player init()");

        for (let i = 0; i < this.videoPlayer.length; i++) {
            if (
                this.videoPlayer[i].classList.contains(
                    this.DOM.states.initialized,
                )
            ) {
                continue;
            }
            let videoContainer = this.videoPlayer[i];
            let videoEl = videoContainer.querySelector(this.DOM.videoEl);
            let videoProgressBarEl = videoContainer.querySelector(
                this.DOM.videoProgressBarEl,
            );
            let videoDurationEl = videoContainer.querySelector(
                this.DOM.videoDurationEl,
            );
            let videoCurrentTimeEl = videoContainer.querySelector(
                this.DOM.videoCurrentTimeEl,
            );
            let timeInput = videoContainer.querySelector(this.DOM.timeInput);
            let volumeInput = videoContainer.querySelector(
                this.DOM.volumeInput,
            );
            let playButton = videoContainer.querySelector(this.DOM.playButton);
            let volumeButton = videoContainer.querySelector(
                this.DOM.volumeButton,
            );
            let fullScreenButton = videoContainer.querySelector(
                this.DOM.fullScreenButton,
            );

            /**
             * Add initialized class
             */
            videoContainer.classList.add(this.DOM.states.initialized);

            /**
             * Await meta data
             */
            this.awaitMeta(
                videoEl,
                timeInput,
                videoProgressBarEl,
                videoDurationEl,
            );

            /**
             * Video timeupdate event
             */
            videoEl.addEventListener("timeupdate", () => {
                this.updateCurrentVideoTime(videoEl, videoCurrentTimeEl);
                this.updateProgress(videoEl, timeInput, videoProgressBarEl);
            });

            /**
             * Click on video event
             */
            videoEl.addEventListener("click", () => {
                this.togglePlay(videoEl, videoContainer);
            });

            /**
             * Change time slider event
             */
            timeInput.addEventListener("input", (event) => {
                this.goToTime(event, videoEl, videoProgressBarEl, timeInput);
            });

            /**
             * Change volume slider event
             */
            volumeInput.addEventListener("input", () => {
                this.updateVolume(videoEl, volumeInput, videoContainer);
            });

            /**
             * Click on play button event
             */
            playButton.addEventListener("click", () => {
                this.togglePlay(videoEl, videoContainer);
            });

            /**
             * Click on volume button event
             */
            volumeButton.addEventListener("click", () => {
                this.toggleMute(videoEl, volumeInput, videoContainer);
            });

            /**
             * Click on full screen button event
             */
            fullScreenButton.addEventListener("click", () => {
                this.toggleFullScreen(videoContainer);
            });
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
    awaitMeta(videoEl, timeInput, videoProgressBarEl, videoDurationEl) {
        if (!isNaN(videoEl.duration)) {
            this.videoSetup(
                videoEl,
                timeInput,
                videoProgressBarEl,
                videoDurationEl,
            );
            console.log("Video meta loaded");
        } else {
            setTimeout(() => {
                this.awaitMeta(
                    videoEl,
                    timeInput,
                    videoProgressBarEl,
                    videoDurationEl,
                );
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
    videoSetup(videoEl, timeInput, videoProgressBarEl, videoDurationEl) {
        timeInput.setAttribute("max", videoEl.duration);
        videoProgressBarEl.setAttribute("max", videoEl.duration);
        let time = this.formatTime(videoEl.duration);
        videoDurationEl.innerText = `${time.minutes}:${time.seconds}`;
    }

    /**
     * Update video volume
     * @param videoEl
     * @param volumeInput
     * @param videoContainer
     */
    updateVolume(videoEl, volumeInput, videoContainer) {
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
    updateCurrentVideoTime(videoEl, videoCurrentTimeEl) {
        let time = this.formatTime(videoEl.currentTime);
        videoCurrentTimeEl.innerText = `${time.minutes}:${time.seconds}`;
    }

    /**
     * Update video progress
     * @param videoEl
     * @param timeInput
     * @param videoProgressBarEl
     */
    updateProgress(videoEl, timeInput, videoProgressBarEl) {
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
    goToTime(event, videoEl, videoProgressBarEl, timeInput) {
        let time = event.target.dataset.time
            ? event.target.dataset.time
            : event.target.value;
        videoEl.currentTime = time;
        videoProgressBarEl.value = time;
        timeInput.value = time;
    }

    /**
     * Toggle play or pause states
     * @param videoEl
     * @param videoContainer
     */
    togglePlay(videoEl, videoContainer) {
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
    toggleFullScreen(videoContainer) {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch((err) => {
                alert(
                    `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
                );
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
    toggleMute(videoEl, volumeInput, videoContainer) {
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
    formatTime(time) {
        let formattedTime = new Date(time * 1000).toISOString().substr(11, 8);
        return {
            minutes: formattedTime.substr(3, 2),
            seconds: formattedTime.substr(6, 2),
        };
    }
}
