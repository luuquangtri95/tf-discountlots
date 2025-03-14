class countDownBlock extends HTMLElement{
  constructor(){
    super();
    try {
      let time = this.dataset.expired.split(',');
      if(time.length > 3){
        this.deadline = new Date(time[0], time[1], time[2], time[3], time[4] || 0, time[5] || 0).getTime();
      }
      else{
        this.deadline = new Date(time[0], time[1], time[2]).getTime();
      }
    } catch(e) {
      console.log(e);
      return;
    }

    this.days = this.querySelector('.js-days');
    this.hours = this.querySelector('.js-hours');
    this.minutes = this.querySelector('.js-minutes');
    this.seconds = this.querySelector('.js-seconds');

    let currentTime = new Date().getTime();
    if((this.deadline - currentTime) <= 0) return;

    requestAnimationFrame(this.countDown.bind(this));
  }


  pad(value) {
    return ('0' + Math.floor(value)).slice(-2);
  }

  countDown(){
    const currentTime = new Date().getTime();
    const remain = this.deadline - currentTime;
    const days = this.pad((remain / (24*60*60*1000)));
    const hours = this.pad((remain / (60*60*1000)) % 24);
    const minutes = this.pad((remain / (60*1000)) % 60);
    const seconds = this.pad((remain / 1000) % 60);

    this.days.innerHTML = days;
    this.days.setAttribute('data-count', days);
    
    this.hours.innerHTML = hours;
    this.hours.setAttribute('data-count', hours);
    
    this.minutes.innerHTML = minutes;
    this.minutes.setAttribute('data-count', minutes);
    
    this.seconds.innerHTML = seconds;
    this.seconds.setAttribute('data-count', seconds);
    

    if (remain >= 1000) {
      requestAnimationFrame(this.countDown.bind(this));
    }
  }


}
customElements.define('countdown-block', countDownBlock);