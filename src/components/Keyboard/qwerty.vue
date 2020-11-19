<template>
<div class="kbd-container" :style="{top: getPosition}">
<div class="wrapper">

  <div class="kbd-row">
    <span v-for='(letter,index) in alphabet.top' :key="index" class="kbd-button" @click="pressedLetter(letter)">
      {{letter}}
    </span>
  </div>
  <div class="kbd-row">
    <span v-for='(letter,index) in alphabet.middle' :key="index" class="kbd-button" @click="pressedLetter(letter)">
      {{letter}}
    </span>
  </div>
  <div class="kbd-row">
    <span v-for='(letter,index) in alphabet.bottom' :key="index" class="kbd-button" @click="pressedLetter(letter)">
      {{letter}}
    </span>
  </div> 
</div>
</div>
</template>

<script>
export default {
emits: [
    'inputChar', 'customEvent',
],
// props: ['val', 'custom'],
props: {
  val: String,
  custom:  Object, 
  position: Number
},
  data(){
    return{
      input: '',
      alphabet: {
        top: ['Q','W','E','R','T','Y','U','I','O','P', 'del'],
        middle: ['A','S','D','F','G','H','J','K','L'],
        bottom: ['next','Z','X','C','V','B','N','M','space']
      },
      sto : {
        top: "500px"
      }

    }
  },
  methods:{
    pressedLetter(letter){
        let currentValue = '';
      if(letter.match(/del/gi)) {
       currentValue = this.val.slice(0, -1);    
      }else if(letter.match(/space/gi)) {

       currentValue = (this.val + ' ');
      }
      else {
       currentValue = (this.val + letter);
      }
      if(this.custom && letter.match(this.custom.name) && this.custom.action) {
        this.$emit(this.custom.action, currentValue);
      }else {
        this.$emit('inputChar', currentValue);
      }
    }
  },
  mounted() {
    // Object.has
    if(this.custom) {
      this.alphabet.bottom.push(this.custom.name);
    }
    
  },
  computed: {
    getPosition(){
      return this.position + 80 + "px"
    }
  }

}
</script>

<style>
/* @import './keyboard.css'; */
.kbd-container{
  /* margin: left; */
  left: 10%;
  right: 20%;
  width: 60%;
  position: fixed;
  z-index: 500;
  opacity: 90%;
}
.wrapper{
  min-width: 750px;
  max-width: 1000px;
  padding: 25px;
  border-radius: 10px;
  background: #dde1e7;
  box-shadow: -3px -3px 7px #ffffff73,
               2px 2px 5px rgba(94,104,121,0.288);
  /* background: #131419; */
  /* box-shadow: 2px 2px 5px rgba(0,0,0,0.5),
              -3px -3px 7px rgba(255,255,255,0.05); */
}
.kbd-row{
  display: flex;
  justify-content: center;
}
.kbd-button{
   height: 45px;
    width: 6%;
    max-width: 90px;
    margin: 3px;
    border-radius: 4px;
    border: none;
    background: rgba(250, 250, 250, 0.2);
    color: #000000;
    font-size: 1.05rem;
    outline: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: top;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    position: relative;
  /* height: 50px;
  min-width: 50px;
  padding: 10px;
  border: none;
  outline: none;
  background: #dde1e7;
  box-shadow: -3px -3px 7px #ffffff73,
               2px 2px 5px rgba(94,104,121,0.288); */
 
  /* margin: 10px;
  color: grey;
  font-size: 20px;
  border-radius: 5px;
  cursor: default; */
  /* color: #c7c7c7; */
 /* background: #131419; */
  /* box-shadow: 2px 2px 5px rgba(0,0,0,0.5),
              -3px -3px 7px rgba(255,255,255,0.05); */
}
/* .kbd-button{
  font-size: 19px;
  color: #3498db;
  box-shadow: inset -3px -3px 7px #ffffff73,
              inset 2px 2px 5px rgba(94,104,121,0.288);
  /* box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5),
              inset -3px -3px 7px rgba(255,255,255,0.05); */ */
/* } */
.wrapper .keys input[value="SPACE"]{
  width: 60%;
}
/* .kbd-container{
    width: 50%;
    background-color: cadetblue;
    height: 30%;
    margin: auto;
}


.kbd-button {
    font: 71%/1.5 Verdana, Sans-Serif;
        float: left;
        margin: 0 5px 5px 0;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #fff;
        border: 1px solid #f9f9f9;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        } */
</style>