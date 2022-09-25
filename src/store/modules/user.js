const user = {
    state: {
        loading: false, //加载
        channelAuthDialog: false,
        isAutonym:false, //实名
        guide:false,  //新手指引
        unread:0, //消息未读数量

    },
    mutations: {
        Unread: (state,num)=>{
            state.unread = num
        },
        Loading: (state) => {
            state.loading = true
        },
        closeLoading: (state) => {
            state.loading = false
        },
        Autonym: (state) => {
            state.isAutonym = true
        },
        closeAutonym: (state) => {
            state.isAutonym = false
        },
        guide: (state) => {
            state.guide = true
        },
        closeGuide: (state) => {
            state.guide = false
        },
        UPDATE_CHANNELAUTHDIALOG(state, channelAuthDialog) {
            state.channelAuthDialog = channelAuthDialog
        }
    },
    actions: {

    }
}

export default user
