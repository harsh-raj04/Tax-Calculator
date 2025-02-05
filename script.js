// Tax slab configuration
const TAX_SLABS = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400000, max: 1000000, rate: 0.10 },
    { min: 1000000, max: 1500000, rate: 0.15 },
    { min: 1500000, max: Infinity, rate: 0.20 }
];

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

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Calculate tax for a specific slab
function calculateSlabTax(income, slab) {
    if (income <= slab.min) return 0;
    
    const taxableAmount = Math.min(income, slab.max) - slab.min;
    return taxableAmount > 0 ? taxableAmount * slab.rate : 0;
}

// Calculate total tax and breakdown
function calculateTax(income) {
    let totalTax = 0;
    let breakdown = [];

    // Calculate tax for each slab
    TAX_SLABS.forEach((slab, index) => {
        const slabTax = calculateSlabTax(income, slab);
        
        if (slabTax > 0) {
            totalTax += slabTax;
            breakdown.push({
                slab: `${formatCurrency(slab.min)} - ${slab.max === Infinity ? 'Above' : formatCurrency(slab.max)}`,
                taxableAmount: Math.min(income, slab.max) - slab.min,
                rate: `${slab.rate * 100}%`,
                tax: slabTax
            });
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

        // Update main results
        displayIncome.textContent = formatCurrency(income);
        totalTaxElement.textContent = formatCurrency(totalTax);
        netIncomeElement.textContent = formatCurrency(netIncome);

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

// Add CSS styles for breakdown details
const style = document.createElement('style');
style.textContent = `
    .breakdown-details {
        font-size: 0.9em;
        color: #666;
        margin-top: 4px;
    }
    .tax-rate {
        margin-left: 15px;
        color: #4a5568;
        font-weight: 500;
    }
    .tax-amount {
        font-weight: 600;
        color: #2d3748;
    }
    .breakdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f7fafc;
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);