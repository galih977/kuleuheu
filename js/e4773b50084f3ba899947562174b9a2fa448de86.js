$(document).ready(function() {
    initializeFrontPageViewModel();
    loadArticles();
    initializeEventsCountdown();
  });
  
  function initializeEventsCountdown() {
    $.getJSON("/data/event-articles.json", function(eventArticles) {
      let date = new Date();
      let activeEvents = eventArticles.filter(function(event) {
          if(!event.endsOn) return false;
  
          return new Date(moment(event.endsOn, Constants.DateFormat)) >= date; 
      });
  
      if(activeEvents.length == 0) {
        updateEventText("Event has ended");
        return;
      }
  
      if(activeEvents.length > 1) {
        updateEventText(activeEvents.length + " events are active");
        return;
      }
  
      let currentDate = new Date();
      let eventEndDate = new Date(moment(activeEvents[0].endsOn, Constants.DateFormat));
      let dateDifference = eventEndDate.getTime() - currentDate.getTime();
  
      loopEventCountdown(dateDifference);
    });
  };
  
  function initializeFrontPageViewModel() {
    FrontPageViewModel = {
      displayedArticles: ko.observableArray(),
      hiddenArticles: [],
  
      showMoreArticles: function() {
        ko.utils.arrayPushAll(
          FrontPageViewModel.displayedArticles(),
          FrontPageViewModel.hiddenArticles.splice(0, 4)
        );
        FrontPageViewModel.displayedArticles.valueHasMutated();
  
        // Really dirty hack but it saves me from frustration. When using an anchor element as a wrapper, HTML5 adds empty anchor elements
        // to the child elements inside this wrapper, which mess up the CSS :after rules which add "," and "and" in between authors
        $(".card-collection.collection-attached .authors a")
          .not(".author")
          .remove();
  
        preLoadNextImages(4);
      },
  
      animateNewArticle: function(elem) {
        if (elem.nodeType === 1)
          $(elem)
            .hide()
            .show("slow");
      }
    };
  
    ko.applyBindings(FrontPageViewModel, document.getElementById("page-wrapper"));
  };
  
  function loopEventCountdown(dateDifference) {
    if(dateDifference <= 0) {
      updateEventText("Event has ended");
      return;
    }
  
    updateEventText("Ends in " + getCountdownStringForDate(dateDifference));
  
    setTimeout(function() {
      loopEventCountdown(dateDifference - 1000);
    }, 1000);
  };
  
  function loadArticles() {
    $.getJSON("/data/articles.json", function(articles) {
      FrontPageViewModel.hiddenArticles = articles;
      preLoadNextImages(4);
    });
  };
  
  function preLoadNextImages(amount) {
    $.each(FrontPageViewModel.hiddenArticles.slice(0, amount), function(
      index,
      value
    ) {
      new Image().src = value.image;
    });
  }
  
  function updateEventText(text) {
    $("#farming-and-events-banner-text").html(text);
  };;
  !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.timeago={})}(this,function(t){"use strict";var f=[60,60,24,7,365/7/12,12],o=function(t){return parseInt(t)},n=function(t){return t instanceof Date?t:!isNaN(t)||/^\d+$/.test(t)?new Date(o(t)):(t=(t||"").trim().replace(/\.\d+/,"").replace(/-/,"/").replace(/-/,"/").replace(/(\d)T(\d)/,"$1 $2").replace(/Z/," UTC").replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),new Date(t))},s=function(t,e){for(var n=0,r=t<0?1:0,a=t=Math.abs(t);f[n]<=t&&n<f.length;n++)t/=f[n];return(0===(n*=2)?9:1)<(t=o(t))&&(n+=1),e(t,n,a)[r].replace("%s",t)},d=function(t,e){return((e=e?n(e):new Date)-n(t))/1e3},r="second_minute_hour_day_week_month_year".split("_"),a="ç§’_åˆ†é’Ÿ_å°æ—¶_å¤©_å‘¨_ä¸ªæœˆ_å¹´".split("_"),e=function(t,e){if(0===e)return["just now","right now"];var n=r[parseInt(e/2)];return 1<t&&(n+="s"),["".concat(t," ").concat(n," ago"),"in ".concat(t," ").concat(n)]},i={en_US:e,zh_CN:function(t,e){if(0===e)return["åˆšåˆš","ç‰‡åˆ»åŽ"];var n=a[parseInt(e/2)];return["".concat(t," ").concat(n,"å‰"),"".concat(t," ").concat(n,"åŽ")]}},c=function(t){return i[t]||e},l="timeago-tid",u=function(t,e){return t.getAttribute?t.getAttribute(e):t.attr?t.attr(e):void 0},p=function(t){return u(t,l)},_={},v=function(t){clearTimeout(t),delete _[t]},h=function t(e,n,r,a){v(p(e));var o=d(n,a);e.innerHTML=s(o,r);var i,c,u=setTimeout(function(){t(e,n,r,a)},1e3*function(t){for(var e=1,n=0,r=Math.abs(t);f[n]<=t&&n<f.length;n++)t/=f[n],e*=f[n];return r=(r%=e)?e-r:e,Math.ceil(r)}(o),2147483647);_[u]=0,c=u,(i=e).setAttribute?i.setAttribute(l,c):i.attr&&i.attr(l,c)};t.version="4.0.0-beta.2",t.format=function(t,e,n){var r=d(t,n);return s(r,c(e))},t.render=function(t,e,n){var r;void 0===t.length&&(t=[t]);for(var a=0;a<t.length;a++){r=t[a];var o=u(r,"datetime"),i=c(e);h(r,o,i,n)}return t},t.cancel=function(t){if(t)v(p(t));else for(var e in _)v(e)},t.register=function(t,e){i[t]=e},Object.defineProperty(t,"__esModule",{value:!0})});
  ;
  $(document).ready(function() {
      var locale = function(number, index, total_sec) {
          // number: the timeago / timein number;
          // index: the index of array below;
          // total_sec: total seconds between date to be formatted and today's date;
          return [
            ['Updated today', 'right now'],
            ['Updated today', 'in %s seconds'],
            ['Updated today', 'in 1 minute'],
            ['Updated today', 'in %s minutes'],
            ['Updated today', 'in 1 hour'],
            ['Updated today', 'in %s hours'],
            ['Updated yesterday', 'in 1 day'],
            ['Updated %s days ago', 'in %s days'],
            ['Updated 1 week ago', 'in 1 week'],
            ['Updated %s weeks ago', 'in %s weeks'],
            ['Updated 1 month ago', 'in 1 month'],
            ['Updated %s months ago', 'in %s months'],
            ['Updated 1 year ago', 'in 1 year'],
            ['Updated %s years ago', 'in %s years']
          ][index];
      };
      timeago.register('custom-locale', locale);
  
      $.each($(".main-navigation .card-wrapper.show-timeago"), function(index, element) {
          var dateElement = $(element).find(".date");
          var date = dateElement.html();
          dateElement.removeClass("invisible date");
          var formattedDate = timeago.format(date, "custom-locale");
          dateElement.html(formattedDate);
      });
  });;