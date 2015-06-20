//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require_tree .

var HEIGHT = 16;
var WIDTH = 16;
var MINES = 1;
var CELLS = HEIGHT * WIDTH;
var MINESCOUNT = MINES
var GAMERUNNING = true;

$(function() {

  function generateGrid() {
    var row = 0;
    var column = 0;
    $('.game').css("width", WIDTH*25+'px');
    $('#level').css("width", WIDTH*25+'px');
    $('#level').css("height", (HEIGHT*25)+4+'px'); //WTF ?? Je ne comprends pas pourquoi je dois ajouter 4px de plus...
    for(var i = 0; i < HEIGHT; i++) {
      row ++;
      $('table#minesweeper').append("<tr class='row-" + row + "'></tr>");
    };
    for(var i = 0; i < WIDTH; i++) {
      column ++;
      $('table#minesweeper tr').append("<td class='col-" + column + "'></td>");
    };
    $('table#minesweeper tr').each(function() {
      var tr = $(this);
      var rowColumn = tr.attr('class').match(/row-(\d+)/)[1];

      tr.find('td').each(function() {
        var tr = $(this);
        tr.attr('mines', 0)
        tr.addClass('row-' + rowColumn);
      });
    });
    $('td').addClass('unopened');
  };

  function setBombcells() {
    var array = []
    while(array.length < MINES){
      var randomNumber = Math.ceil(Math.random()*CELLS)
      var found = false;
      for(var i = 0; i < array.length; i++) {
        if(array[i] == randomNumber) {
          found = true;break
        }
      }
      if(!found)array[array.length]=randomNumber;
    };
    $(array).each(function(index, num) {
      $('td').eq(num).addClass('mine');
    });
    $('.minescount').html(MINESCOUNT);
  };

  function setFreecells() {
    $('td.mine').each(function(index) {
      var tdRow     = parseInt($(this).attr('class').match(/row-(\d+)/)[1],10);
      var tdColumn  = parseInt($(this).attr('class').match(/col-(\d+)/)[1],10);

      var tdNext1 = $('td.row-' + (tdRow - 1) + '.col-' + (tdColumn - 1));
      var tdNext2 = $('td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 0));
      var tdNext3 = $('td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 1));
      var tdNext4 = $('td.row-' + (tdRow + 0) + '.col-' + (tdColumn - 1));
      var tdNext5 = $('td.row-' + (tdRow + 0) + '.col-' + (tdColumn + 1));
      var tdNext6 = $('td.row-' + (tdRow + 1) + '.col-' + (tdColumn - 1));
      var tdNext7 = $('td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 0));
      var tdNext8 = $('td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 1));

      tdNext1.attr('mines', parseInt(tdNext1.attr('mines')) + 1);
      tdNext2.attr('mines', parseInt(tdNext2.attr('mines')) + 1);
      tdNext3.attr('mines', parseInt(tdNext3.attr('mines')) + 1);
      tdNext4.attr('mines', parseInt(tdNext4.attr('mines')) + 1);
      tdNext5.attr('mines', parseInt(tdNext5.attr('mines')) + 1);
      tdNext6.attr('mines', parseInt(tdNext6.attr('mines')) + 1);
      tdNext7.attr('mines', parseInt(tdNext7.attr('mines')) + 1);
      tdNext8.attr('mines', parseInt(tdNext8.attr('mines')) + 1);
    });

    $('td:not(.mine)').each(function() {
      $(this).addClass('mine-neighbour-' + parseInt($(this).attr('mines')));
    });
    $('td').removeAttr('mines');
  };

  function revealNeighbourCells(td) {
    if(td.hasClass("mine-neighbour-0")) {
      var tdRow     = parseInt(td.attr('class').match(/row-(\d+)/)[1],10);
      var tdColumn  = parseInt(td.attr('class').match(/col-(\d+)/)[1],10);

      exploreCell(tdRow - 1, tdColumn - 1);
      exploreCell(tdRow - 1, tdColumn + 0);
      exploreCell(tdRow - 1, tdColumn + 1);
      exploreCell(tdRow + 0, tdColumn - 1);
      exploreCell(tdRow + 0, tdColumn + 1);
      exploreCell(tdRow + 1, tdColumn - 1);
      exploreCell(tdRow + 1, tdColumn + 0);
      exploreCell(tdRow + 1, tdColumn + 1);
    }
  };

  function exploreCell(row, index) {
    var td = $('td.row-' + row + '.col-' + index + '.unopened');
    td.removeClass('unopened');
    revealNeighbourCells(td);
  };

  function revealManually(td) {
    var tdRow       = parseInt(td.attr('class').match(/row-(\d+)/)[1],10);
    var tdColumn    = parseInt(td.attr('class').match(/col-(\d+)/)[1],10);
    var tdMineCount = parseInt(td.attr('class').match(/mine-neighbour-(\d)/)[1],10);

    var tdNext1 = $('td.row-' + (tdRow - 1) + '.col-' + (tdColumn - 1));
    var tdNext2 = $('td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 0));
    var tdNext3 = $('td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 1));
    var tdNext4 = $('td.row-' + (tdRow + 0) + '.col-' + (tdColumn - 1));
    var tdNext5 = $('td.row-' + (tdRow + 0) + '.col-' + (tdColumn + 1));
    var tdNext6 = $('td.row-' + (tdRow + 1) + '.col-' + (tdColumn - 1));
    var tdNext7 = $('td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 0));
    var tdNext8 = $('td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 1));

    var checker = 0
    if(tdNext1.hasClass('flagged')) {checker++}
    if(tdNext2.hasClass('flagged')) {checker++}
    if(tdNext3.hasClass('flagged')) {checker++}
    if(tdNext4.hasClass('flagged')) {checker++}
    if(tdNext5.hasClass('flagged')) {checker++}
    if(tdNext6.hasClass('flagged')) {checker++}
    if(tdNext7.hasClass('flagged')) {checker++}
    if(tdNext8.hasClass('flagged')) {checker++}

    if (tdMineCount == checker) {
      tdNext1.not('.flagged').removeClass('unopened');
      tdNext2.not('.flagged').removeClass('unopened');
      tdNext3.not('.flagged').removeClass('unopened');
      tdNext4.not('.flagged').removeClass('unopened');
      tdNext5.not('.flagged').removeClass('unopened');
      tdNext6.not('.flagged').removeClass('unopened');
      tdNext7.not('.flagged').removeClass('unopened');
      tdNext8.not('.flagged').removeClass('unopened');
    }

    revealNeighbourCells(tdNext1);
    revealNeighbourCells(tdNext2);
    revealNeighbourCells(tdNext3);
    revealNeighbourCells(tdNext4);
    revealNeighbourCells(tdNext5);
    revealNeighbourCells(tdNext6);
    revealNeighbourCells(tdNext7);
    revealNeighbourCells(tdNext8);

    looserViaReveal(tdNext1);
    looserViaReveal(tdNext2);
    looserViaReveal(tdNext3);
    looserViaReveal(tdNext4);
    looserViaReveal(tdNext5);
    looserViaReveal(tdNext6);
    looserViaReveal(tdNext7);
    looserViaReveal(tdNext8);
  }

  function winner() {
    if (!$('td:not(.mine)').hasClass('unopened') && !$('td:not(.mine)').hasClass('flagged')) {
      $('td.mine').removeClass('unopened.mine').addClass('flagged');
      $('.minescount').html('0');
      $('#play #smiley').removeClass('game');
      $('#play #smiley').addClass('winner');
      $('#time').timer('pause');
      GAMERUNNING = false;
    };
  };

  function looser(td) {
    if ($(td).hasClass('mine')) {
      $('td.mine').removeClass('unopened');
      $(td).addClass('boom');
      $('#play #smiley').removeClass('game');
      $('#play #smiley').addClass('looser');
      $('td.mine').removeClass('unopened');
      $('td:not(.mine).flagged').addClass('wrongflagged');
      $('#time').timer('pause');
      GAMERUNNING = false;
    };
  };

  function looserViaReveal(td) {
    if ($(td).hasClass('mine.flagged') || $('td').not('.unopened').not('.flagged').hasClass('mine')) {
      $(td).addClass('boom');
      $('#play #smiley').removeClass('game');
      $('#play #smiley').addClass('looser');
      $('td.mine').removeClass('unopened');
      $('td:not(.mine).flagged').addClass('wrongflagged');
      $('#time').timer('pause');
      GAMERUNNING = false;
    };
  };

  function play() {
    $('td').on("click", function() {
      var td = $(this);
      if (td.hasClass("unopened")) {
        if (GAMERUNNING) {
          if ($('td:not(.unopened)')) {
            $('#time').timer({format: '%M:%S'});
          }
          td.removeClass('unopened');
          revealNeighbourCells(td);
          looser(td);
          winner();
        };
      };
    });
    $('td').bind("contextmenu",function(){
      if (GAMERUNNING) {
        var td = $(this)
        if (td.hasClass('unopened')) {
          td.removeClass('unopened');
          td.addClass('flagged');
          MINESCOUNT --;
          $('.minescount').html(MINESCOUNT);
          return false;
        }
        else if (td.hasClass('flagged')) {
          td.removeClass('flagged');
          td.addClass('question');
          MINESCOUNT ++;
          $('.minescount').html(MINESCOUNT);
          return false;
        }
        else if (td.hasClass('question')) {
          td.removeClass('question');
          td.addClass('unopened');
          return false;
        }
        else {
          revealManually(td);
          winner();
          return false;
        };
      }
       else {
        return false;
      };
    });
  };

  $(window).load(generateGrid(), setBombcells(), setFreecells(), play());

  $('#play').on('click', function() {
    $('tr').remove();
    $('#play #smiley').removeClass();
    $('#play #smiley').addClass('new-game');
    $('#time').timer('remove').html('00:00');
    GAMERUNNING = true;
    MINESCOUNT = MINES
    generateGrid();
    setBombcells();
    setFreecells();
    play();
  });

  $('.new-settings').on('click', function() {
    $('tr').remove();
    $('.settings-displayed').toggleClass('hidden');
    $('.game-displayed').toggleClass('hidden');
    $('#play #smiley').removeClass();
    $('#play #smiley').addClass('new-game');
    $('#time').timer('remove').html('00:00');
    var btn = $(this).attr('class')
    HEIGHT = parseInt(btn.match(/row-(\d+)/)[1],10);
    WIDTH  = parseInt(btn.match(/col-(\d+)/)[1],10);
    MINES  = parseInt(btn.match(/mines-(\d+)/)[1],10);
    CELLS = HEIGHT * WIDTH;
    MINESCOUNT = MINES
    GAMERUNNING = true;
    generateGrid();
    setBombcells();
    setFreecells();
    play();
  });

  $('.settings-button').on('click', function() {
    $('.settings-displayed').toggleClass('hidden');
    $('.game-displayed').toggleClass('hidden');
  });
});
