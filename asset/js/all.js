// <!-- 預設 JS，請同學不要修改此處 -->

document.addEventListener('DOMContentLoaded', function() {
    const ele = document.querySelector('.recommendation-wall');
    ele.style.cursor = 'grab';
    let pos = {
        top: 0,
        left: 0,
        x: 0,
        y: 0
    };
    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});
// menu 切換
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if (menu.classList.contains('openMenu')) {
        menu.classList.remove('openMenu');
    } else {
        menu.classList.add('openMenu');
    }
}

function closeMenu() {
    menu.classList.remove('openMenu');
}
// <!-- 預設 JS，請同學不要修改此處 -->

const apiPath = 'eifu';
const baseUrl = 'https://livejs-api.hexschool.io/'

let productsData = [];
let cartsData = []

const productsList = document.querySelector(".productWrap");
const cartsList = document.querySelector(".shoppingCart-table");
const productSearch = document.querySelector(".productSelect");
const discardAllBtn = document.querySelector(".discardAllBtn")
const deleteCart = document.querySelector('.js-deleteCartAll');
const shoppingCartList = document.querySelector(".shoppingCart");
const formEl = document.querySelector(".orderInfo-form");
const orderButton = document.querySelector(".orderInfo-btn");
const addOrderInput = document.querySelectorAll(".orderInfo-inputWrap")
const error = document.querySelectorAll(".orderInfo-message")
    //const allListener = document.querySelectorAll(".shoppingCart,.productWrap")



// API
function getProducts() {
    const url = `${baseUrl}api/livejs/v1/customer/${apiPath}/products`;
    // axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/clothes/products')
    axios.get(url)
        .then((response) => {

            productsData = response.data.products;
            // console.log(productsData)
            render_products(productsData)
        }).catch((err) => { console.error(err) });
}

function getshoppingCarts() {
    const url = `${baseUrl}api/livejs/v1/customer/${apiPath}/carts`;
    axios.get(url)
        .then((response) => {
            cartsData = response.data.carts;
            // console.log(response)
            let finalTotal = response.data.finalTotal
            render_carts(cartsData, finalTotal)
        }).catch((err) => { console.error(err) });
}



function addProduct(productId, quantity) {
    const url = `${baseUrl}api/livejs/v1/customer/${apiPath}/carts`;
    const data = {
        data: { productId, quantity }
    };
    axios.post(url, data)
        .then(function(response) {
            cartsData = response.data.carts
            finalTotal = response.data.finalTotal
            render_carts(cartsData, finalTotal)

            // console.log(response)
        })
        .catch(function(error) {
            // console.log(error);
        });
}

function patchProduct(id, quantity) {
    const url = `${baseUrl}api/livejs/v1/customer/${apiPath}/carts`;
    const data = { data: { id, quantity } }
    axios.patch(url, data)
        .then((response) => {
            cartsData = response.data.carts;
            // console.log(response)
            let finalTotal = response.data.finalTotal
            render_carts(cartsData, finalTotal)
        }).catch((err) => { console.error(err) });
}

function deleteProduct(id) {
    const url = `${baseUrl}api/livejs/v1/customer/${apiPath}/carts/${id}`;
    axios.delete(url)
        .then((response) => {
            cartsData = response.data.carts
            finalTotal = response.data.finalTotal
            render_carts(cartsData, finalTotal)

        }).catch((err) => { console.error(err) });
}

function deleteProducts() {
    const url = `${baseUrl}api/livejs/v1/customer/${apiPath}/carts`;
    axios.delete(url)
        .then((response) => {
            cartsData = response.data.carts
            finalTotal = response.data.finalTotal
            render_carts(cartsData, finalTotal)
        }).catch((err) => { console.error(err) });
}

function postshoppingCart(orderObj) {
    const url = `${baseUrl}api/livejs/v1/customer/${apiPath}/orders`;
    axios.post(url, {
            "data": {
                "user": {
                    "name": orderObj.name,
                    "tel": orderObj.tel,
                    "email": orderObj.email,
                    "address": orderObj.address,
                    "payment": orderObj.payment
                }
            }
        })
        .then((response) => {
            // console.log(response)
            init();
        }).catch((err) => { console.error(err) });
}

