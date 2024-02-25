
export default {
    template: "#userModal",
    props: ['tempProduct','addToCart'],
    data(){
        return{
            productModal: null,
            qty: 1,
            modal: '',
            status:{
                openModalLoading: '',
            },     
        }
    },
    mounted(){
        this.productModal = new bootstrap.Modal(this.$refs.modal);
    },
    methods:{
        openModal() {
            this.productModal.show();
            this.status.openModalLoading = '';
        },
        hideModal() {
            this.productModal.hide();
        },
    },

}