//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require_tree .

var HEIGHT;
var WIDTH;
var MINES;
var CELLS;
var MINESCOUNT;
var GAMERUNNING;

$(function() {

  function setLevel() {
    var anchor = window.location.hash
    if (anchor == "" || anchor == "#Intermediate") {
      $('#level').attr('level', 'Intermediate');
      HEIGHT = 16;
      WIDTH = 16;
      MINES = 40;
    }
    else if (anchor == "#Beginner") {
      $('#level').attr('level', 'Beginner');
      HEIGHT = 9;
      WIDTH = 9;
      MINES = 10;
    }
    else if (anchor == "#Expert") {
      $('#level').attr('level', 'Expert');
      HEIGHT = 16;
      WIDTH = 30;
      MINES = 99;
    }
    else {
    };
    CELLS = HEIGHT * WIDTH;
  };

  function displayRankings() {
    var level = $('#level').attr('level');
    if (level == "Beginner") {
      $('#beginners').removeClass('hidden');
      $('#intermediates').addClass('hidden');
      $('#experts').addClass('hidden');
    };
    if (level == "Intermediate") {
      $('#beginners').addClass('hidden');
      $('#intermediates').removeClass('hidden');
      $('#experts').addClass('hidden');
    };
    if (level == "Expert") {
      $('#beginners').addClass('hidden');
      $('#intermediates').addClass('hidden');
      $('#experts').removeClass('hidden');
    };
  };

  function generateGrid() {
    var row = 0;
    var column = 0;
    $('.game').css("width", WIDTH*25+'px');
    $('#level').css("height", (HEIGHT*25)+4+'px');
    $('.leaderboard').css("height", (HEIGHT*25)+4+'px');
    $('.score').css("height", (HEIGHT*25)+4+'px');
    for(var i = 0; i < HEIGHT; i++) {
      row ++;
      $('#minesweeper').append("<tr class='row-" + row + "'></tr>");
    };
    for(var i = 0; i < WIDTH; i++) {
      column ++;
      $('#minesweeper tr').append("<td class='col-" + column + "'></td>");
    };
    $('#minesweeper tr').each(function() {
      var tr = $(this);
      var rowColumn = tr.attr('class').match(/row-(\d+)/)[1];

      tr.find('td').each(function() {
        var tr = $(this);
        tr.attr('mines', 0);
        tr.addClass('row-' + rowColumn);
      });
    });
    $('#minesweeper td').addClass('unopened');
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
      $('#minesweeper td').eq(num).addClass('mine');
    });
    MINESCOUNT = MINES
    $('.minescount').html(MINESCOUNT);
  };

  function setFreecells() {
    $('#minesweeper td.mine').each(function(index) {
      var tdRow     = parseInt($(this).attr('class').match(/row-(\d+)/)[1],10);
      var tdColumn  = parseInt($(this).attr('class').match(/col-(\d+)/)[1],10);

      var tdNext1 = $('#minesweeper td.row-' + (tdRow - 1) + '.col-' + (tdColumn - 1));
      var tdNext2 = $('#minesweeper td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 0));
      var tdNext3 = $('#minesweeper td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 1));
      var tdNext4 = $('#minesweeper td.row-' + (tdRow + 0) + '.col-' + (tdColumn - 1));
      var tdNext5 = $('#minesweeper td.row-' + (tdRow + 0) + '.col-' + (tdColumn + 1));
      var tdNext6 = $('#minesweeper td.row-' + (tdRow + 1) + '.col-' + (tdColumn - 1));
      var tdNext7 = $('#minesweeper td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 0));
      var tdNext8 = $('#minesweeper td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 1));

      tdNext1.attr('mines', parseInt(tdNext1.attr('mines')) + 1);
      tdNext2.attr('mines', parseInt(tdNext2.attr('mines')) + 1);
      tdNext3.attr('mines', parseInt(tdNext3.attr('mines')) + 1);
      tdNext4.attr('mines', parseInt(tdNext4.attr('mines')) + 1);
      tdNext5.attr('mines', parseInt(tdNext5.attr('mines')) + 1);
      tdNext6.attr('mines', parseInt(tdNext6.attr('mines')) + 1);
      tdNext7.attr('mines', parseInt(tdNext7.attr('mines')) + 1);
      tdNext8.attr('mines', parseInt(tdNext8.attr('mines')) + 1);
    });

    $('#minesweeper td:not(.mine)').each(function() {
      $(this).addClass('mine-neighbour-' + parseInt($(this).attr('mines')));
    });
    $('#minesweeper td').removeAttr('mines');
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
    var td = $('#minesweeper td.row-' + row + '.col-' + index + '.unopened');
    td.removeClass('unopened');
    revealNeighbourCells(td);
  };

  function revealManually(td) {
    var tdRow       = parseInt(td.attr('class').match(/row-(\d+)/)[1],10);
    var tdColumn    = parseInt(td.attr('class').match(/col-(\d+)/)[1],10);
    var tdMineCount = parseInt(td.attr('class').match(/mine-neighbour-(\d)/)[1],10);

    var tdNext1 = $('#minesweeper td.row-' + (tdRow - 1) + '.col-' + (tdColumn - 1));
    var tdNext2 = $('#minesweeper td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 0));
    var tdNext3 = $('#minesweeper td.row-' + (tdRow - 1) + '.col-' + (tdColumn + 1));
    var tdNext4 = $('#minesweeper td.row-' + (tdRow + 0) + '.col-' + (tdColumn - 1));
    var tdNext5 = $('#minesweeper td.row-' + (tdRow + 0) + '.col-' + (tdColumn + 1));
    var tdNext6 = $('#minesweeper td.row-' + (tdRow + 1) + '.col-' + (tdColumn - 1));
    var tdNext7 = $('#minesweeper td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 0));
    var tdNext8 = $('#minesweeper td.row-' + (tdRow + 1) + '.col-' + (tdColumn + 1));

    var checker = 0
    if(tdNext1.hasClass('flagged')) {checker++};
    if(tdNext2.hasClass('flagged')) {checker++};
    if(tdNext3.hasClass('flagged')) {checker++};
    if(tdNext4.hasClass('flagged')) {checker++};
    if(tdNext5.hasClass('flagged')) {checker++};
    if(tdNext6.hasClass('flagged')) {checker++};
    if(tdNext7.hasClass('flagged')) {checker++};
    if(tdNext8.hasClass('flagged')) {checker++};

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
    if (!$('#minesweeper td:not(.mine)').hasClass('unopened') && !$('#minesweeper td:not(.mine)').hasClass('flagged')) {
      $('#minesweeper td.mine').removeClass('unopened.mine').addClass('flagged');
      $('.minescount').html('0');
      $('#play #smiley').removeClass('game');
      $('#play #smiley').addClass('winner');
      $('#time').timer('pause');
      $('.score').removeClass('hidden');
      $('#your-score').attr('value', ($('#time').html()));
      $('#your-level').attr('value', ($('#level').attr('level')));
      $('#no').on("click", function() {
        $('.score').addClass('hidden');
      });
      GAMERUNNING = false;
    };
  };

  function looser(td) {
    if ($(td).hasClass('mine')) {
      $('#minesweeper td.mine').removeClass('unopened');
      $(td).addClass('boom');
      $('#play #smiley').removeClass('game');
      $('#play #smiley').addClass('looser');
      $('#minesweeper td:not(.mine).flagged').addClass('wrongflagged');
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
      $('#minesweeper td:not(.mine).flagged').addClass('wrongflagged');
      $('#time').timer('pause');
      GAMERUNNING = false;
    };
  };

  function play() {
    GAMERUNNING = true;
    $('#minesweeper td').on("click", function() {
      var td = $(this);
      if (td.hasClass("unopened")) {
        if (GAMERUNNING) {
          if ($('#minesweeper td:not(.unopened)')) {
            $('#time').timer({format: '%M:%S'});
          }
          td.removeClass('unopened');
          revealNeighbourCells(td);
          looser(td);
          winner();
        };
      };
    });
    $('#minesweeper td').bind("contextmenu",function(){
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

  $(window).load(setLevel(), displayRankings(), generateGrid(), setBombcells(), setFreecells(), play());

  $('#play').on('click', function() {
    $('#minesweeper tr').remove();
    $('#play #smiley').removeClass();
    $('#play #smiley').addClass('new-game');
    $('#time').timer('remove').html('00:00');
    $('.score').addClass('hidden');
    $('#your-name').removeClass('error');
    $('#your-name').attr("placeholder", "Type your name here");
    generateGrid();
    setBombcells();
    setFreecells();
    play();
  });

  $('.new-settings').on('click', function() {
    $('#minesweeper tr').remove();
    $('.settings-displayed').toggleClass('hidden');
    $('.game-displayed').toggleClass('hidden');
    $('#play #smiley').removeClass();
    $('#play #smiley').addClass('new-game');
    $('#time').timer('remove').html('00:00');
    $('.score').addClass('hidden');
    $('#your-name').removeClass('error');
    $('#your-name').attr("placeholder", "Type your name here");
    level = $(this).html();
    $('#level').attr('level',level);
    window.location.hash = level;
    setLevel();
    displayRankings();
    generateGrid();
    setBombcells();
    setFreecells();
    play();
  });

  $('.rankings-button').on('click', function() {
    $('.rankings-displayed').toggleClass('hidden');
    $('.game-displayed').toggleClass('hidden');
  });

  $('.settings-button').on('click', function() {
    $('.settings-displayed').toggleClass('hidden');
    $('.game-displayed').toggleClass('hidden');
  });

  $('#save-score').on('click', function(event){
    event.preventDefault();
    var name = $('#your-name').val();

    if (window.location.hash == '') {
      var level = 'Intermediate';
    }
    else {
      var level = window.location.hash.match(/[a-zA-Z]+/)[0];
    }

    var time = $('#time').data('seconds');
    var s = Math.floor(time % 60);
    var m = Math.floor((time / 60) % 60);
    var h = Math.floor(time / 3600);
    if (s < 10) {
      var sec = '0'+ s.toString();
    }
    else {
      var sec = s.toString();
    }
    if (m < 10) {
      var min = '0'+ m.toString();
    }
    else {
      var min = m.toString();
    }
    var score = min + ':' + sec;

    if (name == '') {
      $('#your-name').attr("placeholder", "Don't be shy!");
      $('#your-name').addClass('error');
    }
    else {
      $.ajax({
        type: "POST",
        url: "/games",
        data: {
          "game[name]": name,
          "game[score]": score,
          "game[level]": level
        },
        success: function(data) {
          $('.score').addClass('hidden');
        }
      });
    };
  });

});
