import userModal from './userModal.js';

import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.9/vue.esm-browser.min.js";

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'colorgolden';

// 定義驗證規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});
//設定語言環境
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json');

VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true,
});

const app = Vue.createApp({
    data(){
        return{
            products: [],
            tempProduct: {},
            productId: '',
            cartData: [],
            total: [],
            status:{
                //openModalLoading: '',
                addToCartLoading: '',
                cartQtyLoading: '',
                delCartLoading: '',
            }
        }
    },
    methods:{
        getProducts(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
            .then(res =>{
                //console.log(res.data.products);
                this.products = res.data.products;
            })
            .catch((err) => {
                alert(err);         
            })
        },
        getOneProduct(id){
            this.productId = id;
            axios.get(`${apiUrl}/api/${apiPath}/product/${id}`)
            .then(res =>{
                //console.log(res.data.product);
                this.productId = '';
                this.tempProduct = res.data.product;
                this.$refs.userModal.openModal();
            })
            .catch((err) => {
                alert(err);          
            })
        },
        addToCart(product_id, qty=1){
            const orderData = {
                product_id,
                qty
            };
            this.status.addToCartLoading = product_id;  //loading...
            axios.post(`${apiUrl}/api/${apiPath}/cart`, { data: orderData }
            ).then((res) => {
                alert(res.data.message);
                this.getCart();
                this.status.addToCartLoading = '';     //...清除loading資料
                this.$refs.userModal.hideModal();
            })
        },
        getCart(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
            .then((res) => {
                this.cartData = res.data.data.carts;
                this.total = res.data.data.total;
            })
        },
        delWholeCarts(){
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
            .then((res) => {
                alert(res.data.message);
                this.getCart();
            })
        },
        delCart(id){
            this.status.delCartLoading = id;          //...loading
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
            .then((res) => {
                alert(res.data.message);
                this.productId = '';
                this.status.delCartLoading = '';     //...清除loading資料
                this.getCart();
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
        },
        updateCartQty(item, qty=1){
            const orderData = { 
                product_id: item.id, 
                qty
            };
            this.status.cartQtyLoading = item.id;  //loading...
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data: orderData })
            .then((res) => {
                this.status.cartQtyLoading = '';   //...清除loading資料
                this.getCart();
            })
            .catch((err) => {
                alert(err);
            })  
        }  
    },
    components:{
        userModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    mounted(){
        this.getProducts();
        this.getCart();
    },
})


app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);

app.mount("#app");