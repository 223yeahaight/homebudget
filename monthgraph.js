var canvas2 = document.getElementById('monthgraph');
var context2 = canvas2.getContext('2d');
canvas2.height = 400;
canvas2.width = 600; 

$(document).ready(function(){
    $.get('fetch.php', data => drawMonthGraph(data));
})



function drawMonthGraph(data){
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

    var dateObj = new Date();
    var currMonth = dateObj.getMonth();

    if(ansArray[currMonth] >= 0){
        var colors = ['grey', 'green']; 
        var labels = ['Zostalo', 'Wydano'];
    }else{
        var colors = ['red', 'green'];
        var labels = ['Przekroczono', 'Wydano'];
    }
    var vals = [Math.floor(ansArray[currMonth]), Math.floor(ans - ansArray[currMonth])];


    var monthChart = new Chart(context2, {
        type: 'doughnut',
        data:{
            labels: labels,
            datasets: [{
                backgroundColor: colors,
                data: vals  
            }],
        },
        options: {
            responsive: true
        }
    });
    
    
}