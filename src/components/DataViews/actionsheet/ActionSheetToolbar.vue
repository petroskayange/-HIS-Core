<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>
                <center>
                    <h4 :class="color">  {{ title }} </h4>
                    <b v-if="subtitle"> {{ subtitle }} </b>
                </center>
            </ion-title>
        </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String
        },
        color: {
            type: String
        }
    }
})
</script>
