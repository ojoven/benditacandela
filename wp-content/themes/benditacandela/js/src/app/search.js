/** SEARCH **/

// VARS
var flagPreventDuplicate = false;
var flagPreventDuplicateAjax = false;

var $searchMainInput = $('#search-popover-input'),
    $searchMainButton = $("#search-popover-btn"),
    $searchResultsContainerWrapper = $(".__searchResults"),
    $searchResults = $("#results"),
    $toOpenCloseSearchPopoverContainer = $('#to-open-close-search-popover-container'),
    $toOpenCloseSearchPopoverInput = $('#to-open-close-search-popover-input'),
    $toOpenCloseSearchPopoverButton = $("#to-open-close-search-popover-button"),
    $toLoadMoreSearch = $("#to-load-more"),
    $searchPopover = $("#search-popover"),
    $searchPopoverHeader = $("#search-popover .search-popover-input-container"),
    mobileSearch = $('.search-mobile');

// LOGIC
$(function () {

    // main search
    toSearchMainEvents();
    searchPopoverOpenCloseManagement();
    searchKeyboardAccessibilityEvents();

    // main search mobile
    toSearchMainMobile();

    // auxiliars
    preventSearchToBeOpenOnTabSwitch();

});

$(window).resize(function() {
    adjustFindResultSize();
});

// FUNCTIONS

// main search
function toSearchMainEvents() {

    $searchMainInput._enterKey(function () {
        var offset = 0;
        search(offset);
    });

    $searchMainButton.off().on('click', function () {
        var offset = 0;
        search(offset);
        return false;
    });

    $toLoadMoreSearch.off().on('click', function() {
        searchPaginate();
        return false;
    });

}

function search() {

    // Init vars
    var $searchPanel = $("#search-popover");
    var $panels = {
        'products' : $searchPanel.find("#results-products"),
        'recipes': $searchPanel.find("#results-recipes"),
        'collections': $searchPanel.find("#results-collections"),
        'articles': $searchPanel.find("#results-articles")
    };

    $searchPanel.find("#search-cnt").find('div').velocity({ opacity: 0 });

    $panels['products'].find('ul').html("");
    $panels['recipes'].find('ul').html("");
    $panels['collections'].find('ul').html("");
    $panels['articles'].find('ul').html("");

    $panels['products'].css('display', 'none');
    $panels['recipes'].css('display', 'none');
    $panels['collections'].css('display', 'none');
    $panels['articles'].css('display', 'none');

    // query
    var query = $searchMainInput.val();

    // Filter
    if(isMediaQueryMobile()){
        $("#search-cnt > div").on('click', function(){
            var panel = $(this).data('panel');

            $("#search-cnt > div").removeClass('active');
            $(this).addClass('active');

            if(panel != 'all'){
                $("#results > div").not('#results-' + panel).slideUp(300);
                $searchResults.find('#results-' + panel).slideDown(300);
            }else{
                $("#results > div").slideDown(300);
            }
        });
    }

    if(flagPreventDuplicateAjax == false) {

        flagPreventDuplicateAjax = true;

        // loader
        $searchPopoverHeader.after("<div class='loader-search'></div>");
        $toLoadMoreSearch.parent().hide();

        $.ajax({
          dataType: "json",
          method:'post',
          url: urlBase + '/node/msearch/ajax',
          data: {query:query}
        }).done(function (data) {

          $(".loader-search").remove();

          $searchPanel.find("#total-cnt span").text(data.total);
          $searchPanel.find("#products-cnt span").text(data.counters.products);
          $searchPanel.find("#recipes-cnt span").text(data.counters.recipes);
          $searchPanel.find("#collections-cnt span").text(data.counters.collections);
          if (data.counters.articles>0) {
              $searchPanel.find("#articles-cnt span").text(data.counters.articles);
          } else {
              $searchPanel.find("#articles-cnt").hide();
          }

          if($(data.results.products).size() > 0)
              $panels['products'].css('display', 'inline-block');

          if($(data.results.recipes).size() > 0)
              $panels['recipes'].css('display', 'inline-block');

          if($(data.results.collections).size() > 0)
              $panels['collections'].css('display', 'inline-block');

          if($(data.results.articles).size() > 0)
              $panels['articles'].css('display', 'inline-block');

          if($(data.results.products).size() >= 20
              || $(data.results.recipes).size() >= 20
              || $(data.results.collections).size() >= 20
              || $(data.results.articles).size() >= 20)
              $toLoadMoreSearch.parent().show();

          // accessibility
          if (data.total == 0) {
              $("#results").after('<div style="position:relative"><div id="no-results" class="srt" tabindex="0">' + m.noResults + '</div></div>');
          } else {
              $("#no-results").parent().remove();
          }

          $.each(data.results, function(i, group){

              $.each(group, function(nr, item){

                  if(nr < 20){
                      var $item = $("<li></li>");
                      var $link = $("<a href='#'></a>");
                      var $image = $("<span></span>");
                      var $title = $("<h3></h3>");

                      $title.html(item.title);
                      $link.attr('href', item.url);
                      $image.css('backgroundImage', "url('" + item.image_url + "')");

                      $($image).appendTo($link);
                      $($title).appendTo($link);

                      $($link).appendTo($item);

                      $item.velocity({
                          opacity: 1
                      },{
                          delay: nr*100
                      });

                      $($item).appendTo($panels[i].find('ul'));
                  }

              });

          });

          $.each($searchPanel.find("#search-cnt").find('div'), function(x, div){

              $(div).velocity({
                  opacity: 1
              },{
                  delay: x*100
              });

          });

          flagPreventDuplicateAjax = false;

      }).fail(function(){
          
          flagPreventDuplicateAjax = false;
      });
    }

}

