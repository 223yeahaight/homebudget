var canvas1 = document.getElementById('yeargraph');
var context1 = canvas1.getContext('2d');
canvas1.height = 400;
canvas1.width = 600; 

$(document).ready(function(){
    $.get('fetch.php', data => drawYearGraph(data));
})



function drawYearGraph(data){
    var dataArray = data.split(';');
    dataArray.pop();
    newArray = [];
    while(dataArray.length) newArray.push(dataArray.splice(0,4));
    var ans = 0;
    for(var i = 0; i < newArray.length; ++i){
        if(newArray[i][2] == "wydatek"){
            ans -= newArray[i][0]*(1/newArray[i][1]);
        }
        else if (newArray[i][2] == "dochod"){
            ans += newArray[i][0]*(1/newArray[i][1]);
        }
    }

    var ansArray = [ans,ans,ans,ans,ans,ans,ans,ans,ans,ans,ans,ans];
    for(var i = 0; i < newArray.length; ++i){
        for(var j = 1; j <= 12; j++){
            if(newArray[i][3].split('-')[0] == j.toString() && newArray[i][2] == 'zakup'){
                ansArray[j-1] -= newArray[i][0];
            }
        }
    }

    
    var lastY = 0;
    var nextY = 0;

    var  vals = [0];
    
    for(var i = 0; i < ansArray.length; ++i){
        nextY = lastY + ansArray[i];
        vals.push(nextY);

        lastY =  nextY;
    }
    
    var labels = ['', 'Styczen', 'Luty', 'Marzec', 'Kwiecien', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpien', 'Wrzesien', 'Pazdziernik', 'Listopad', 'Grudzien']
    var chart = new Chart(context1, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'jkdfskljs',
                data: vals
            }]
        },
        options: {
            tension: 0.3
        }
    })
    
}