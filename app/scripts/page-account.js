theme.addEvent('click', '.js-password-toggle', e=>{
  const parent = e.target.closest('div');
  const target = parent.querySelector('.input-field');
  if(!target) return;

  target.setAttribute('type', target.getAttribute('type') == 'password' ? 'text' : 'password');

  parent.classList.toggle('show-password', target.getAttribute('type') == 'text');
  parent.classList.toggle('hide-password', target.getAttribute('type') == 'password');
});


theme.addEvent('click', 'a[download]', async e=>{
  e.preventDefault();
  const link = e.target.closest('a');
  let imageBlob = await fetch(link.href).then(res => res.blob());
  let imageURL = URL.createObjectURL(imageBlob);
  let a = document.createElement('a');

  a.href = imageURL;
  a.download = link.download;
  a.click()
});


/*
  Password check valid
*/
(()=>{
  const registerForm = document.getElementById('registerForm');

  if(!registerForm) return;

  const checkConfirmPw = ()=>{
    const pass = registerForm.querySelector('[name="customer[password]"]');
    const cfmPass = registerForm.querySelector('[name="customer[password_confirmation]"]');
    const msg = registerForm.querySelector('.js-pw-match');


    if(pass.value != cfmPass.value){
      msg.classList.remove('hide');
      return false;
    }

    msg.classList.add('hide');
    return true
  }

  const checkLength = ()=>{
    const pass = registerForm.querySelector('[name="customer[password]"]');
    const msg = registerForm.querySelector('.js-pw-length');

    if(pass.value.length < 8){
      msg.classList.remove('hide');
      return false;
    }

    msg.classList.add('hide');
    return true
  }

  const checkRegex = ()=>{
    const pass = registerForm.querySelector('[name="customer[password]"]');
    const msg = registerForm.querySelector('.js-pw-regex');

    if(!pass.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/g)){
      msg.classList.remove('hide');
      return false;
    }

    msg.classList.add('hide');
    return true
  }

  const formSubmit = e=>{
    const isValid = [checkConfirmPw(), checkLength(), checkRegex()].every(i=>i==true);
    registerForm.querySelector('.js-pw-check').classList.add('hide');

    if(!isValid){
      registerForm.querySelector('.js-pw-check').classList.remove('hide');
      e.preventDefault();
      return;
    }

    if(!registerForm.checkValidity()){
      registerForm.reportValidity();
      e.preventDefault();
    }
  }
  registerForm.querySelector('[type=submit]').addEventListener('click', formSubmit);
})();

// UPDATE POSITION

let currentUrl = window.location.href;
function updatePosition(currentUrl){
  const targetId = currentUrl.split('#')[1]
  if (targetId != 'login' && targetId != 'recover' )return;
  const targetElement = document.getElementById(targetId);
  const paddingTop = + getComputedStyle(targetElement.closest('section')).paddingTop.replace('px','');
  const marginTop = + getComputedStyle(targetElement.closest('section')).marginTop.replace('px','');
  const headerHeight = document.querySelector('header').clientHeight;
  const  offsetTop = targetElement.offsetTop;
  const top = offsetTop - headerHeight - paddingTop - marginTop ;
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

function checkUrlChange() {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    updatePosition(currentUrl);
  }
  setTimeout(checkUrlChange, 500);
}

checkUrlChange();
updatePosition(currentUrl);

(() => {
  try {
    const recoverForm = document.getElementById('recover');
    if (!recoverForm) return;

    const recoverMsg = document.querySelectorAll('.recover-msg');
    const email = sessionStorage.getItem('user-forgot-email');
    if (recoverMsg.length && email) {
      recoverMsg.forEach(item => {
        item.innerText = item.innerText.replace('example@email.com',email)
      })
    }

     sessionStorage.removeItem('user-forgot-email');

    const formSubmitRecover = (e) => {
      try {
        const emailInput = recoverForm.querySelector('form input[id="RecoverEmail"]');
        if (!emailInput) {
          throw new Error('Email input not found');
        }

        const email = emailInput.value;
        sessionStorage.setItem('user-forgot-email', email);
      } catch (error) {
        console.error('Error in formSubmitRecover:', error.message);
      }
    };

    const submitButton = recoverForm.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', formSubmitRecover);
    }
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
})();
