<template>
  <form novalidate>
    <HisFormElement
        v-for="(element, counter) in hisFormElements"
        :key="counter"
        :element-name="element.elementName"
        :element-type="element.elementType"
        :element-placeholder="element.elementPlaceholder"
    ></HisFormElement>
  </form>
</template>

<script>
import HisFormElement from "@/components/HisFormElement";

export default {
  name: "HisForm",
  data() {
    return {
      hisFormElements: [
        {elementName: 'first_name', elementType: 'text', elementPlaceholder: 'First Name'},
        {elementName: 'middle_name', elementType: 'text', elementPlaceholder: 'Middle Name'},
        {elementName: 'last_name', elementType: 'text', elementPlaceholder: 'Last Name'}
      ]
    }
  },
  components: {
    HisFormElement
  },
  computed: {
    showElement() {
      return this.counter < this.hisFormElements.length;
    }
  }
}
</script>

<style scoped>

</style>