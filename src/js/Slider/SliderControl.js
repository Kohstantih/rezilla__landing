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

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrevious = this.onClickPrevious.bind(this);
    this.onClickPagination = this.onClickPagination.bind(this);
    this.onResizeWindow = this.onResizeWindow.bind(this);

    this.sliderNumber = 0;
    this.lastResizeTimeoutId = null;
  }

  sliderScroll() {
    const sliderWidth = this.sliderItemBox[0].offsetWidth;

    this.sliderList.style.transform = `translate(-${this.sliderNumber * sliderWidth}px)`;
  }

  onResizeWindow() {
    if (this.lastResizeTimeoutId) clearTimeout(this.lastResizeTimeoutId);

    this.lastResizeTimeoutId = setTimeout(() => {
      this.sliderScroll();

      this.lastResizeTimeoutId = null;
    }, 300);
  }

  switchPagination() {
    this.paginationList.forEach((item) => {
      if (+item.value === this.sliderNumber) {
        item.checked = true;
      }
    });
  }

  onClickNext() {
    this.sliderNumber += 1;

    if (this.sliderNumber >= this.sliderItemBox.length) {
      this.sliderNumber = 0;
    }

    this.sliderScroll();
    this.switchPagination();
  }

  onClickPrevious() {
    this.sliderNumber -= 1;

    if (this.sliderNumber < 0) {
      this.sliderNumber = this.sliderItemBox.length - 1;
    }

    this.sliderScroll();
    this.switchPagination();
  }

  onClickPagination(e) {
    this.sliderNumber = e.currentTarget.value;

    this.sliderScroll();
  }

  init() {
    window.addEventListener('resize', this.onResizeWindow);

    this.buttonNext?.addEventListener('click', this.onClickNext);
    this.buttonPrevious?.addEventListener('click', this.onClickPrevious);
    this.paginationList?.forEach((item) => {
      item.addEventListener('click', this.onClickPagination);
    });
  }
}
