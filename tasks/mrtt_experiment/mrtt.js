/* create timeline */
var timeline = [];

/* define welcome message trial */
// var welcome_block = {
//     type: "html-keyboard-response",
//     stimulus: "Welcome to the experiment. Press any key to begin."
// };
// timeline.push(welcome_block);

/* define instructions trial */
var instructions1 = {
    type: "html-keyboard-response",
    stimulus:      '<div class = centerbox><p class = block-text>  This task is a social interaction task for two players, whose roles are' +
        ' called <strong>investor</strong> and <strong>trustee</strong>. You will be playing with <strong>one partner</strong> in this game. Your role for this game will be the ' +
        '<strong>investor</strong> and your partner’s role will be the <strong>trustee</strong>. You will both stay in the same role for the entire game. You will not meet your partner at any time during the session. </p>' +
        '<p class = block-text> The game will consist of <strong>10</strong> identical rounds, with each round consisting of 2 phases.  In the first phase, you (as the <string>investor</strong>)' +
        ' will receive <strong>20</strong> monetary units. You will then decide how much to keep and how much to invest.  The <strong>kept</strong> portion is automatically added to your total; the invested portion will be set aside for the second phase of the game.</p>' +
        '<p class = block-text> For the second phase, the amount you invest will be multiplied by <strong>3</strong> and put into your partner\'s (the trustee\'s) control.  Your partner must then decide ' +
        'how much he/she keeps and how much he/she returns to you.  The results of this choice will be displayed, followed by the total results for the entire round.  </p>' +
        '<p class = block-text> After ten rounds have been completed, the experiment will be done.  The totals earned during the experiment will be calculated, and you and your partner will be paid based upon your earnings for' +
        ' the entire task. In addition to the participation fee ($0.40),' +
        ' you will receive an additional bonus of $0.01 for every monetary unit that you earn.</p>' +
        '<p class = center-block-text>Press <strong>space</strong> to continue.</p></div>',
    choices: [32]
};

var instructions2 = {
    type: "html-keyboard-response",
    stimulus: '<div class = centerbox>' +
        '<p class = block-text>You are the investor, so you will choose how much of the money to keep, and how much to invest between <strong>0</strong> and <strong>20</strong> units.</p>' +
        '<p class = block-text>For example, you can chose to keep <strong>10</strong> monetary units and invest <strong>10</strong> monetary units:</p>' +
        '<img style="width: 80%;" src="images/sample_invest.png">' +
        '<p class = block-text>' +
        ' In the actual game you will be able to move the slidebar to choose the amount that you want to invest. ' +
        'Remember that the amount that you invest will be tripled and sent to your partner ' +
        ' to make the next choice. In this example, you invested <strong>10</strong> units, which will be multiplied by <strong>3</strong> to become <strong>30</strong>' +
        ' received by your partner.' +
        '</p>' +
        '<p class = center-block-text>Press <strong>space</strong> to continue.</p></div>' ,
    choices: [32]
};

var instructions3 = {
    type: "html-keyboard-response",
    stimulus: '<div class = centerbox>' +
        '<p class = block-text>Now it is turn for your partner to repay. Your partner will get to decide how much of that <strong>30</strong> units to repay back to you.</p>' +
        '<p class = block-text>You will not get to see them move the slider bar while they are making their choice. ' +
        'But you will get to see the amount of money they repaid to you and the amount that they kept after their choice is made. In this case, your partner kept ' +
        '<strong>24</strong> units and repaid <strong>6</strong> units to you. So you earned <strong>16</strong> units this round,' +
        ' from the 10 you kept and the 6 you were repaid.' +
        ' Your partner earned <strong>24</strong> units. </p>' +
        '<p class = block-text>You will continue playing the same game as the investor with the same partner for <strong>10</strong> rounds.</p>' +
        '<p class = block-text>After ten rounds have been completed, the experiment will be done. The totals earned during the\n' +
            'experiment will be calculated, and you and your partner will be paid based upon your earnings for the entire task. ' +
        'In addition to the participation fee ($0.40),' +
        ' you will receive an additional bonus of $0.01 for every monetary unit that you earn. </p>' +
        '<p class = center-block-text>Press <strong>space</strong> to continue.</p></div>' ,
    choices: [32]
};


var correct_answers = true;
var total_wrongs = 0;

var multi_choice_block = {
    type: 'survey-multi-choice',
    preamble:'<p class = block-text>Now, you will be tested on the game instructions. You will be able to play the game only if you answer all the questions correctly.</p>',
        questions: [
        {prompt: "Q1: You have decided to pay 15 units to your partner. How much does your partner receive?",
            name: 'Q1', options: ['45', '30', '15'], required:true},
        {prompt: "Q2: In this task, every round you will be playing with a different partner.", name: 'Q2',
            options: ['True', 'False'], required: true}
    ],
    on_finish: function(data){
        correct_answers = JSON.parse(data['responses'])["Q1"] === "45" && JSON.parse(data['responses'])["Q2"] === "False";
        if (!correct_answers){
            total_wrongs = total_wrongs + 1;
        }
    }
};

