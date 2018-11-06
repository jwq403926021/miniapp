const app = getApp()
Component({
  properties: {
    reginSourceData :{
      type: Object,
      value: {}
    },
    visible: {
      type: Boolean,
      value: false
    }
  },
  data : {
    value: [],
    state: ['辽宁省','黑龙江省','吉林省'],
    city: ['1','2','3'],
    district: ['1','2','3']
  },
  methods: {
    emitEvent () {
      this.triggerEvent('change',{
        index : 1
      })
    },
    bindChange () {
      console.log('bindChange!!!')
    },
    bindPickend (e) {
      console.log('bindPickend', e)
    },
    cancelRegionPicker () {
      this.triggerEvent('cancel')
    }
  },
  ready(){
    console.log('my component::', this.properties.reginSourceData)
    // const className = '.i-rate';
    // var query = wx.createSelectorQuery().in(this)
    // query.select( className ).boundingClientRect((res)=>{
    //   this.data.touchesStart.pageX = res.left || 0;
    // }).exec()
  }
})
