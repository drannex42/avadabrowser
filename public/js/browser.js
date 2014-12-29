"use strict";

function urlToTtile(url) {
  var a = document.createElement("a");
  a.href = url;

  var hostname = a.hostname;
  hostname = hostname.split(".").slice(-2).join(".");

  return hostname;
}

var loc;
var tabs;
var newTab;
var pageContent;
var navForward;
var navBackward;

var activePage;
var activeTab;
var activeWV;

function activate(page, tab) {
  if(activePage && activePage !== page) {
    activePage.classList.remove("active");
  }

  if(activeTab && activeTab !== tab) {
    activeTab.classList.remove("active");
  }

  activePage = page;
  activeTab = tab;
  activeWV = page.firstElementChild;

  activePage.classList.add("active");
  activeTab.classList.add("active");

  loc.value = activeWV.src;
}

window.onload = function() {
  var $ = document.querySelector.bind(document);

  loc = $("header input");
  tabs = $("ul.tabs");
  newTab = $("#new");
  pageContent = $("#page-content");
  navForward = $("#nav .forward");
  navBackward = $("#nav .backward");

  function openNewTab(url) {
    var page = document.createElement("div");
    page.className = "page";

    var webview = document.createElement("webview");
    page.appendChild(webview);

    pageContent.appendChild(page);

    if(url) {
      webview.src = url;
    }

    var tab = document.createElement("li");
    tab.className = "tab";

    var label = document.createTextNode(urlToTtile(url));
    tab.appendChild(label);

    var close = document.createElement("div");
    close.className = "tab-close";
    close.textContent = "x";
    tab.appendChild(close);

    tabs.appendChild(tab);

    function handleTabClick() {
      console.log("clicking tab");
      activate(page, tab);
    }

    function handleCloseClick(evt) {
      console.log("closing tab");
      tab.removeEventListener(handleTabClick);
      webview.removeEventListener(handleTabClick);
      close.removeEventListener(handleCloseClick);

      tab.parentNode.removeChild(tab);
      webview.parentNode.removeChild(webview);

      evt.stopPropagation();
    }

    tab.addEventListener("click", handleTabClick, false);
    close.addEventListener("click", handleCloseClick, true);

    webview.addEventListener("title-set", function(evt) {
      label.textContent = evt.title;
    }, false);

    activate(page, tab);
  }

  loc.addEventListener("keypress", function(evt) {
    if(evt.keyCode === 13) {
      console.log("changing location " + loc.value);

      activeWV.src = loc.value;
    }
  }, false);

  newTab.addEventListener("click", function() {
    openNewTab("http://www.google.com");
  }, false);

  navBackward.addEventListener("click", function() {
    activeWV.back();
  });

  navForward.addEventListener("click", function() {
    activeWV.forward();
  });

  openNewTab("http://www.google.com");
};
