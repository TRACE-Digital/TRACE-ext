!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/",o(o.s=33)}({33:function(e,t){var o=new RegExp(".*(((log|sign) (in|up))|((create( an)* account)|join|register)).*"),n=new RegExp(".*(username|signup_name|login).*"),r=new RegExp(".*(email).*"),l=null;function u(){return!!a()&&((l=i())&&l.addEventListener("input",(function(e){console.log(l),l&&console.log(l.value)}),!1),!0)}window.addEventListener("load",(function(e){"complete"===document.readyState&&(u()||setTimeout(u,1e3))}),!1),window.addEventListener("click",(function(e){"complete"===document.readyState&&(u()||setTimeout(u,1e3))}),!1),window.addEventListener("submit",(function(e){console.log(l),l&&console.log(l.value)}),!1);var a=function(){for(var e=document.getElementsByTagName("input"),t=document.getElementsByTagName("button"),n=0;n<e.length;n++)if("submit"==e[n].type.toLowerCase()&&(console.log(e[n].value.toLowerCase()),e[n].value&&o.test(e[n].value.toLowerCase())))return console.log("true"),!0;for(n=0;n<t.length;n++)if(console.log(t[n].className),"submit"==t[n].type.toLowerCase()&&(console.log(t[n].innerHTML.trim().toLowerCase()),t[n].innerHTML&&o.test(t[n].innerHTML.trim().toLowerCase())))return console.log("true"),!0;return console.log("false"),!1},i=function(){for(var e=document.getElementsByTagName("input"),t=0;t<e.length;t++){if(console.log(e[t].id.toLowerCase()),e[t].name&&n.test(e[t].name.toLowerCase())||e[t].id&&n.test(e[t].id.toLowerCase())||e[t].placeholder&&n.test(e[t].placeholder.toLowerCase()))return console.log(e[t]),e[t];if(e[t].name&&r.test(e[t].name.toLowerCase())||e[t].id&&r.test(e[t].id.toLowerCase())||e[t].placeholder&&r.test(e[t].placeholder.toLowerCase()))return console.log(e[t]),e[t]}}}});
//# sourceMappingURL=content_script.js.map