function addOrder(e) {
    const errorMessage = formValidate();
    if (errorMessage) {
        Object.keys(errorMessage).forEach(function(keys) {
            let messageSeletor = document.querySelector(`.orderInfo-inputWrap [data-message=${keys}]`);
            messageSeletor.setAttribute('style', 'display:block;');
            messageSeletor.textContent = errorMessage[keys];
            return;
        });
    } else {
        // console.log(addOrderInput)
        const name = document.querySelector("#customerName");
        const tel = document.querySelector("#customerPhone");
        const email = document.querySelector("#customerEmail");
        const address = document.querySelector("#customerAddress");
        const tradeWay = document.querySelector("#tradeWay");
        const orderObj = {
            name: name.value.trim(),
            tel: tel.value.trim(),
            email: email.value.trim(),
            address: address.value.trim(),
            payment: tradeWay.value.trim(),
        }
        if (cartsData.length == 0) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '購物車沒有商品，請加入商品',
                showConfirmButton: true,
            });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '訂單送出成功',
                showConfirmButton: false,
                timer: 1500
            });
            postshoppingCart(orderObj)
        }

    }
}

//初始化
function init() {
    // loading();
    formEl.reset();
    error.forEach(element => { element.setAttribute('style', 'display:none;') });
    getProducts();
    getshoppingCarts();
}

// function loading() {

//     setTimeout(() => {

//     }, 10000);
// }