var incorrect_answers = {
    type: "html-keyboard-response",
    stimulus: '<div class = centerbox><p class = center-block-text> Some of your answers were wrong. Please read the ' +
        'instructions carefully. </p>' +
        '<p class = center-block-text>Press <strong>space</strong> to read the instructions.</p></div>',
    choices: [32]
};

var if_incorrect_answers = {
    timeline: [incorrect_answers],
    conditional_function: function(){
        return !correct_answers;
    }
};


var training_loop = {
    timeline: [if_incorrect_answers, instructions1, instructions2, instructions3, multi_choice_block],
    loop_function: function (data) {
        return !(correct_answers || total_wrongs > 2);
    }
};

timeline.push(training_loop);

var investment_amount = 0;
var last_repay = 0;
var total_earnings = 0;

slide_labels = [];
for (i = 0; i < 21; i+=5) {
    slide_labels.push('<p class =text-slide>' + i + '</p>')
}
var slide_invest = {
    type: 'html-slider-response',
    stimulus: '<p class = center-block-text-slide>Select how much you want to invest</p>',
    labels: slide_labels,
    min: 0,
    max: 20,
    start: 10,
    slider_width: 500,
    require_movement: true,
//         prompt: '<p class = center-block-text>Select how much much you want to invest.</p>',
    button_label: 'Send to your partner',
    on_finish: function(data){
            investment_amount = parseInt(data.response);
            data.investment_amount = investment_amount;
    }
};

var trustee_thinking = {
    type: "image-keyboard-response",
    stimulus: 'images/loading.gif',
    prompt: function(){return  '<div class = centerbox><p class = center-block-text-top>Your partner received ' +
        '<strong>' + 3 * investment_amount + '</strong>' +
        ' and is deciding how much to repay you'+
        '</p></div>'},
    trial_duration: 3000,
    choices: [],
    on_start: function(data){
        get_backend_repay(investment_amount)
    }
};

var get_repayment = function(){
    return last_repay;
};

var repayment_shown = {
    type: "html-keyboard-response",
    stimulus: function(){
        return '<div class = centerbox><p class = center-block-text-slide>Your partner kept ' + '<strong>' + (3 * investment_amount - get_repayment()) + '</strong>'+
            ' and repaid you ' + '<strong>' + get_repayment() + '</strong>' +
            '</p>'+
            '<p class = center-block-text-slide> Press <strong>space</strong> to continue </p></div>'
    },
    choices: [32],
    on_finish: function (data) {
        data.investtment_amount = investment_amount;
        data.repayment = get_repayment()
    }
};

var get_total_round = function (){
    return (20 - investment_amount + get_repayment());
};

var total_show ={
    type: "html-keyboard-response",
    stimulus: function(){
        return '<div class = centerbox><p class = center-block-text-slide> You earned ' + '<strong>' + get_total_round() + '</strong>' +
            ' this round </p>' +
            '<p class = center-block-text-slide> Press <strong>space</strong> to continue </p></div>'
    },
    choices: [32],
    on_finish: function (data) {
        data.investtment_amount = investment_amount;
        data.repayment = get_repayment();
        total_earnings += get_total_round();
    }
};


var new_round = {
    type: "html-keyboard-response",
    stimulus: '<div class = centerbox><p class = center-block-text-slide> New round started </p></div>',
    trial_duration: 2000,
    choices: []
};




var task_timeline = [];
for (i = 0; i < 10; i++){
    task_timeline.push(new_round);
    task_timeline.push(slide_invest);
    task_timeline.push(trustee_thinking);
    task_timeline.push(repayment_shown);
    task_timeline.push(total_show)
}

var if_passed_task = {
    timeline: task_timeline,
    conditional_function: function(){
        return correct_answers;
    }
};

var if_passed_test_message = {
    timeline: [ {
        type: "html-keyboard-response",
        stimulus: '<div class = centerbox><p class = center-block-text-slide> You have passed the test. </p>' +
            '<p class = center-block-text-slide> Press <strong>space</strong> to begin the task </p></div>',
        choices: [32]
    }],
    conditional_function: function(){
        return correct_answers;
    }
};

timeline.push(if_passed_test_message);
timeline.push(if_passed_task);

payment_id = Math.round(Math.random()*1000000).toString() + "317";

function saveData(name, data){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
}

var end_block = {
    type: "html-keyboard-response",
    data: {
        trial_id: "end",
        exp_id: 'mrtt'
    },
    stimulus: function () {
        return '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p>' +
            '<p class = center-block-text>You earned ' + total_earnings + ' units. </p>' +
        '<p class = center-block-text>Press <strong>space</strong> to continue.</p></div>'
    },
    on_start: function(data){
        jsPsych.data.addProperties({'condition': condition});
    },
    choices: [32]
};

timeline.push(end_block);

/* start the experiment */
// jsPsych.init({
//     timeline: timeline,
//     on_finish: function() {
//         jsPsych.data.displayData();
//     }
// });
