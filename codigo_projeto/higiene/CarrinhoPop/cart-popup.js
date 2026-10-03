// ============================================================
// MEU CARRINHO - executado dentro de cart-popup.html
// ============================================================
(function(){
  "use strict";
  const close=()=>window.parent.postMessage({type:"close-cart-popup"},"*");
  document.getElementById("cart-close")?.addEventListener("click",close);
  document.getElementById("cart-overlay")?.addEventListener("click",close);
  document.getElementById("cart-continue")?.addEventListener("click",close);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
})();
