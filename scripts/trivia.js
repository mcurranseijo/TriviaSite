
var difficulty = "easy";
token = "";


function loadToken(){
    //Call api once to generate token
    var url = "https://opentdb.com/api_token.php?command=request";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        var data = JSON.parse(this.response);
        if (xhr.status >= 200 && xhr.status < 400) {
            token = data.token;
        } else {
            console.log('token loading error');
        }
    }
}
//Function to get categories from api and return as array
function getCategories() {
    var url = "https://opentdb.com/api_category.php";
    var xhr = new XMLHttpRequest();
    var categoryArray = [];
    xhr.open("GET", url, true);
    xhr.onload = function () {
        var data = JSON.parse(this.response);
        if (xhr.status >= 200 && xhr.status < 400) {
            data.trivia_categories.forEach((category) => {
                categoryArray.push([category.name, category.id]);
            });
        } else {
            console.log('category fetch error');
        }
    }
    xhr.send();

    return categoryArray;
}


function setDifficulty(difficultyLevel) {
    difficulty = difficultyLevel;
    if(document.getElementById("category").value != ""){
        getQuestion(document.getElementById("category").value);
    }
}

//Function to get the question from the API and return as array
function getQuestion(category) {
    var url = "https://opentdb.com/api.php?amount=1&category=" + category + "&difficulty="+difficulty+"&type=multiple&token=" + token;
    var xhr = new XMLHttpRequest();
    var questionArray = [];
    xhr.open("GET", url, true);
    xhr.onload = function () {
        var data = JSON.parse(this.response);
        if (xhr.status >= 200 && xhr.status < 400) {
            data.results.forEach((question) => {
                answerArray = [question.correct_answer, question.incorrect_answers[0], question.incorrect_answers[1], question.incorrect_answers[2]];
                //shuffle the answers
                answerArray.sort(() => Math.random() - 0.5);

                document.getElementById("question").innerHTML = question.question;
                document.getElementById("buttonA").value = answerArray[0];
                document.getElementById("buttonB").value = answerArray[1];
                document.getElementById("buttonC").value = answerArray[2];
                document.getElementById("buttonD").value = answerArray[3];
                document.getElementById("answerA").innerHTML = answerArray[0];
                document.getElementById("answerB").innerHTML = answerArray[1];
                document.getElementById("answerC").innerHTML = answerArray[2];
                document.getElementById("answerD").innerHTML = answerArray[3];
                document.getElementById("answerHolder").innerHTML = question.correct_answer;
                document.getElementById("resultDiv").hidden = true;
                document.getElementById("questionDiv").hidden = false;



            });
        } else {
            //reset token
            var reset_url = "https://opentdb.com/api_token.php?command=reset&token=" + token;
            var reset = new XMLHttpRequest();
            reset.open("GET", url, true);
            reset.onload = function () {
                var data = JSON.parse(this.response);
                if (xhr.status >= 200 && xhr.status < 400) {
                    token = data.token;
                } else {
                    console.log('token reset error');
                }
            }
            reset.send();
            getQuestion(category);

        }
    }

    xhr.send();

}

//Function to check if the answer is correct
function checkAnswer() {
    var ele = document.getElementsByName('answer');
          
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)
        answer = ele[i].value;
    }
    var correctAnswer = document.getElementById("answerHolder").innerHTML;
    if (answer == correctAnswer) {
        document.getElementById("result").innerHTML = "Correct!";
    } else {
        document.getElementById("result").innerHTML = "Incorrect!";
    }
    document.getElementById("correctAnswer").innerHTML = correctAnswer
    document.getElementById("resultDiv").hidden = false;
    document.getElementById("questionDiv").hidden = true;
}