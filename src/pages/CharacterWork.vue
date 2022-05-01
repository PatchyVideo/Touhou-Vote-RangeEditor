<template>
  <div class="text-3xl p-2 border-b">角色部门-作品范围编辑</div>
  <div class="w-full space-y-5 p-2 md:w-1/2 md:m-auto">
    <div>{{ '共' + workCharacterListTemp.length + '个作品' }}</div>
    <div>
      <div>说明：</div>
      <div>*角色部门的作品范围定义为：有新角色第一次出场的作品</div>
      <div>*作品命名以THBWiki的中文译名为准，但不包括作品名称的“～”符号及其后面的英文</div>
      <div>*最后一项“其他”请勿改动</div>
      <div>*请勿抬杠</div>
    </div>
    <div
      v-for="(item, index) in workCharacterListTemp"
      :key="item.name"
      class="flex justify-between p-5 rounded shadow"
    >
      <div class="flex flex-col space-y-3">
        <div>{{ '作品中文名：' + item.name }}</div>
        <div>
          {{ '种类：' + kindList.find((kind) => kind.value === item.kind)?.name || 'NULL' }}
        </div>
      </div>
      <div class="flex flex-col space-y-1">
        <button class="px-4 py-1 rounded text-white bg-green-400" @click="edit(index)">编辑</button>
        <button class="px-4 py-1 rounded text-white bg-red-400" @click="deleteWork()">删除</button>
      </div>
    </div>
  </div>
  <transition name="messageBox">
    <div
      v-if="open"
      class="fixed max-h-2/3 top-60 mx-auto left-0 right-0 p-2 w-19/20 max-w-50ch rounded bg-white z-51 flex flex-col"
    >
      <div class="text-lg truncate">编辑作品</div>
      <div class="flex flex-col space-y-2">
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">作品中文名：</label>
          <input
            v-model="workCharacterTemp.name"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="作品中文名"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">作品种类：</label>
          <VoteSelect v-model:selected="workCharacterKindTemp" :item-list="kindList" />
        </div>
      </div>
      <div class="flex flex-row-reverse">
        <button class="mx-2 px-4 py-1 rounded text-white bg-red-400" @click="confirmEdit()">确定</button>
        <button class="mx-2 px-4 py-1 rounded text-black bg-gray-200" @click="close()">取消</button>
      </div>
    </div>
  </transition>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-50" @touchmove.stop.prevent></div>
  </Transition>

  <button
    class="fixed flex items-center bottom-10 left-5 px-4 py-2 shadow rounded bg-yellow-300 text-sm md:text-base md:left-10"
    @click="outPutRes()"
  >
    导出为文件
  </button>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import { Work, workCharacterList, SelectList, kindList } from '../lib/characterWork'
import VoteSelect from '../components/VoteSelect.vue'

const aciveIndex = ref(0)
const workCharacterListTemp = ref<Work[]>(workCharacterList)
const workCharacterTemp = ref<Work>(JSON.parse(JSON.stringify(workCharacterListTemp.value[0])))
const workCharacterKindTemp = ref<SelectList>(
  kindList.find((item) => item.value === workCharacterTemp.value.kind) || kindList[0]
)
watch(workCharacterTemp, () => {
  workCharacterKindTemp.value = kindList.find((item) => item.value === workCharacterTemp.value.kind) || kindList[0]
})

const open = ref(false)
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})

function edit(index: number): void {
  aciveIndex.value = index
  workCharacterTemp.value = JSON.parse(JSON.stringify(workCharacterListTemp.value[aciveIndex.value]))
  open.value = true
}
function confirmEdit(): void {
  workCharacterListTemp.value[aciveIndex.value] = workCharacterTemp.value
  workCharacterListTemp.value[aciveIndex.value].kind = workCharacterKindTemp.value.value
  close()
}
function close(): void {
  open.value = false
}
function deleteWork(): void {
  if (confirm('你确定要删除此作品吗？')) {
    workCharacterListTemp.value.splice(aciveIndex.value, 1)
    alert('删除成功！')
  }
}

function outPutRes() {
  const json = workCharacterListTemp.value
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'application/json' }))
  a.download = 'CharacterWork.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
