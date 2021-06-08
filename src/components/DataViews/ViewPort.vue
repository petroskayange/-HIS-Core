<template> 
    <div id='view-port'> 
        <slot> </slot>
    </div>
</template>
<style scoped>
    #view-port {
        border: 1px solid black;
        margin-left: 25px;
        background: #F0F0F0;
        width: 96.5%;
        border-radius: 10px;
        padding: 5px;
        overflow-x: scroll;
        max-height: 589px;
    }
</style>