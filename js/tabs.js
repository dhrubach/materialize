(function ($) {

  var methods = {
    init: function () {
      return this.each(function () {

        // For each set of tabs, we want to keep track of
        // which tab is active and its associated content
        var $this = $(this),
            window_width = $(window).width();

        $this.width('100%');
        var $active, $content, $links = $this.find('li.tab a'),
            $tabs_width = $this.width(),
            $tab_width = $this.find('li').first().outerWidth(),
            $index = 0;

        // If the location.hash matches one of the links, use that as the active tab.
        $active = $($links.filter('[href="' + location.hash + '"]'));

        // If no match is found, use the first link or any with class 'active' as the initial active tab.
        if ($active.length === 0) {
          $active = $(this).find('li.tab a.active').first();
        }
        if ($active.length === 0) {
          $active = $(this).find('li.tab a').first();
        }

        $active.addClass('active');
        $index = $links.index($active);
        if ($index < 0) {
          $index = 0;
        }

        /* jQuery Sizzle fails with 'unrecognized expression' error message
         * if the value of href attribute in <a/> elements contains a '/'. This happens
         * when tab elements are updated to keep those in sync with location.hash
         */
        var $content_selector = normalize_hash($active[0].hash);
        $content = $($content_selector);

        // append indicator then set indicator width to tab width
        $this.append('<div class="indicator"></div>');
        var $indicator = $this.find('.indicator');
        if ($this.is(":visible")) {
          $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
          $indicator.css({"left": $index * $tab_width});
        }
        $(window).resize(function () {
          $tabs_width = $this.width();
          $tab_width = $this.find('li').first().outerWidth();
          if ($index < 0) {
            $index = 0;
          }
          if ($tab_width !== 0 && $tabs_width !== 0) {
            $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
            $indicator.css({"left": $index * $tab_width});
          }
        });

        // Hide the remaining content
        $links.not($active).each(function () {
          $content_selector = normalize_hash(this.hash);
          $($content_selector).hide();
        });


        // Bind the click event handler
        $this.on('click', 'a', function (e) {
          if ($(this).parent().hasClass('disabled')) {
            e.preventDefault();
            return;
          }

          $tabs_width = $this.width();
          $tab_width = $this.find('li').first().outerWidth();

          // Make the old tab inactive.
          $active.removeClass('active');
          $content.hide();

          // Update the variables with the new link and content
          $active = $(this);
          $content = $(normalize_hash(this.hash));
          $links = $this.find('li.tab a');

          // Make the tab active.
          $active.addClass('active');
          var $prev_index = $index;
          $index = $links.index($(this));
          if ($index < 0) {
            $index = 0;
          }
          // Change url to current tab
          // window.location.hash = $active.attr('href');

          $content.show();

          // Update indicator
          if (($index - $prev_index) >= 0) {
            $indicator.velocity({"right": $tabs_width - (($index + 1) * $tab_width)}, {
              duration: 300,
              queue: false,
              easing: 'easeOutQuad'
            });
            $indicator.velocity({"left": $index * $tab_width}, {
              duration: 300,
              queue: false,
              easing: 'easeOutQuad',
              delay: 90
            });

          }
          else {
            $indicator.velocity({"left": $index * $tab_width}, {duration: 300, queue: false, easing: 'easeOutQuad'});
            $indicator.velocity({"right": $tabs_width - (($index + 1) * $tab_width)}, {
              duration: 300,
              queue: false,
              easing: 'easeOutQuad',
              delay: 90
            });
          }

          // Prevent the anchor's default click action
          e.preventDefault();
        });
      });

    },
    select_tab: function (id) {
      this.find('a[href="#' + id + '"]').trigger('click');
    }
  };

  $.fn.tabs = function (methodOrOptions) {
    if (methods[methodOrOptions]) {
      return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
      // Default to "init"
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + methodOrOptions + ' does not exist on jQuery.tooltip');
    }
  };

  function normalize_hash(hash) {
    if (hash.indexOf('#/') !== -1) {
      var href = hash.split('#/').splice(1);
      return ('#' + href);
    }
    return hash;
  }

  $(document).ready(function () {
    $('ul.tabs').tabs();
  });
}( jQuery ));
