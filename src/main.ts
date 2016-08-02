///<reference path="../typings/index.d.ts"/>

window.onload = function () {
    alert("Loaded");
};

new Vue({
    el: "#app",
    data: {
        message: "Hello!"
    }
});