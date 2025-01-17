export default function debounce(func,delay){
    let timer;
    //anonymous function is returned.
    const debounced=function (){
        //using this to make sure we are in the current lexical scope environment.
      let context=this,
      args=arguments;
      clearTimeout(timer);//clears the timer
      timer=setTimeout(()=>{
        //func to call setSearch(),in this case,it can call to any func,so this is generic
      func.apply(context,args);

      },delay);
    }

    //cancel method to the debounced function to clear the timeout
    debounced.cancel=function(){
        clearTimeout(timer);//this will clear any pending timeout
    }
    return debounced;//returning out anonymous function stored in variable debounced.
}