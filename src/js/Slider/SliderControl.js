export default class SliderControl {
  selectors = {
    sliderList: '[data-js-slider-list]',
    sliderItem: '[data-js-slider-item]',
    buttonNext: '[data-js-button-next-slide]',
    buttonPrevious: '[data-js-button-previous-slide]',
    paginationControlPanel: '[data-js-slider-pagination]',
    paginationItem: 'input',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;

    this.sliderList = this.rootElement.querySelector(this.selectors.sliderList);
    this.sliderItemBox = this.sliderList.querySelectorAll(this.selectors.sliderItem);
    this.buttonNext = this.rootElement.querySelector(this.selectors.buttonNext);
    this.buttonPrevious = this.rootElement.querySelector(this.selectors.buttonPrevious);
    this.paginationControlPanel = this.rootElement.querySelector(
      this.selectors.paginationControlPanel,
    );
    this.paginationList = this.paginationControlPanel.querySelectorAll(
      this.selectors.paginationItem,
    );

    this.sliderNumber = 0;
    this.lastResizeTimeoutId = null;
    this.touchStartX = 0;
    this.offsetMovedSlider = 0;

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrevious = this.onClickPrevious.bind(this);
    this.onClickPagination = this.onClickPagination.bind(this);
    this.onResizeWindow = this.onResizeWindow.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  moveSlider(offset) {
    this.sliderList.style.transform = `translate(${offset}px)`;
  }

  scrollSlider() {
    if (this.sliderNumber >= this.sliderItemBox.length) {
      this.sliderNumber = 0;
    }

    if (this.sliderNumber < 0) {
      this.sliderNumber = this.sliderItemBox.length - 1;
    }

    const slideWidth = this.sliderItemBox[0].offsetWidth;
    const offset = -(this.sliderNumber * slideWidth);
    this.offsetMovedSlider = offset;

    this.moveSlider(offset);
    this.switchPagination();
  }

  switchPagination() {
    this.paginationList.forEach((item) => {
      if (+item.value === this.sliderNumber) {
        item.checked = true;
      }
    });
  }

  onResizeWindow() {
    if (this.lastResizeTimeoutId) clearTimeout(this.lastResizeTimeoutId);

    this.lastResizeTimeoutId = setTimeout(() => {
      this.scrollSlider();

      this.lastResizeTimeoutId = null;
    }, 300);
  }

  onClickNext() {
    this.sliderNumber += 1;

    this.scrollSlider();
  }

  onClickPrevious() {
    this.sliderNumber -= 1;

    this.scrollSlider();
  }

  onClickPagination(event) {
    this.sliderNumber = event.currentTarget.value;

    this.scrollSlider();
  }

  onTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event) {
    const xMoving = event.touches[0].clientX;
    const xDiff = xMoving - this.touchStartX;
    const offset = this.offsetMovedSlider + xDiff;

    this.moveSlider(offset);
  }

  onTouchEnd(event) {
    const xEnd = event.changedTouches[0].clientX;
    const xDiff = xEnd - this.touchStartX;

    if (Math.abs(xDiff) < 30) {
      this.scrollSlider();
      return;
    }

    if (xDiff > 0) {
      this.sliderNumber -= 1;
    } else if (xDiff < 0) {
      this.sliderNumber += 1;
    } else {
      return;
    }

    this.scrollSlider();
  }

  init() {
    window.addEventListener('resize', this.onResizeWindow);

    this.buttonNext?.addEventListener('click', this.onClickNext);
    this.buttonPrevious?.addEventListener('click', this.onClickPrevious);
    this.paginationList?.forEach((item) => {
      item.addEventListener('click', this.onClickPagination);
    });
    this.sliderList.addEventListener('touchstart', this.onTouchStart);
    this.sliderList.addEventListener('touchmove', this.onTouchMove);
    this.sliderList.addEventListener('touchend', this.onTouchEnd);
  }
}
