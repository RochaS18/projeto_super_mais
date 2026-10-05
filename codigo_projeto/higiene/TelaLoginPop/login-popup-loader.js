(function () {
    "use strict";

    const trigger = document.getElementById("login-trigger");

    if (!trigger) return;

    let frame = null;

    const loaderScript = document.currentScript;

    const loginUrl = new URL(
        "login-popup.html",
        loaderScript.src
    ).href;

    function openLogin() {
        if (frame) return;

        frame = document.createElement("iframe");

        frame.src = loginUrl;
        frame.title = "Login e criação de conta";
        frame.className = "external-popup-frame";
        frame.setAttribute("aria-modal", "true");

        document.body.appendChild(frame);
        document.body.classList.add("external-popup-open");
    }

    function closeLogin() {
        if (frame) {
            frame.remove();
            frame = null;
        }

        document.body.classList.remove("external-popup-open");
        trigger.focus();
    }

    trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openLogin();
    });

    window.addEventListener("message", function (event) {
        if (
            event.data &&
            event.data.type === "close-login-popup"
        ) {
            closeLogin();
        }
    });
})();