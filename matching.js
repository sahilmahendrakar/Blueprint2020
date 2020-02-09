



var testStartup = {skills:["java", "python", "matlab", "wolfram"]};

var StudentA = {skills:["java", "python", "matlab", "wolfram"]};

var StudentB = {skills:["java", "python", "matlab"]}; 

var StudentC = {skills:["java"]}; 

var testAllStudents = [StudentB, StudentC, StudentA];



function Sort(array) {
    var done = false;
    while (!done) {
      done = true;
      for (var i = 1; i < array.length; i += 1) {
        if (array[i - 1].Score > array[i].Score) {
          done = false;
          var tmp = array[i - 1];
          array[i - 1] = array[i];
          array[i] = tmp;
        }
      }
    }
  
    return array;
  }

function Matching(Startup, AllStudents){
    
    var target = Startup.skills;
    for (var i = 0; i < AllStudents.length; i++) {
        var score = 0;
        var skills = AllStudents[i].skills;
        for (var k = 0; k<skills.length; k++){

            if(target.includes(skills[k])){
                score = score+1;
            }
            
        }
        // add location to the score
        AllStudents[i].Score=score;

    }
    AllStudents = Sort(AllStudents)
    ;
    return AllStudents.reverse();
}



console.log(Matching(testStartup, testAllStudents))

