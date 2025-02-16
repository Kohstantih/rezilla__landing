import SliderControl from './SliderControl';

const sliderList = document.querySelectorAll('[data-js-slider]');

sliderList.forEach((slide) => {
  const slider = new SliderControl(slide);
  slider.init();
});
