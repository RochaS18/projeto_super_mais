// ============================================================
// LOGIN / CRIAR CONTA - executado dentro de login-popup.html
// ============================================================
(function(){
  "use strict";
  const postClose=()=>window.parent.postMessage({type:"close-login-popup"},"*");
  const close=document.getElementById("login-close");
  const overlay=document.getElementById("login-overlay");
  const loginView=document.getElementById("login-view");
  const registerView=document.getElementById("register-view");
  const openRegister=document.getElementById("open-register");
  const back=document.getElementById("back-to-login");
  const form=document.getElementById("login-form");
  const registerForm=document.getElementById("register-form");
  const password=document.getElementById("login-password");
  const toggle=document.getElementById("password-toggle");
  function showLogin(){loginView.hidden=false;registerView.hidden=true;document.getElementById("login-email").focus()}
  function showRegister(){loginView.hidden=true;registerView.hidden=false;document.getElementById("register-name").focus()}
  close?.addEventListener("click",postClose); overlay?.addEventListener("click",postClose);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")postClose()});
  openRegister?.addEventListener("click",e=>{e.preventDefault();showRegister()});
  back?.addEventListener("click",e=>{e.preventDefault();showLogin()});
  toggle?.addEventListener("click",()=>{password.type=password.type==="password"?"text":"password";toggle.textContent=password.type==="password"?"◉":"🙈"});
  form?.addEventListener("submit",e=>{e.preventDefault();const email=document.getElementById("login-email").value.trim();const pass=password.value.trim();if(!email||!pass)return alert("Preencha o e-mail e a senha.");if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return alert("Digite um e-mail válido.");alert("Login realizado com sucesso!");postClose()});
  registerForm?.addEventListener("submit",e=>{e.preventDefault();const n=document.getElementById("register-name").value.trim();const em=document.getElementById("register-email").value.trim();const p=document.getElementById("register-password").value;const c=document.getElementById("register-password-confirm").value;if(!n)return alert("Digite seu nome completo.");if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))return alert("Digite um e-mail válido.");if(p.length<6)return alert("A senha deve ter pelo menos 6 caracteres.");if(p!==c)return alert("As senhas não são iguais.");alert("Conta criada com sucesso!");document.getElementById("login-email").value=em;showLogin()});
})();
