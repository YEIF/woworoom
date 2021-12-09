/* <script> */
// 預設 JS，請同學不要修改此處
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
// </script>




// C3.js
const apiPath = 'eifu';
const baseUrl = 'https://livejs-api.hexschool.io/'
const uuid = {
    headers: {
        'Authorization': 'hiuMsh8Y8hg2KPcvJGVYYa4iwCC3'
    }
};
let ordersData = []
let c3Data = []
const orderPageTable = document.querySelector(".orderPage-table")
const sectionTitle = document.querySelector(".section-title")
const orderPageList = document.querySelector(".orderPage-list")
const c3Select = document.querySelector(".c3Select")
let chart = document.querySelector("#chart")
init()



function init() {
    getOrdersData()
}

function renderOrders(orders) {
    let str = ""
    let view = ""
    if (orders.length == 0) {
        c3Select.setAttribute("disabled", "disabled")
        view += `<div style="text-align: center ;font-size: 1.5rem; color:#EB7A77">目前尚未有訂單</div>`
        chart.innerHTML = view
        orderPageTable.innerHTML = `    <table class="orderPage-table">
        <thead>
            <tr>
                <th>訂單編號</th>
                <th>聯絡人</th>
                <th>聯絡地址</th>
                <th>電子郵件</th>
                <th>訂單品項</th>
                <th>訂單日期</th>
                <th>訂單狀態</th>
                <th>操作</th>
            </tr>
        </thead>
</table>`

    } else {
        orders.forEach(element => {
            let paid = element.paid
            let state = (paid == false) ? "未處理" : "已處理"
            let type = (state == "已處理") ? "processed" : ""
            let orderDate = orderTime(new Date(element.createdAt * 1000));
            str += ` <tr>
                    <td>${element.id}</td>
                    <td>
                        <p>${element.user.name}</p>
                        <p>${element.user.tel}</p>
                    </td>
                    <td>${element.user.address}</td>
                    <td>${element.user.email}</td>
                    <td class=orderDetail>
                        <a href="#" class="js-orderdetail" data-orderdetail=${element.id}>訂單明細</a>
                    </td>
                    <td>${orderDate}</td>
                    <td class="orderStatus">
                        <a href="#" class="${type} js-paid" data-paid=${paid} data-putorder="${element.id}">${state}</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn js-delete" data-deleteorder="${element.id}" value="刪除">
                    </td>
                </tr>`
        });
        view = `            
    <table class="orderPage-table">
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>聯絡人</th>
                    <th>聯絡地址</th>
                    <th>電子郵件</th>
                    <th>訂單品項</th>
                    <th>訂單日期</th>
                    <th>訂單狀態</th>
                    <th>操作</th>
                </tr>
            </thead>
            ${str}
    </table>
    `
        orderPageTable.innerHTML = view

        //C3charts()
    }

}

function rederC3chart(type) {
    switch (type) {
        case "C3itemsScale":
            C3itemsScale();
            break;
        case "C3itemsScalefilter":
            C3itemsScalefilter();
            break;
        case "C3categoryScale":
            C3categoryScale();
            break;
        default:
            break
    }
}

//API

function getOrdersData() {
    const url = `${baseUrl}api/livejs/v1/admin/${apiPath}/orders`;
    axios.get(url, uuid)
        .then((response) => {
            let data = response.data;
            // console.log(data)
            ordersData = response.data.orders
                // console.log(ordersData)
            renderOrders(ordersData)
            ordersData.length != 0 ? rederC3chart(c3Select.value) : null
        }).catch((err) => { console.error(err) });

}

function deleteOrder(id) {
    const url = `${baseUrl}api/livejs/v1/admin/${apiPath}/orders/${id}`;
    axios.delete(url, uuid)
        .then((response) => {
            ordersData = response.data.orders
            renderOrders(ordersData)
            ordersData.length != 0 ? rederC3chart(c3Select.value) : null
        }).catch((err) => { console.error(err) });
}

function deleteOrders() {
    const url = `${baseUrl}api/livejs/v1/admin/${apiPath}/orders`;
    axios.delete(url, uuid)
        .then((response) => {
            ordersData = response.data.orders
            renderOrders(ordersData)
            ordersData.length != 0 ? rederC3chart(c3Select.value) : null
        }).catch((err) => { console.error(err) });
}

