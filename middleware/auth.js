export default function ({ store, isClient, error, redirect,query,...data }) {
  // ----------------------  必须加上isClient，不然服务端渲染会走一次，然后重定向去登录页  ---------------------
  if (isClient && !store.state.token) {
    console.log('store.state.toekn',store.state)
    redirect('/login')
  }
}