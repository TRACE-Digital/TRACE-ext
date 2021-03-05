(function (window, document, undefined) {

  // code that should be taken care of right away
  window.onload = init;

  function init() {
    document.getElementById("add-site").addEventListener("click", function (e) {
      openTab(e, "London");
    });

    document.getElementById("pwnd").addEventListener("click", function (e) {
      openTab(e, "pwndTab");
    });

    hibpInit()

    // Start on 'Manage Sites' tab
    openTab(null, "London")
  }
})(window, document, undefined);

function openTab(e, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  e.currentTarget.className += " active";

  // Clear possible HaveIBeenPwnd background styling
  $("*").removeClass("pwnd");
  $("*").removeClass("notPwnd");
}