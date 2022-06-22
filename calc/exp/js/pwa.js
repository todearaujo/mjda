// Funções Cookies
setCookie = (key, value, days) => {
  let date = new Date(Date.now() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = key + "=" + value + "; " + expires + "; path=/; secure=true; samesite=lax";
}

getCookie = (key) => {
  let matches = document.cookie.match(new RegExp("(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

let appcookie = getCookie('appinstalled')
console.log('Cookie: ' + appcookie)

// Checar se é instalável
if (!('serviceWorker' in navigator)){
  console.log('PWA: Indisponível');
  setCookie('appinstalled','notsupported',30)
  console.log('Cookie: ' + getCookie('appinstalled'))
  divInstall.style.display = 'none';
}

// Configurações do Prompt
let deferredPrompt
const divInstall = document.getElementById('promptInstall')
const butInstall = document.getElementById('butInstall')

// Capturar prompt de instalação
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  gtag('event','app_install', {"prompt":"Bill Q"});
  setTimeout(() => {
      if (appcookie === 'dismissed') {
      divInstall.style.display = 'none';
      console.log('PWA: Convite já negado');
    } else if (appcookie === 'installed') {
      divInstall.style.display = 'grid';
      divInstall.classList.add('fadein');
      console.log('PWA: Reinstalação');
    } else {
    divInstall.style.display = 'grid';
    divInstall.classList.add('fadein');
    console.log('PWA: Convite feito');
    }
  }, 5000)
})

// Aguardar o clique do usuário para instalação
pwaInstall = async () => {
  divInstall.style.display = 'none';
  console.log('PWA: Instalação iniciada');
  deferredPrompt.prompt();

  if (!deferredPrompt) {
    divInstall.style.display = 'none';
    console.log('PWA: Indisponível');
    console.log('Cookie: ' + getCookie('appinstalled'))
    return;
  }

  const { outcome } = await deferredPrompt.userChoice;
 
  if (outcome = 'accepted') {
    console.log('PWA: Instalação aceita');
    setCookie('appinstalled', outcome, 30)
    console.log('Cookie: ' + getCookie('appinstalled'))
  } else if (outcome = 'dismissed') {
    console.log('PWA: Instalação rejeitada');
    setCookie('appinstalled', outcome, 15)
    console.log('Cookie: ' + getCookie('appinstalled'))
  }

  deferredPrompt = null;
  divInstall.style.display = 'none';
  console.log('PWA: Fim do prompt');
  console.log('Cookie: ' + getCookie('appinstalled'))
}

pwaDismiss = () => {
  divInstall.style.display = 'none';
  setCookie('appinstalled','dismissed',15)
  console.log('PWA: Instalação adiada');
  deferredPrompt = null;
  console.log('Cookie: ' + getCookie('appinstalled'))
}

// Checar instalação do app
window.addEventListener('appinstalled', () => {
  divInstall.style.display = 'none';
  setCookie('appinstalled','installed',30)
  deferredPrompt = null;
  console.log('PWA: Instalado');
  console.log('Cookie: ' + getCookie('appinstalled'))
})

// Checar tipo de instalação
window.addEventListener('DOMContentLoaded', () => {
  if (document.referrer.startsWith('android-app://')) {
    console.log('PWA: Android (TWA)');
    return 'twa';
  } else if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    console.log('PWA: Standalone');
    return 'standalone';
  } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
    console.log('PWA: Fullscreen');
    return 'fullscreen';
  } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    console.log('PWA: minimal-ui');
    return 'minimal-ui';
  }
  console.log('PWA: Navegador');
  return 'browser';
})