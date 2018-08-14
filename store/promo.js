export const state = () => ({
  //记录以promoId为索引的列表
  list: []
})

export const mutations = {
  mergeList(state, data){
    if(Array.isArray(data.list)){
      state.list = data.list.reduce(function(acc, currentValue){
        acc[currentValue.promoId] = {...currentValue, status: data.status};
        return acc;
      }, state.list);
    }else{
      console.error('data.list 必须是数组');
    }
  },

  updateItem(state, data){
    let prevItem = state.list[data.id];
    state.list[data.id]= Object.assign({}, prevItem, data.value);
  }
}