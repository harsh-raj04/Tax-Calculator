document.getElementById('taxForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const income = parseFloat(document.getElementById('income').value);
    let tax = 0;

    if (income <= 400000) {
        tax = 0;
    } else if (income > 400000 && income <= 1000000) {
        tax = (income - 400000) * 0.10;
    } else if (income > 1000000 && income <= 1500000) {
        tax = 60000 + (income - 1000000) * 0.15;
    } else if (income > 1500000) {
        tax = 135000 + (income - 1500000) * 0.20;
    }

    document.getElementById('result').innerText = `Your Tax is: PKR ${tax.toFixed(2)}`;
});