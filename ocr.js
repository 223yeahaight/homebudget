function recognizeText() {

    const obrazekInput = document.getElementById('imageInput');
    const recognizedTextElement = document.getElementById('recognizedText');
    const obrazekWynikowyElement = document.getElementById('obrazekWynikowy');

    if (obrazekInput.files.length > 0) {
        const imageInput = obrazekInput.files[0];
        Tesseract.recognize(imageInput, 'pol',).then(({ data }) => {
            if (data && data.text) {
                recognizedTextElement.textContent = 'Rozpoznany tekst: ' + data.text;
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