function putOrder(id, paid) {
    const url = `${baseUrl}api/livejs/v1/admin/${apiPath}/orders`;
    // console.log(paid);
    // console.log(typeof(paid));
    (paid == false) ? paid = true: paid = false;
    // console.log(paid);
    let data = { data: { id, paid } }
    axios.put(url, data, uuid)
        .then((response) => {
            //
            // console.log(response)
            ordersData = response.data.orders
            renderOrders(ordersData)
                // ordersData = response.orders.products
                // renderOrders(ordersData)
        }).catch((err) => { console.error(err) });
}



//Listener
function orderPageListListener(e) {
    e.preventDefault();
    // console.log(e.target)
    const className = e.target.getAttribute("class");
    const value = className ? className.split(" ").pop() : null
    let orderId;
    // console.log(value)
    switch (value) {
        case "discardAllBtn":
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '刪除所有訂單',
                showConfirmButton: false,
                timer: 1500
            });
            deleteOrders()
            break;
        case "js-delete":
            orderId = e.target.getAttribute("data-deleteorder");
            // console.log("刪除單筆訂單");
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '刪除訂單成功',
                showConfirmButton: false,
                timer: 1500
            });
            deleteOrder(orderId)
            break;
        case "js-paid":
            orderId = e.target.getAttribute("data-putorder");
            let paid = e.target.getAttribute("data-paid");
            (paid == "false") ? paid = false: paid = true;
            // console.log("更改訂單狀態")
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '更改訂單狀態',
                showConfirmButton: false,
                timer: 1500
            });
            putOrder(orderId, paid)
            break;
        case "js-orderdetail":
            orderId = e.target.getAttribute("data-orderdetail")
            let detailId = ordersData.filter(element => element.id === orderId)[0];
            orderState(detailId)
            break;
        default:
            break;
    }
}

function c3chartsListener(e) {
    let selectValue = (e.target.value) ? e.target.value : null
    selectValue ? rederC3chart(selectValue) : null;
}


/*  let chart = c3.generate({
//     bindto: '#chart', // HTML 元素綁定
//     data: {
//         type: "pie",
//         columns: [
//             ['Louvre 雙人床架', 1],
//             ['Antony 雙人床架', 2],
//             ['Anty 雙人床架', 3],
//             ['其他', 4],
//         ],
//         colors: {
//             "Louvre 雙人床架": "#DACBFF",
//             "Antony 雙人床架": "#9D7FEA",
//             "Anty 雙人床架": "#5434A7",
//             "其他": "#301E5F",
//         }
//     },
// });*/


// function C3charts() {
//     //renderOrders(ordersData)
//     C3itemsScalefilter()
//         //C3categoryScale()

// }

//C3 

//全產品類別營收比重
function C3categoryScale() {
    // //console.log(ordersData)
    let cartsallProducts = []
    let category = {}
        //抓出訂單所有產品
    ordersData.forEach(element => {
        element.products.forEach(item => {
            //所有類別
            if (!category[item.category]) { category[item.category] = 0 }
            cartsallProducts.push({
                title: item.title,
                category: item.category,
                price: item.price,
                quantity: item.quantity
            });
        });
    });
    // //console.log(category)
    let categoryArr = Object.keys(category);
    //計算各類別
    cartsallProducts.forEach(e => {
        categoryArr.forEach(i => {
            if (e.category == i) {
                category[i] += e.price * e.quantity;
            }
        })
    });
    //c3 data 
    let columnsData = [];
    let colorsData = {};
    let colors = ["#255359", "#336774", "#0089A7", "#33A6B8", "#81C7D4"];
    categoryArr.forEach((item, index) => { columnsData.push([item, category[item]]) })
        //排序
    columnsData.sort((a, b) => b[1] - a[1])
    columnsData.forEach((element, index) => { colorsData[element[0]] = colors[index] })
        // //console.log(columnsData)
        // //console.log(colorsData)
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: columnsData,
            colors: colorsData
        },
    });
    sectionTitle.innerHTML = "全產品類別營收比重"
}


