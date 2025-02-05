// Constants for tax calculation
const TAX_SLABS = {
    SLAB_1: { limit: 400000, rate: 0 },
    SLAB_2: { limit: 1000000, rate: 0.10 },
    SLAB_3: { limit: 1500000, rate: 0.15 },
    SLAB_4: { rate: 0.20 }
};

// DOM Elements
const incomeInput = document.getElementById('income');
const calculateBtn = document.getElementById('calculateBtn');
const displayIncome = document.getElementById('displayIncome');
const totalTaxElement = document.getElementById('totalTax');
const netIncomeElement = document.getElementById('netIncome');
const breakdownContent = document.querySelector('.breakdown-content');

// Event Listeners
calculateBtn.addEventListener('click', handleCalculation);
incomeInput.addEventListener('input', validateInput);

// Input validation
function validateInput(e) {
    const value = e.target.value;
    if (value < 0) {
        e.target.value = 0;
    }
}

// Format currency in Indian format
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Calculate tax
function calculateTax() {
    const income = parseFloat(incomeInput.value) || 0;
    let totalTax = 0;
    let breakdown = [];

    // Animate the calculation process
    animateCalculation();

    // Calculate tax for each slab
    if (income > TAX_SLABS.SLAB_3.limit) {
        const taxAmount = (income - TAX_SLABS.SLAB_3.limit) * TAX_SLABS.SLAB_4.rate;
        totalTax += taxAmount;
        breakdown.push({
            slab: `Above ${formatCurrency(TAX_SLABS.SLAB_3.limit)}`,
            amount: taxAmount,
            rate: `${TAX_SLABS.SLAB_4.rate * 100}%`
        });
    }

    if (income > TAX_SLABS.SLAB_2.limit) {
        const taxableAmount = Math.min(income, TAX_SLABS.SLAB_3.limit) - TAX_SLABS.SLAB_2.limit;
        const taxAmount = taxableAmount * TAX_SLABS.SLAB_3.rate;
        totalTax += taxAmount;
        if (taxableAmount > 0) {
            breakdown.push({
                slab: `${formatCurrency(TAX_SLABS.SLAB_2.limit)} to ${formatCurrency(TAX_SLABS.SLAB_3.limit)}`,
                amount: taxAmount,
                rate: `${TAX_SLABS.SLAB_3.rate * 100}%`
            });
        }
    }

    if (income > TAX_SLABS.SLAB_1.limit) {
        const taxableAmount = Math.min(income, TAX_SLABS.SLAB_2.limit) - TAX_SLABS.SLAB_1.limit;
        const taxAmount = taxableAmount * TAX_SLABS.SLAB_2.rate;
        totalTax += taxAmount;
        if (taxableAmount > 0) {
            breakdown.push({
                slab: `${formatCurrency(TAX_SLABS.SLAB_1.limit)} to ${formatCurrency(TAX_SLABS.SLAB_2.limit)}`,
                amount: taxAmount,
                rate: `${TAX_SLABS.SLAB_2.rate * 100}%`
            });
        }
    }

    // Display results
    displayIncome.textContent = formatCurrency(income);
    totalTaxElement.textContent = formatCurrency(totalTax);
    netIncomeElement.textContent = formatCurrency(income - totalTax);

    // Display tax breakdown
    taxBreakdownElement.innerHTML = '';
    breakdown.forEach(item => {
        const breakdownItem = document.createElement('div');
        breakdownItem.className = 'breakdown-item';
        breakdownItem.innerHTML = `
            <div>
                <strong>${item.slab}</strong>
                <div class="breakdown-details">
                    Taxable Amount: ${formatCurrency(item.taxableAmount)}
                    <span class="tax-rate">Rate: ${item.rate}</span>
                </div>
            </div>
            <div class="tax-amount">${formatCurrency(item.tax)}</div>
        `;
        breakdownContent.appendChild(breakdownItem);
    });

    resultSection.style.display = 'block';
}

// Animation function (placeholder)
function animateCalculation() {
    resultSection.style.opacity = 0;
    setTimeout(() => {
        resultSection.style.opacity = 1;
    }, 300);
}