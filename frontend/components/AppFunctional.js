/* eslint-disable no-unused-vars */
import axios from 'axios'
import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi
const initialState={
  message:initialMessage,
  email:initialEmail,
  steps:initialSteps,
  index:initialIndex
}
export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
 const [state,setState]=useState(initialState);
  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    let x =(state.index%3)+1;
    let y=Math.floor(state.index/3)+1;

    return {x,y}
   
    

  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const {x,y}=getXY()
    return `Koordinatlar (${x}, ${y})`
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setState(initialState);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    if(yon==="left"){
      setState({...state,steps:state.steps+1,index:state.index-1,message:""})
    }
    else if(yon==="right"){
      setState({...state,steps:state.steps+1,index:state.index+1,message:""})
    }
    else if(yon==="up"){
      setState({...state,steps:state.steps+1,index:state.index-3,message:""})
    }
    else if(yon==="down"){
      setState({...state,steps:state.steps+1,index:state.index+3,message:""})
    }

  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    //const yon=evt.target.id;
    const {id:yon}=evt.target;
    const {x,y}=getXY();
    if(yon==="left"&&x===1){
      setState({...state,message:"Sola gidemezsiniz"})
    }
    else  if(yon==="right"&&x===3){
      setState({...state,message:"Sağa gidemezsiniz"})
    }
    else  if(yon==="up"&&y===1){
      setState({...state,message:"Yukarıya gidemezsiniz"})
    }
    else  if(yon==="down"&&y===3){
      setState({...state,message:"Aşağıya gidemezsiniz"})
    }
    else{
      sonrakiIndex(yon)
    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    const {value}=evt.target;
    setState({...state,email:value})
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    const {x,y}=getXY();
    const data={x:x,y:y,email:state.email,steps:state.steps}
    axios.post("http://localhost:9000/api/result",data).then((res)=>{
      setState({...state,message:res.data.message,email:""})
      
    }).catch((err)=>{
      setState({...state,message:err.response.data.message})
    })
      
    
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{state.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
              {idx === state.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={ilerle}  id="left">SOL</button>
        <button onClick={ilerle} data-testid="up-button" id="up">YUKARI</button>
        <button onClick={ilerle} id="right">SAĞ</button>
        <button onClick={ilerle} id="down">AŞAĞI</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input value={state.email} onChange={onChange} id="email" type="email" placeholder="email girin"></input>
        <input id="submit"  type="submit"></input>
      </form>
    </div>
  )
}
