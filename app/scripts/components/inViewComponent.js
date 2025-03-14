!customElements.get("in-view-component") &&
customElements.define("in-view-component", class extends cartForm {
  constructor(){
    super();
    const { resizeObserver } = theme;

    this.container = this.closest('.jsInViewContainer');

    resizeObserver(this.container, ()=>{
      this.init();
    }, 300);

  }

  connectedCallback(){
    this.init();
  }

  init(){

    this.style.left = null;
    this.style.right = null;

    const { top: containerTopAt, left: containerLeftAt, width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect();
    const containerBottomAt = containerTopAt + containerHeight;
    const containerRightAt = containerLeftAt + containerWidth;

    const { top: childTopAt, left: childLeftAt, width: childWidth, height: childHeight } = this.getBoundingClientRect();
    const childBottomAt = childTopAt + childHeight;
    const childRightAt = childLeftAt + childWidth;

    if(
      childRightAt <= containerRightAt &&
      childLeftAt >= containerLeftAt
      // childTopAt >= containerTopAt &&
      // childBottomAt <= containerBottomAt &&
    ) return;
      
    if(childRightAt > containerRightAt){

      if (childWidth*2 < containerWidth) {
        this.style.left = 'unset';
        this.style.right = '100%';
      }
      else{
        this.style.left = 'unset';
        
      }
    }

    if(childLeftAt < containerLeftAt){
      this.style.left = '0';
      this.style.right = 'auto';
    }
  }
})