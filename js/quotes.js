document.addEventListener('DOMContentLoaded', () => {
    fetch('./json/quotes.json')
    .then(Response => Response.json())
    .then(data => {
        let index = 0;
        let quoteBox = document.querySelector('#quote');
        let authorBox = document.querySelector('#author');

        function showQuote() {
            
            let { quote, author } = data[index];
            quoteBox.textContent = `"${quote}"`;
            authorBox.textContent = `"${author}"`;
            index = (index + 1) % data.length;
        }

        showQuote();
        setInterval(showQuote, 60000);
    })
    .catch(error => console.error('Error al cargar las frases: ', error));
});

export default {};