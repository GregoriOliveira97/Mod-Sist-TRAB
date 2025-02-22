document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('coupons')) {
        const initialCoupons = [
            {
                code: 'PRIMEIRO10',
                discount: 10,
                type: 'percentage',
                description: 'Desconto de 10% na primeira compra',
                expiryDate: '2025-12-31',
                minValue: 30
            },
            {
                code: 'MENOS15',
                discount: 15,
                type: 'fixed',
                description: 'R$ 15 de desconto em pedidos acima de R$ 50',
                expiryDate: '2025-12-31',
                minValue: 50
            }
        ];
        localStorage.setItem('coupons', JSON.stringify(initialCoupons));
    }

    function renderCoupons() {
        const coupons = JSON.parse(localStorage.getItem('coupons'));
        const couponsList = document.getElementById('coupons-list');
        
        couponsList.innerHTML = coupons.map(coupon => `
            <div class="coupon-card">
                <div class="coupon-code">${coupon.code}</div>
                <div class="coupon-discount">
                    ${coupon.type === 'percentage' ? `${coupon.discount}%` : `R$ ${coupon.discount.toFixed(2)}`}
                </div>
                <div class="coupon-description">${coupon.description}</div>
                <div class="coupon-expiry">Válido até: ${new Date(coupon.expiryDate).toLocaleDateString()}</div>
                <button class="copy-button" onclick="copyCouponCode('${coupon.code}')">Copiar Código</button>
            </div>
        `).join('');
    }

    window.copyCouponCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            alert('Código do cupom copiado!');
        });
    }

    renderCoupons();
});