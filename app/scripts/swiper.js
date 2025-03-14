import Swiper from 'swiper';
import {
    Navigation, Pagination, Autoplay, Thumbs
} from 'swiper/modules';

window.SwiperSlider = {
    Swiper,
    Modules: [Navigation, Pagination, Autoplay, Thumbs]
};

document.dispatchEvent(new Event('SwiperSliderLoaded'));