function searchPaginate() {

    // Init vars
    var $searchPanel = $("#search-popover");
    var $panels = {
        'products' : $searchPanel.find("#results-products"),
        'recipes': $searchPanel.find("#results-recipes"),
        'collections': $searchPanel.find("#results-collections"),
        'articles': $searchPanel.find("#results-articles")
    };

    var productsCount = $panels['products'].find('li').length;
    var recipesCount = $panels['recipes'].find('li').length;
    var collectionsCount = $panels['collections'].find('li').length;
    var articlesCount = $panels['articles'].find('li').length;

    var offset = Math.max(productsCount, recipesCount, collectionsCount, articlesCount);

    // query
    var query = $searchMainInput.val();

    // set the focus on the results last element
    if (productsCount > 0) {
        $("#fullfind #results-products ul li").last().find('a').focus();
    } else if (recipesCount > 0) {
        $("#fullfind #results-recipes ul li").last().find('a').focus();
    } else if (collectionsCount) {
        $("#fullfind #results-collections ul li").last().find('a').focus();
    } else if (articlesCount) {
        $("#fullfind #results-articles ul li").last().find('a').focus();
    }

    // loader
    $toLoadMoreSearch.parent().hide();
    $searchResults.after("<div class='loader-search'></div>");

    if(flagPreventDuplicateAjax == false) {
      flagPreventDuplicateAjax = true;
      $.ajax({
          dataType: "json",
          method:'post',
          url: urlBase + '/node/msearch/ajax',
          data: {query:query, offset:offset}
      }).done(function (data) {

          $(".loader-search").remove();

          if($(data.results.products).size() >= 20
              || $(data.results.recipes).size() >= 20
              || $(data.results.collections).size() >= 20
              || $(data.results.articles).size() >= 20)
              $toLoadMoreSearch.parent().show();

          $.each(data.results, function(i, group){

              $.each(group, function(nr, item){

                  if(nr < 20){
                      var $item = $("<li></li>");
                      var $link = $("<a href='#'></a>");
                      var $image = $("<span></span>");
                      var $title = $("<h3></h3>");

                      $title.html(item.title);
                      $link.attr('href', item.url);
                      $image.css('backgroundImage', "url('" + item.image_url + "')");

                      $($image).appendTo($link);
                      $($title).appendTo($link);

                      $($link).appendTo($item);

                      $item.velocity({
                          opacity: 1
                      },{
                          delay: nr*100
                      });

                      $($item).appendTo($panels[i].find('ul'));
                  }

              });

          });
          flagPreventDuplicateAjax = false;

      }).fail(function(){
          
          flagPreventDuplicateAjax = false;
      });
    }


}

// full finder manage
function searchPopoverOpenCloseManagement() {

    $toOpenCloseSearchPopoverContainer.on('click', function (e) {
        e.stopPropagation();
        searchPopoverManage();
    });

    $toOpenCloseSearchPopoverContainer.on('focusin', function (e) {
        e.stopPropagation();
        searchPopoverManage();
    });

    $toOpenCloseSearchPopoverButton.on('click', function(e) {
        e.stopPropagation();
        searchPopoverManage();
    });

}

function searchPopoverOpen() {

    $toOpenCloseSearchPopoverButton.html(srt(m.closeSearch));
    $toOpenCloseSearchPopoverContainer.addClass('expanded');

    $toOpenCloseSearchPopoverInput._effect($searchPopover, 0.1, {display: 'block'});
    $toOpenCloseSearchPopoverInput._effect($searchPopover, 0.5, {top: '0%', alpha: 1});
    setTimeout(function() {
        $searchMainInput.focus();
        adjustFindResultSize();

    }, 300);
    lockBodyForSearch(true);
}