//全品項營收比重
function C3itemsScale() {
    // //console.log(ordersData)
    let items = {}
    let cartsallProducts = []
    ordersData.forEach(element => {
        element.products.forEach(item => {
            if (!items[item.title]) { items[item.title] = 0 }
            cartsallProducts.push({
                title: item.title,
                category: item.category,
                price: item.price,
                quantity: item.quantity
            })
        })
    })
    let itemsArr = Object.keys(items)
        // //console.log(items)
        // //console.log(cartsallProducts)
    cartsallProducts.forEach(e => {
        itemsArr.forEach(i => {
            if (e.title == i) {
                items[i] += e.price * e.quantity;
            }
        })
    })
    let columnsData = [];
    let colorsData = {};
    let colors = ["#255359", "#336774", "#0089A7", "#33A6B8", "#81C7D4"];
    itemsArr.forEach((element, index) => { columnsData.push([element, items[element]]); });
    //排序
    columnsData.sort((a, b) => b[1] - a[1])
    columnsData.forEach((element, index) => { colorsData[element[0]] = colors[index] })
        // //console.log(columnsData)
        // //console.log(colorsData)
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: columnsData,
            colors: colorsData
        },
    });
    sectionTitle.innerHTML = "全品項營收比重"
        // //console.log(itemsArr)
}

//全品項營收比重 前三名,其他排名
function C3itemsScalefilter() {
    //抓取訂單的所有產品資訊
    let allitemsObj = {}
    let cartsallProducts = []
    ordersData.forEach(element => {
        element.products.forEach(item => {
            if (!allitemsObj[item.title]) { allitemsObj[item.title] = 0 }
            cartsallProducts.push({
                title: item.title,
                category: item.category,
                price: item.price,
                quantity: item.quantity
            })
        })
    })
    let allitemsArr = Object.keys(allitemsObj)
    cartsallProducts.forEach(element => {
        allitemsArr.forEach(i => {
            if (element.title == i) {
                allitemsObj[i] += element.price * element.quantity;
            }
        })
    });
    // console.log(allitemsObj)
    let proessallitemsArr = Object.entries(allitemsObj)
        // console.log(proessallitemsArr)
    let sortproessallitemsArr = proessallitemsArr.sort((a, b) => b[1] - a[1])
        // 抓取前三名，其他
    let finalData = []
    let otherData = ['其他品項', 0]
    sortproessallitemsArr.forEach((element, index) => {
            if (index < 3) {
                finalData.push(element)
            } else {
                otherData[1] += element[1]
                    // console.log(otherData)
                if (index == sortproessallitemsArr.length - 1) {
                    finalData.push(otherData)
                }
            }
        })
        // //console.log(sortproessallitemsArr)
        // //console.log(finalData)
    let columnsData = finalData;
    let colorsData = []
    let colors = ["#255359", "#336774", "#0089A7", "#33A6B8", "#81C7D4"];

    finalData.forEach((element, index) => { colorsData[element[0]] = colors[index] })
        // //console.log(finalData)
        // //console.log(colorsData)
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: columnsData,
            colors: colorsData
        },
    });
    sectionTitle.innerHTML = "全品項營收比重(篩選)"
        // //console.log(itemsArr)
}

//訂單日期
function orderTime(date) {
    dataValues = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];
    let time = `${dataValues[0]}/${dataValues[1]}/${dataValues[2]}`
    return time
}

function orderState(detailId) {
    let str = ""
    let Total = 0
    detailId.products.forEach(element => {
        let money = element.price * element.quantity
        str += ` <tr>
            <td>${element.title}</td>
            <td>${element.quantity}</td>
            <td>NT$${money}</td>
        </tr>`
        Total += money
    })
    let Detailbody = ` <table class="orderdetail-table">
                            <thead>
                                <tr style="border-bottom: 1px solid #000000;">
                                    <th >品項</th>
                                    <th >數量</th>
                                    <th >金額</th>
                                </tr >
                            </thead>
                            ${str}
                            <tr style="border-top: 1px solid #000000;">
                            <td></td>
                            <td>總金額</td>
                            <td>NT$${Total}</td>
                            </tr>
                    </table>`
    Swal.fire({ html: Detailbody, background: "white" });
    /*e1e1e1*/
}


orderPageList.addEventListener("click", orderPageListListener)
c3Select.addEventListener("change", c3chartsListener)