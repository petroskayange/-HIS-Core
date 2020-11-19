<template>
  <form novalidate>
    <HisFormElement element-name="first_name" element-type="text" element-placeholder="First Name"></HisFormElement>
    <HisFormElement element-name="last_name" element-type="text" element-placeholder="Last Name"></HisFormElement>
  </form>
</template>

<script>
import HisFormElement from "@/components/HisFormElement";

export default {
  name: "HisForm",
  components: {
    HisFormElement
  }
}
</script>

<style scoped>

</style>