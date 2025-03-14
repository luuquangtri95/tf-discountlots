!window.customElements.get("video-component") &&
	window.customElements.define(
		"video-component",
		class extends HTMLElement {
			connectedCallback() {
				// super();

				setTimeout(() => {
					this.init();
					this.addEventListener("touchstart", (e) => e.stopPropagation(), {
						passive: true,
					});
					this.addEventListener("touchmove", (e) => e.stopPropagation());
					this.addEventListener("touchend", (e) => e.stopPropagation());
					this.addEventListener("mousedown", (e) => e.stopPropagation());
				}, 0);
			}

			togglePlay() {
				const { inViewPort } = theme;

				this.hasAttribute("play-in-view") &&
					inViewPort(this, (e) => {
						e ? this.playVideo() : this.stopVideo();
					});
			}

			init() {
				const { type } = this.dataset;

				switch (type) {
					case "youtube":
						this.loadYoutube();
						break;

					case "vimeo":
						this.loadVimeo();
						break;

					case "video":
						this.loadNative();
						break;
				}
			}

			playVideo() {
				if (this.isPlaying) return;

				this.isPlaying = true;
				this.classList.add("playing");
				this.videoPlay();
			}

			stopVideo(arg) {
				if (!this.isPlaying) return;

				this.classList.remove("playing");
				this.videoStop(arg);
				this.isPlaying = false;
			}

			loadYoutube() {
				if (document.querySelector(`script[src*=youtube][src*=iframe_api]`)) {
					this.loadYoutubeVideo();
					// window.dispatchEvent(new Event('youtube:ready'));
					return;
				}

				let tag = document.createElement("script");
				tag.src = "https://www.youtube.com/iframe_api";
				let firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}

			loadYoutubeVideo() {
				if (typeof YT == "undefined") return;

				const container = this;
				const video = container.querySelector("iframe");

				const defaultConfig = `{ "autoplay": 0, "playsinline": 1, "controls": 0, "showinfo": 0, "rel": 0, "loop": 1 }`;
				const playerVars = JSON.parse(video.dataset.config || defaultConfig);
				video.media = new YT.Player(video.id, {
					videoId: video.dataset.ytId,
					playerVars,
					events: {
						onReady: onPlayerReady.bind(container),
						onStateChange: onPlayerStateChange.bind(container),
					},
				});

				container.videoPlay = () => {
					video.media?.playVideo && video.media?.playVideo();
				};

				container.videoStop = (restart = null) => {
					video.media?.pauseVideo();
					restart && video.media.seekTo(0);
				};

				function onPlayerReady(event) {
					let video = event.target;
					const iframe = video.getIframe();

					if (!container.hasAttribute("play-in-view")) return;

					video.mute();
					video.playVideo();
				}

				function onPlayerStateChange(event) {
					const video = event.target;

					switch (event.data) {
						case YT.PlayerState.PLAYING:
							this.playVideo();
							break;

						case YT.PlayerState.PAUSED:
							this.stopVideo();
							break;

						case YT.PlayerState.ENDED:
							this.stopVideo(true);
							break;

						default:
							break;
					}
				}

				this.togglePlay();
			}

			loadVimeo() {
				if (document.querySelector(`script[src*=vimeo][src*=player]`)) {
					this.loadVimeoVideo();
					return;
				}
				let tag = document.createElement("script");
				tag.src = "https://player.vimeo.com/api/player.js";
				tag.id = "VMScript";
				tag.onload = this.loadVimeoVideo.bind(this);
				let firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}

			loadVimeoVideo() {
				if (typeof Vimeo == "undefined") return;

				const container = this;
				const video = this.querySelector("iframe");
				video.media = new Vimeo.Player(video);

				container.hasAttribute("play-in-view") &&
					(video.media.setVolume(0), video.media.play());

				this.videoPlay = () => {
					video.media.play();
				};

				this.videoStop = () => {
					video.media.pause();
				};

				video.media.on("play", () => {});

				video.media.on("ended", () => {
					video.media.play();
				});

				this.togglePlay();
			}

			loadNative() {
				const video = this.querySelector("video");

				this.videoPlay = () => {
					video?.play();
				};

				this.videoStop = () => {
					video?.pause();
				};
				this.togglePlay();
			}
		}
	);

window["onYouTubeIframeAPIReady"] = () => {
	const selectors = `video-component[data-type="youtube"]`;
	document.querySelectorAll(selectors)?.forEach((video) => video.loadYoutubeVideo());
};

window.customElements.define(
	"hidden-thumbnail",
	class extends HTMLElement {
		connectedCallback() {
			this.init();
		}

		init() {
			this.querySelector("button").addEventListener("click", () => {
				this.style.display = "none";
				this.closest(".wrapper-component-video")
					?.querySelector("video-component")
					?.playVideo?.();
			});
		}
	}
);
