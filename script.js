// Tax slab configuration (in Rupees)
const TAX_SLABS = [
    { min: 0, max: 400000, rate: 0 },      // 0-4 lakh
    { min: 400000, max: 800000, rate: 0.05 },  // 4-8 lakh
    { min: 800000, max: 1200000, rate: 0.10 }, // 8-12 lakh
    { min: 1200000, max: 1600000, rate: 0.15 }, // 12-16 lakh
    { min: 1600000, max: 2000000, rate: 0.20 }, // 16-20 lakh
    { min: 2000000, max: 2400000, rate: 0.25 }, // 20-24 lakh
    { min: 2400000, max: Infinity, rate: 0.30 }  // Above 24 lakh
];

// DOM Elements
const incomeInput = document.getElementById('income');
const calculateBtn = document.getElementById('calculateBtn');
const displayIncome = document.getElementById('displayIncome');
const totalTaxElement = document.getElementById('totalTax');
const netIncomeElement = document.getElementById('netIncome');
const breakdownContent = document.querySelector('.breakdown-content');
const effectiveRateElement = document.getElementById('effectiveRate');

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

// Calculate total tax and breakdown
function calculateTax(income) {
    let totalTax = 0;
    let breakdown = [];

    TAX_SLABS.forEach(slab => {
        if (income > slab.min) {
            let taxableAmount = Math.min(income, slab.max) - slab.min;
            let tax = taxableAmount * slab.rate;

            if (taxableAmount > 0) {
                totalTax += tax;
                breakdown.push({
                    slab: `${formatCurrency(slab.min)} - ${slab.max === Infinity ? 'Above' : formatCurrency(slab.max)}`,
                    taxableAmount: taxableAmount,
                    rate: `${slab.rate * 100}%`,
                    tax: tax
                });
            }
        }
    });

    return { totalTax, breakdown };
}

// Handle the calculation and update UI
function handleCalculation() {
    const income = parseFloat(incomeInput.value) || 0;
    
    // Add loading animation
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
        const { totalTax, breakdown } = calculateTax(income);
        const netIncome = income - totalTax;

        // Calculate effective tax rate
        const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

        // Update main results
        displayIncome.textContent = formatCurrency(income);
        totalTaxElement.textContent = formatCurrency(totalTax);
        netIncomeElement.textContent = formatCurrency(netIncome);
        effectiveRateElement.textContent = `${effectiveRate.toFixed(2)}%`;

        // Update tax breakdown
        updateBreakdown(breakdown);

        // Reset button
        calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate Tax';

        // Show results with animation
        animateResults();
    }, 500);
}

// Update breakdown section
function updateBreakdown(breakdown) {
    breakdownContent.innerHTML = '';
    
    if (breakdown.length === 0) {
        breakdownContent.innerHTML = `
            <div class="breakdown-item">
                <span>No tax applicable (Income below ${formatCurrency(TAX_SLABS[1].min)})</span>
                <span>${formatCurrency(0)}</span>
            </div>`;
        return;
    }

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
}

// Animate results
function animateResults() {
    const results = document.querySelectorAll('.result-card');
    results.forEach((result, index) => {
        result.style.opacity = 0;
        result.style.transform = 'translateY(20px)';
        setTimeout(() => {
            result.style.transition = 'all 0.5s ease';
            result.style.opacity = 1;
            result.style.transform = 'translateY(0)';
        }, index * 100);
    });
}