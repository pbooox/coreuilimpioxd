<template>
  <CFooter :fixed="false">
    <div>
      <a href="https://lluviadeideaseditorial.com" target="_blank">Lluvia de Ideas Editorial</a>
      <span class="ml-1"> {{new Date().getFullYear()}}</span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1" target="_blank">Powered by</span>
      <a href="https://xelacode.com.gt" target="_blank">XelaCode</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
