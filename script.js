// استرجاع السلة من التخزين المحلي للمتصفح (لتعمل في كل صفحات الموقع)
let cart = JSON.parse(localStorage.getItem('stitchStoreCart')) || [];

// تشغيل الدوال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // ربط جميع أزرار "أضف للسلة" في كل أقسام الموقع تلقائياً
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addToCart(name, price);
        });
    });
});

// دالة إضافة منتج إلى السلة
function addToCart(name, price) {
    // البحث إذا كان المنتج موجوداً مسبقاً في السلة
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`✅ تم إضافة "${name}" إلى السلة!`);
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');

    let totalCount = 0;
    let totalPrice = 0;

    // حساب الإجمالي والعدد الكلي
    cart.forEach(item => {
        totalCount += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    // تحديث عداد السلة في الهيدر (إن وجد في الصفحة الحالية)
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }

    // تحديث قائمة المنتجات والسعر (يعمل داخل صفحة السلة)
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; padding:40px;">السلة فارغة حالياً 🛒</p>';
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <span>${item.price} ريال × ${item.quantity} = <strong>${item.price * item.quantity} ريال</strong></span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeItem(${index})">حذف</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = `${totalPrice} ريال`;
    }
}

// تغيير الكمية (+ أو -)
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

// حذف منتج معين
function removeItem(index) {
    const removedName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast(`🗑️ تم حذف "${removedName}" من السلة`);
}

// إفراغ السلة بالكامل
function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    saveCart();
    updateCartUI();
    showToast('🧹 تم إفراغ السلة بالكامل');
}

// حفظ السلة في المتصفح
function saveCart() {
    localStorage.setItem('stitchStoreCart', JSON.stringify(cart));
}

// فتح وإغلاق القائمة الجانبية للسلة
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

// إظهار الرسالة التفاعلية (Toast)
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // تختفي بعد 3 ثوانٍ
}
// إتمام الطلب
// إتمام الطلب باستخدام النافذة المخصصة
function checkout() {
    if (cart.length === 0) {
        showToast('⚠️ السلة فارغة، أضف منتجات أولاً!');
        return;
    }
    const total = document.getElementById('cart-total').textContent;
    // وضع النص داخل نافذة التنبيه المخصصة
    document.getElementById('custom-alert-text').innerHTML = `إجمالي طلبك هو: <strong>${total}</strong><br>سيتم تجهيز طلبك قريباً.`;
    // إظهار النافذة
    document.getElementById('custom-alert-modal').style.display = 'flex';
    // تفريغ السلة وتحديث الواجهة
    cart = [];
    saveCart();
    updateCartUI();
    if (typeof toggleCart === 'function') {
        toggleCart(); // لإغلاق قائمة السلة الجانبية إن كانت مفتوحة
    }
}
// إغلاق النافذة المخصصة
function closeCustomAlert() {
    document.getElementById('custom-alert-modal').style.display = 'none';
}
function openModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');

    modal.style.display = 'flex';
    modalImg.src = src;
}
function closeModal() {
    document.getElementById('image-modal').style.display = 'none';
}