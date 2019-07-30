$(document).ready(function () {

  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click', '.option', trivia.guessChecker);

})

var trivia = {
  // trivia parameters
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 15,
  timerOn: false,
  timerId: '',
  // data
  questions: {
    q1: 'The Simpsons originally appeared as a short on what TV show?',
    q2: 'Who founded Springfield?',
    q3: 'What part of the opening credits is different almost every week?',
    q4: 'What are the annual Halloween episodes known as?',
    q5: "Which of the following is not a Bart Simpson catch-phrase?",
    q6: "What are the names of Marge's cynical twin sisters?'",
    q7: " What is the name of Ned Flander's store at the Springfield Mall?",

  },
  options: {
    q1: ['MATT GROENINGS AMERICAN FAMILY', 'DR. N!GODATU', 'MARRIED WITH CHILDREN', 'THE TRACY ULLMAN SHOW'],
    q2: ['HANS SPRINGFIELD', 'JEBEDIAH SPRINGFIELD', 'ABRAHAM SIMPSON', 'SHELBYVILLE MANHATTAN'],
    q3: ['HOMER DRIVING', 'BART SKATEBOARDING', 'FAMILY ON THE COUCH', 'MARGE AT THE GROCERY STORE'],
    q4: ['DOH OF THE DEAD', 'NIGHTMARE ON EVERGREEN TERRACE', 'TREEHOUSE OF HORROR', 'THE DAY SPRINGFIELD STOOD STILL'],
    q5: ['HA-HA!', 'DONT HAVE A COW, MAN!', 'AY, CARAMBA!', 'EAT MY SHORTS!'],
    q6: ['MARGARET & BETTY', 'PATTY & SELMA', 'MARTY & THELMA', 'THELMA & LOUISE'],
    q7: ['THE HI-DIDDILY-HO-MART', 'THE INDEEDILY-DOODILY', 'THE LEFTORIUM', 'BIBLE BLASTER']
  },
  answers: {
    q1: 'THE TRACY ULLMAN SHOW',
    q2: 'JEBEDIAH SPRINGFIELD',
    q3: 'FAMILY ON THE COUCH',
    q4: 'TREEHOUSE OF HORROR',
    q5: 'HA-HA!',
    q6: 'PATTY & SELMA',
    q7: 'THE LEFTORIUM'
  },
  // trivia methods
  startGame: function () {
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);

    // show game section
    $('#game').show();

    //  empty last results
    $('#results').html('');

    // show timer
    $('#timer').text(trivia.timer);

    // remove start button
    $('#start').hide();

    $('#remaining-time').show();

    // ask first question
    trivia.nextQuestion();

  },
  // method to loop through and display questions and options 
  nextQuestion: function () {

    // set timer to 20 seconds each question
    trivia.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);

    // to prevent timer speed up
    if (!trivia.timerOn) {
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }

    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);

    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];

    // creates all the trivia guess options in the html
    $.each(questionOptions, function (index, key) {
      $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
    })

  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning: function () {
    // if timer still has time left and there are still questions left to ask
    if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
      $('#timer').text(trivia.timer);
      trivia.timer--;
      if (trivia.timer === 4) {
        $('#timer').addClass('last-seconds');
      }
    }
    // the time has run out and increment unanswered, run result
    else if (trivia.timer === -1) {
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if (trivia.currentSet === Object.keys(trivia.questions).length) {

      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Eat my shorts! Thanks for Playing!</h3>' +
          '<p>Correct: ' + trivia.correct + '</p>' +
          '<p>Incorrect: ' + trivia.incorrect + '</p>' +
          '<p>Unaswered: ' + trivia.unanswered + '</p>' +
          '<p>You Suck Please Do not Try again</p>');

      // hide game sction
      $('#game').hide();

      // show start button to begin a new game
      $('#start').show();
    }

  },
  // method to evaluate the option clicked
  guessChecker: function () {

    // timer ID for gameResult setTimeout
    var resultId;

    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

    // if the text of the option picked matches the answer of the current question, increment correct
    if ($(this).text() === currentAnswer) {
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');

      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else {
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');

      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Eat my shorts! Thanks for Playing! ' + currentAnswer + '</h3>');
    }

  },
  // method to remove previous question results and options
  guessResult: function () {

    // increment to next question set
    trivia.currentSet++;

    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();

    // begin next question
    trivia.nextQuestion();

  }

}