function render_products(products) {
    let str = "";
    products.forEach(element => {
        str += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${element.images}" alt="">
        <a href="#" class="addCardBtn" id="${element.id}">加入購物車</a>
        <h3>${element.title}</h3>
        <del class="originPrice">NT$${Number(element.origin_price)}</del>
        <p class="nowPrice">NT$${Number(element.price)}</p>
        </li>`;
    });
    productsList.innerHTML = str
}

function render_carts(carts, finalTotal) {
    let str = ""
    if (carts.length == 0) {
        // console.log("沒有商品")
        str += `<div style="color:#6A33F8">目前尚未有商品</div>`
        cartsList.innerHTML = str
    } else {
        carts.forEach(element => {
            let money = Number(element.product.price) * Number(element.quantity);
            let type = element.quantity === 1 ? "disable" : "";
            str += `                    
        <tr>
            <td>
                <div class="cardItem-title">
                    <img src="${element.product.images}" alt="">
                    <p>${element.product.title}</p>
                </div>
            </td>
            <td>NT$${element.product.price}</td>
            <td class="patchBtn js-patchproduct"><a href="#" class="material-icons ${type} js-patchRemove" data-remove=${element.id} data-num=${element.quantity}>remove</a> <input type="text" min="1" class="js-patchNum" data-patchnum=${element.id} style="width:2.5rem" value="${element.quantity}"> <a href="#" class="material-icons js-patchAdd" data-add=${element.id} data-num=${element.quantity}>add</a></td>
            <td>NT$${money}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons js-delProduct" data-del="${element.id}">
                    clear
                </a>
            </td>
        </tr>`
        });
        const view = `
        <table class="shoppingCart-table">
                 <tr>
                     <th width="40%">品項</th>
                     <th width="15%">單價</th>
                     <th width="15%">數量</th>
                     <th width="15%">金額</th>
                     <th width="15%"></th>
                 </tr>
                     ${str}
                 <tr>
                     <td>
                         <a href="#" class="discardAllBtn js-deleteCartAll">刪除所有品項</a>
                     </td>
                     <td></td>
                     <td></td>
                     <td>
                         <p>總金額</p>
                     </td>
                     <td width=15% class="total-money p-0">NT$${finalTotal}</td>
                 </tr>
        </table>
         `;
        cartsList.innerHTML = view
    }

}

//Listener 函式

function formListener(e) {
    const errorMessage = formValidate();
    let filters;
    // console.log(errorMessage)
    if (errorMessage) {
        filters = Object.keys(errorMessage).filter(function(keys) {
            return keys === e.target.getAttribute("name");
        });
        if (filters.length > 0) {
            let messageSeletor = document.querySelector(`.orderInfo-inputWrap [data-message=${filters}]`)
            messageSeletor.textContent = errorMessage[filters]
            messageSeletor.setAttribute('style', 'display:block;')
        } else if (filters.length === 0) {
            let messageSeletor = document.querySelector(`.orderInfo-inputWrap [data-message=${e.target.name}]`)
            messageSeletor.textContent = ""
            messageSeletor.setAttribute('style', 'display:none;')
        };
    } else { error.forEach(element => { element.setAttribute('style', 'display:none;') }); }
}

function productsListListener(e) {
    e.preventDefault()
    const product_id = e.target.getAttribute("id");
    if (product_id) {
        let carts = cartsData.filter(item => item.product.id == product_id)
        if (carts.length != 0) {
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: '已有此商品，可至購物車更改數量',
                showConfirmButton: true,
                //timer: 1500
            });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '成功加入購物車',
                showConfirmButton: false,
                timer: 1500
            });
            addProduct(product_id, 1);
        }
    }
}

function shoppingCartListener(e) {
    e.preventDefault();
    // console.log(e.target)
    const className = e.target.getAttribute("class");
    let carts_id;
    let num;
    const value = className ? className.split(" ").pop() : null
    switch (value) {
        case "js-deleteCartAll":
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '刪除所有商品成功',
                showConfirmButton: false,
                timer: 1500
            });
            deleteProducts();
            break;
        case "js-delProduct":
            carts_id = e.target.getAttribute("data-del");
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '刪除商品成功',
                showConfirmButton: false,
                timer: 1500
            });
            deleteProduct(carts_id);
            break;
        case "js-patchAdd":
            carts_id = e.target.getAttribute("data-add")
            num = e.target.getAttribute("data-num")
            patchProduct(carts_id, (parseInt(num)) + 1)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '增加數量成功',
                showConfirmButton: false,
                timer: 1500
            });
            break;
        case "js-patchRemove":
            carts_id = e.target.getAttribute("data-remove")
            num = e.target.getAttribute("data-num")
            patchProduct(carts_id, (parseInt(num)) - 1)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '減少數量成功',
                showConfirmButton: false,
                timer: 1500
            });
            break;
        case "js-patchNum":
        case "js-patchproduct":
            value == "js-patchproduct" ? carts_id = e.target.children[1].getAttribute("data-patchnum") : carts_id = e.target.getAttribute("data-patchnum")
            let patchSelector = document.querySelector(`.js-patchproduct [data-patchnum=${carts_id}]`)
            patchSelector.addEventListener("change", function(e) {
                let patchNum = parseInt(e.target.value)
                    // console.log(patchNum)
                if (patchNum <= 0 || isNaN(patchNum)) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '更改數量不能小於1',
                        showConfirmButton: true,
                        //timer: 1500
                    });
                    getshoppingCarts();
                    return;
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '更改數量成功',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    patchProduct(carts_id, patchNum);
                }
                // console.log(`更改${carts_id}訂單，數量為${e.target.value}`);
            });
            break;
        default:
            break;
    }
}


function filterProductList(e) {
    let filterData = productsData.filter(item => e.target.value == item.category || e.target.value == '全部');
    render_products(filterData);
}

function formValidate() {
    const validateForm = {
        "姓名": {
            presence: {
                message: "是必填欄位"
            },
        },
        "電話": {
            presence: {
                message: "是必填欄位"
            },
            length: {
                onlyInteger: true,
                minimum: 8,
                greaterThanOrEqualTo: 8,
                lessThanOrEqualTo: 10,
                message: "必須符合 8-10字數"
            }
        },
        "Email": {
            presence: {
                message: "是必填欄位"
            },
            email: {
                message: "錯誤格式"
            }
        },
        "寄送地址": {
            presence: {
                message: "是必填欄位"
            },
        },
        "交易方式": {
            presence: {
                message: "是必填欄位"
            },
        }
    };
    return validate(formEl, validateForm);
}





init();


//Listener

productSearch.addEventListener("change", filterProductList);
shoppingCartList.addEventListener("click", shoppingCartListener);
//allListener.forEach(e => { e.addEventListener("click", shoppingCartListener) })
productsList.addEventListener("click", productsListListener);
orderButton.addEventListener("click", addOrder);
addOrderInput.forEach(element => { element.children[0].addEventListener("blur", formListener) });