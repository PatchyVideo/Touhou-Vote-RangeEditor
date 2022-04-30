<template>
  <div class="text-3xl p-2 border-b">角色部门-投票范围编辑</div>
  <div class="space-y-5 p-2">
    <div>{{ '共' + characterList.length + '个角色' }}</div>
    <div v-for="item in characterListTemp" :key="item.id" class="flex flex-col p-5 rounded shadow">
      <div>{{ '中文名：' + item.name }}</div>
      <div>{{ '称号：' }}</div>
      <div>{{ '别名（请用空格隔开）：' }}</div>
      <div>{{ '形象：' }}</div>
      <div>{{ '角色主题色：' }}</div>
      <div>{{ '初登场日期：' }}</div>
      <div>{{ '角色种类：' }}</div>
      <div>{{ '登场作品：' }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Character, characterList } from '../lib/character'

const characterListTemp = ref<Character[]>(characterList)
</script>
