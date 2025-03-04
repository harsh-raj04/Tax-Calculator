const incomeInput = document.getElementById('income');
const deductionsInput = document.getElementById('deductions');
const standardDeductionsInput = document.getElementById('standardDeductions');
const calculateBtn = document.getElementById('calculateBtn');
const displayIncome = document.getElementById('displayIncome');
const totalTaxElement = document.getElementById('totalTax');
const netIncomeElement = document.getElementById('netIncome');
const effectiveRateElement = document.getElementById('effectiveRate');
const breakdownContent = document.querySelector('.breakdown-content');


calculateBtn.addEventListener('click', handleCalculation);

function handleCalculation() {
    const income = parseFloat(incomeInput.value) || 0;
    const deductions = parseFloat(deductionsInput.value) || 0;
    const standardDeductions = parseFloat(standardDeductionsInput.value) || 0;
    const regime = document.querySelector('input[name="taxRegime"]:checked').value;
    
    const taxableIncome = Math.max(0, income - deductions); // Apply deductions to both regimes
    
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    
    setTimeout(() => {
        let { totalTax, breakdown } = calculateTax(taxableIncome, regime);
        totalTax = Math.max(0, totalTax - standardDeductions); // Apply standard deduction on final tax
        const netIncome = income - totalTax;
        const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

        displayIncome.textContent = formatCurrency(income);
        totalTaxElement.textContent = formatCurrency(totalTax);
        netIncomeElement.textContent = formatCurrency(netIncome);
        effectiveRateElement.textContent = `${effectiveRate.toFixed(2)}%`;
        updateBreakdown(breakdown);

        calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate Tax';
    }, 500);
}

function calculateTax(income, regime) {
    const TAX_SLABS_OLD = [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 0.05 },
        { min: 500000, max: 750000, rate: 0.1 },
        { min: 750000, max: 1000000, rate: 0.15 },
        { min: 1000000, max: 1250000, rate: 0.2 },
        { min: 1250000, max: 1500000, rate: 0.25 },
        { min: 1500000, max: Infinity, rate: 0.3 }
    ];
    
    const TAX_SLABS_NEW = [
        { min: 0, max: 400000, rate: 0 },
        { min: 400000, max: 800000, rate: 0.05 },
        { min: 800000, max: 1200000, rate: 0.10 },
        { min: 1200000, max: 1600000, rate: 0.15 },
        { min: 1600000, max: 2000000, rate: 0.20 },
        { min: 2000000, max: 2400000, rate: 0.25 },
        { min: 2400000, max: Infinity, rate: 0.30 }
    ];

    const TAX_SLABS = regime === 'new' ? TAX_SLABS_NEW : TAX_SLABS_OLD;
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function updateBreakdown(breakdown) {
    breakdownContent.innerHTML = '';
    if (breakdown.length === 0) {
        breakdownContent.innerHTML = `<div class="breakdown-item">No tax applicable</div>`;
        return;
    }
    breakdown.forEach(item => {
        const breakdownItem = document.createElement('div');
        breakdownItem.className = 'breakdown-item';
        breakdownItem.innerHTML = `
            <div><strong>${item.slab}</strong>
                <div class="breakdown-details">Taxable Amount: ${formatCurrency(item.taxableAmount)}
                    <span class="tax-rate">Rate: ${item.rate}</span>
                </div>
            </div>
            <div class="tax-amount">${formatCurrency(item.tax)}</div>`;
        breakdownContent.appendChild(breakdownItem);
    });
}
