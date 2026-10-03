// ============================================================
// CARREGADOR DO POPUP DE LOGIN
// ============================================================
(function(){
  "use strict";
  const trigger=document.getElementById("login-trigger");
  let frame=null;
  function open(){
    if(frame)return;
    frame=document.createElement("iframe");
    frame.src="TelaLoginPop/login-popup.html";
    frame.title="Login e criação de conta";
    frame.className="external-popup-frame";
    frame.setAttribute("aria-modal","true");
    document.body.appendChild(frame);
    document.body.classList.add("external-popup-open");
  }
  function close(){if(frame){frame.remove();frame=null}document.body.classList.remove("external-popup-open");trigger?.focus()}
  trigger?.addEventListener("click",e=>{e.preventDefault();open()});
  window.addEventListener("message",e=>{if(e.data?.type==="close-login-popup")close()});
})();
