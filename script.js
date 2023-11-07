function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function fetchData() {
  $.get("fetch.php", data => displayData(data))
}

function handleData(data) {
  var dataArray = data.split(';');
  dataArray.pop();
  newArray = [];
  while (dataArray.length) newArray.push(dataArray.splice(0, 4));
  var ans = 0;
  for (var i = 0; i < newArray.length; ++i) {
    if (newArray[i][2] == "wydatek") {
      ans -= newArray[i][0] * (12 / newArray[i][1]);
    }
    else if (newArray[i][2] == "dochod") {
      ans += newArray[i][0] * (12 / newArray[i][1]);
    } else if (newArray[i][2] == "zakup") {
      ans -= newArray[i][0];
    }
  }

  ans = Math.floor(ans);

  return ans;
}

function displayData(data) {
  document.getElementById('savings').innerHTML = handleData(data) + " zl";
}

//insert przez ajax
$(document).ready(function () {
  $("#addexpense").click(function () {
    var title = $("#ex_title").val();
    var amount = $("#ex_amount").val();
    var freq = $("#ex_freq").val();
    var type = "wydatek";
    var dateObj = new Date();
    var date = (dateObj.getMonth() + 1).toString() + '-' + dateObj.getFullYear().toString();

    if (title != "" && amount != null && freq != null) {
      $.ajax({
        url: 'insert.php',
        method: 'POST',
        data: {
          title: title,
          amount: amount,
          freq: freq,
          type: type,
          date: date
        }
      })
    }
  });

  $("#addincome").click(function () {
    var title = $("#in_title").val();
    var amount = $("#in_amount").val();
    var freq = $("#in_freq").val();
    var type = "dochod";
    var dateObj = new Date();
    var date = (dateObj.getMonth() + 1).toString() + '-' + dateObj.getFullYear().toString();

    if (title != "" && amount != null && freq != null) {
      $.ajax({
        url: 'insert.php',
        method: 'POST',
        data: {
          title: title,
          amount: amount,
          freq: freq,
          type: type,
          date: date
        }
      })
    }
  })

  $("#addpurchase").click(function () {
    var title = $("#pu_title").val();
    var amount = $("#pu_amount").val();
    var freq = 0;
    var type = "zakup";
    var dateObj = new Date();
    var date = (dateObj.getMonth() + 1).toString() + '-' + dateObj.getFullYear().toString();

    if (title != "" && amount != null && freq != null) {
      $.ajax({
        url: 'insert.php',
        method: 'POST',
        data: {
          title: title,
          amount: amount,
          freq: freq,
          type: type,
          date: date
        }
      })
    }
  })

  $("#apibutton").click(function () {
    console.log(convertPdf('invoice1.pdf'));
    //getData('faktura1.pdf');
  })

  $("#filelist").click(function() {
    checkForInvoices();
  })

});


function convertPdf(filename) {
  const file = filename;
  if (file) {
    var text = '';
    // Inicjalizacja i otwarcie dokumentu PDF
    pdfjsLib.getDocument(file).promise.then(function (pdfDoc) {
      const numPages = pdfDoc.numPages;
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        pdfDoc.getPage(pageNum).then(function (page) {
          page.getTextContent().then(function (textContent) {
            for (const item of textContent.items) {
              text += item.str + ' ';
            }
            sendRequest(text)
          });
        });
      }
    });
  }


}

function parseForJSON(text) {
  text = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return text;
}

function currencyToFloat(text) {
  text = text.replace(',', '.');
  text = text.replace(/[^\d.-]/g, '');
  var result = parseFloat(text);
  return result;
}

function sendRequest(pdftext) {
  var url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer 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");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      json_response = JSON.parse(xhr.responseText);
      invoice_json = JSON.parse(parseForJSON(json_response.choices[0].text));
      console.log(invoice_json);

      var title = invoice_json.seller_name;
      var amount = currencyToFloat(invoice_json.total_amount);
      var freq = 0;
      var type = "zakup online";
      var date = invoice_json.invoice_date;

      console.log(title);
      console.log(amount);
      console.log(date);

      $.ajax({
        url: 'insert.php',
        method: 'POST',
        data: {
          title: title,
          amount: amount,
          freq: freq,
          type: type,
          date: date
        }
      })

    }
  };


  var query = "analyze data from the invoice below and return only a json containing only: invoice_date, seller_name and total_amount. The total amount has to be a string. The date has to be formated to day-month-year. There MUST NOT be ANY text before the opening bracket of the JSON in your response. ";

  var user_msg = query + ' Here is the invoice: ' + pdftext;

  var data = `{
      "prompt": "` + user_msg + `",
      "temperature": 0.7,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0.75,
      "presence_penalty": 0
    }`;
  xhr.send(data);
}

var alreadyAddedFiles = [];

function checkForInvoices() {
  fetch('getfilelist.php')
    .then(response => response.json())
    .then(data => {
      data.shift();
      data.shift();
      if(alreadyAddedFiles.includes(data[i]) == false){
        for(var i = 0; i < data.length; i++){
          path = "./faktury/" + data[i];
          convertPdf(path);
          alreadyAddedFiles.push(data[i]);
        }
      }
    })
    .catch(error => console.error('Error:', error));
}

let intervalID = setInterval(checkForInvoices(), 86400000);

