<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <Component :is="Component" />
    </Suspense>
  </RouterView>
</template>

<script lang="ts" setup></script>
