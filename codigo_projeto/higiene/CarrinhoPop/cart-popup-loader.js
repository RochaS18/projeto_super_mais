// ============================================================
// CARREGADOR DO POPUP DO CARRINHO
// ============================================================
(function(){
  "use strict";
  const trigger=document.getElementById("cart-trigger");
  let frame=null;
  function open(){
    if(frame)return;
    frame=document.createElement("iframe");
    frame.src="CarrinhoPop/cart-popup.html";
    frame.title="Meu carrinho";
    frame.className="external-popup-frame";
    frame.setAttribute("aria-modal","true");
    document.body.appendChild(frame);
    document.body.classList.add("external-popup-open");
  }
  function close(){if(frame){frame.remove();frame=null}document.body.classList.remove("external-popup-open");trigger?.focus()}
  trigger?.addEventListener("click",e=>{e.preventDefault();open()});
  window.addEventListener("message",e=>{if(e.data?.type==="close-cart-popup")close()});
})();
