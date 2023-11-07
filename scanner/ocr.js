function currencyToFloat(text) {
    text = text.replace(/[^\d.-]/g, '');
    var result = parseFloat(text);
    return result;
}


function recognizeText() {

    const obrazekInput = document.getElementById('imageInput');
    const recognizedTextElement = document.getElementById('recognizedText');
    const obrazekWynikowyElement = document.getElementById('obrazekWynikowy');

    if (obrazekInput.files.length > 0) {
        const imageInput = obrazekInput.files[0];
        Tesseract.recognize(imageInput, 'pol',).then(({ data }) => {
            if (data && data.text) {
                var url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("Authorization", "Bearer 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");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        console.log(xhr.status);
                        json_response = JSON.parse(xhr.responseText);

                        var amount = currencyToFloat(json_response.choices[0].text)
                        console.log(amount);
                        var title = "paragon";
                        var freq = 0;
                        var type = "zakup";
                        var dateObj = new Date();
                        var date = (dateObj.getMonth() + 1).toString() + '-' + dateObj.getFullYear().toString();

                        $.ajax({
                            url: '../insert.php',
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


                var query = 'analyze data from the receipt below and return only the total amount paid as a number. ';

                var user_msg = query + ' Here is the receipt: ' + data.text;
                user_msg = user_msg.replace(/[\r\n]/gm, '');

                var data = `{
                                "prompt": "` + user_msg + `",
                                "temperature": 0.7,
                                "max_tokens": 256,
                                "top_p": 1,
                                "frequency_penalty": 0.75,
                                "presence_penalty": 0
                            }`;

                xhr.send(data);
            } else {
                recognizedTextElement.textContent = 'Nie udało się rozpoznać tekstu.';
            }
        }).catch(error => {
            console.error('Błąd rozpoznawania tekstu: ', error);
        });
        const reader = new FileReader();
        reader.onload = function (e) {
            obrazekWynikowyElement.src = e.target.result;
        };
        reader.readAsDataURL(imageInput);
    } else {
        recognizedTextElement.textContent = 'Brak obrazka do rozpoznania.';
        obrazekWynikowyElement.src = '';
    }
}




$.get()