function searchPopoverClose() {

    $toOpenCloseSearchPopoverButton.html(srt(m.openSearch));
    $toOpenCloseSearchPopoverContainer.removeClass('expanded');

    $toOpenCloseSearchPopoverInput._effect($searchPopover, 0.5, {top: '-105px', alpha: 0});
    $toOpenCloseSearchPopoverInput._effect($searchPopover, 0.1, {display: 'none'});
    lockBodyForSearch(false);

}

function searchPopoverManage() {

    if (!flagPreventDuplicate) {

        flagPreventDuplicate = true;

        if ($toOpenCloseSearchPopoverContainer.hasClass('expanded')) {
            searchPopoverClose();
        } else {
            searchPopoverOpen();
        }

        setTimeout(function() {
            flagPreventDuplicate = false;
        }, 100); // some time so this is not called twice

    }

}

function searchPopoverCloseAndFocus() {
    searchPopoverClose();
    setTimeout(function() {
        $("#main-content").focus();
    }, 100);
}

// accessibility main searcher
function searchKeyboardAccessibilityEvents() {

    $(document).on('keydown', function(e){

        var $resultsSearch = $("#results ul li");

        // Close search box

        // Press ESC
        if(e.which == 27 && $(document.activeElement).closest('#fullfind').length>0) {
            searchPopoverCloseAndFocus();
        }

        // Tab (exit from right)
        if (e.which == 9 && !e.shiftKey) {
            // No search made
            if ($(document.activeElement).attr('id') == "search-popover-btn" && $("#no-results").length == 0 && ($resultsSearch.length == 0)) {
                searchPopoverCloseAndFocus();
            }
            // Search no results
            if ($(document.activeElement).attr('id') == "no-results") {
                searchPopoverCloseAndFocus();
            }
            // Search results (no paginate button)
            if ($("#view-more-button:visible").length == 0 && $(document.activeElement).parent().get(0) == $resultsSearch.last().get(0)) {
                searchPopoverCloseAndFocus();
            }
            // Search results (paginate button)
            if ($(document.activeElement).attr('id') == "view-more-button") {
                searchPopoverCloseAndFocus();
            }
        }

        // Tab (exit from left)
        if (e.which == 9 && e.shiftKey) {
            if ($(document.activeElement).attr('id')=="search-popover-input") {
                setTimeout(function() { $("header.prima nav ul li:last-child a").focus(); }, 50);
            }
        }

    });

}

// search mobile
function toSearchMainMobile() {

    mobileSearch.off().on('click', function(){

        if ($toOpenCloseSearchPopoverContainer.hasClass('expanded')) {

            $toOpenCloseSearchPopoverInput.removeAttr('disabled');
            $toOpenCloseSearchPopoverContainer.removeClass('expanded');
            $(this)._effect($toOpenCloseSearchPopoverInput, 0.5, {width: '100px', background: '#e5e5e3'});


            $(this)._effect($searchPopover, 0.5, {top: '-105px', alpha: 0});
            $(this)._effect($searchPopover, 0.1, {display: 'none'});
            lockBodyForSearch(false);
        }
        else {
            $toOpenCloseSearchPopoverInput.attr('disabled','disabled');
            $toOpenCloseSearchPopoverContainer.addClass('expanded');
            $(this)._effect($toOpenCloseSearchPopoverInput, 0.5, {width: '20px', background: '#ca1010'});

            $(this)._effect($searchPopover, 0.1, {display: 'block'});
            $(this)._effect($searchPopover, 0.5, {top: '0%', alpha: 1});
            setTimeout(function() {
                $searchMainInput.focus();
                $searchMainInput.click();
                $searchMainInput.select();
                adjustFindResultSize();

            }, 300);
            lockBodyForSearch(true);
        }

        return false;
    });

}

// auxiliars
function srt(message) {
    return "<span class='srt'>" + message + "</span>";
}

function lockBodyForSearch(lock) {
    if(lock) {
        $("body").css("overflow", "hidden");
        $searchResultsContainerWrapper.css("overflow", "auto");

    } else {
        $("body").css("overflow", "auto");

        $searchResultsContainerWrapper.css("overflow", "hidden");
    }
}

function adjustFindResultSize() {
    var ffH = $searchPopover.height();
    var fhH = $searchPopoverHeader.height();
    var mustH = ffH - fhH - 20;
    $searchResultsContainerWrapper.height(mustH);
}

function preventSearchToBeOpenOnTabSwitch() {

    window.onfocus = function(event) {

        if(event.explicitOriginalTarget===window){
            flagPreventDuplicate = true;
            setTimeout(function() {
                flagPreventDuplicate = false;
            }, 500);
        }
    }

}