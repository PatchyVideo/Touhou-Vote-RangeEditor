<template>
  <div class="text-3xl p-2 border-b">角色部门-投票范围编辑</div>
  <div class="w-full space-y-5 p-2 md:w-1/2 md:m-auto">
    <div>{{ '共' + characterListTemp.length + '个作品' }}</div>
    <div>
      <div>说明：</div>
      <div>*作品命名等信息以THBWiki的信息为准</div>
      <div>*同一角色在不同作品出现的时候以第一次出现的作品为准</div>
      <div>*出现多译名的情况以主流译名为准，存在争议的译名，则在括号内展示其他译名，如“因幡天为（因幡帝）“</div>
      <div>*无一设命名的角色以通用称呼为准</div>
      <div>*重名人物合并（如风见幽香）</div>
      <div>*请勿抬杠</div>
    </div>
    <div v-for="(item, index) in characterListTemp" :key="item.id" class="flex justify-between p-5 rounded shadow">
      <div class="flex flex-col space-y-3">
        <div>{{ '中文名：' + item.name }}</div>
        <div>{{ '称号：' + item.title }}</div>
        <div>{{ '别名：' + item.altnames.join(' ') }}</div>
        <div>
          角色主题色：<label :style="'color:' + item.color"> {{ item.color }}</label>
        </div>
        <div>
          {{
            '初登场日期：' +
            Math.trunc(item.date / 10000) +
            '-' +
            Math.trunc((item.date % 10000) / 100) +
            '-' +
            Math.trunc(item.date % 100)
          }}
        </div>
        <div>
          {{
            '角色种类：' +
            item.kind.map((item) => kindList.find((item2) => item2.value === item)?.name || kindList[4].name).join(' ')
          }}
        </div>
        <div>{{ '登场作品：' + item.work.join(' ') }}</div>
      </div>
      <div class="flex flex-col space-y-1">
        <button class="px-4 py-1 rounded text-white bg-green-400" @click="edit(index)">编辑</button>
        <button class="px-4 py-1 rounded text-white bg-red-400" @click="deleteWork()">删除</button>
        <div class="pt-6">形象：<img class="w-30" title="形象" :src="item.image || defaultCharacterImage" /></div>
      </div>
    </div>
  </div>
  <transition name="messageBox">
    <div
      v-if="open"
      class="fixed top-1/40 md:top-60 mx-auto left-0 right-0 p-2 w-19/20 md:w-1/2 rounded bg-white z-51 flex flex-col max-h-19/20 overflow-auto"
    >
      <div class="text-lg truncate">编辑角色</div>
      <div class="flex flex-col space-y-2">
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">中文名：</label>
          <input
            v-model="characterTemp.name"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="中文名"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">称号：</label>
          <input
            v-model="characterTemp.title"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="称号"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">别名：</label>
          <input
            v-model="characterTemp.altnames"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="别名（用空格隔开）"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">角色主题色：</label>
          <input
            v-model="characterTemp.color"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="十六进制颜色"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">形象：</label>
          <input
            v-model="characterTemp.image"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="THBWiki的链接"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">初登场日期：</label>
          <input
            v-model="characterTemp.date"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="八位数字"
            type="text"
          />
        </div>
        <div class="py-1 px-2 space-y-2">
          <label class="whitespace-nowrap">角色种类：</label>
          <div class="flex flex-wrap">
            <label
              v-for="item in kindList"
              @click="updateCharacterKind(item.value)"
              class="px-2 py-1 m-1 rounded whitespace-nowrap border text-sm cursor-pointer"
              :class="{
                'bg-amber-400 text-white': characterTemp.kind.findIndex((item2) => item2 === item.value) != -1,
              }"
              >{{ item.name }}</label
            >
          </div>
        </div>
        <div class="py-1 px-2 space-y-2">
          <label class="whitespace-nowrap">初登场作品：</label>
          <div class="flex flex-wrap">
            <label
              v-for="item in workCharacterList"
              @click="updateCharacterWork(item.name)"
              class="px-2 py-1 m-1 rounded whitespace-nowrap border text-sm cursor-pointer"
              :class="{
                'bg-amber-400 text-white': characterTemp.work.findIndex((item2) => item2 === item.name) != -1,
              }"
              >{{ item.name }}</label
            >
          </div>
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
    class="fixed bottom-10 left-5 px-4 py-2 shadow rounded bg-yellow-300 text-sm md:text-base md:left-10"
    @click="outPutRes()"
  >
    导出为文件
  </button>
  <button
    class="fixed flex items-center bottom-10 right-5 px-4 py-2 shadow rounded bg-green-300 text-sm md:text-base md:right-10"
    @click="addCharacter()"
  >
    添加角色
  </button>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { Character, characterList } from '../lib/character'
import { workCharacterList, kindList } from '../lib/characterWork'
import defaultCharacterImage from '../assets/defaultCharacterImage.png?url'

const aciveIndex = ref(0)
const characterListTemp = ref<Character[]>(characterList)
const characterTemp = ref<Character>(JSON.parse(JSON.stringify(characterListTemp.value[0])))

function updateCharacterKind(kind: 'old' | 'new' | 'book' | 'CD' | 'others' | ''): void {
  const index = characterTemp.value.kind.findIndex((item) => item === kind)
  if (index != -1) {
    characterTemp.value.kind.splice(index, 1)
  } else {
    characterTemp.value.kind.push(kind)
  }
}
function updateCharacterWork(work: string): void {
  const index = characterTemp.value.work.findIndex((item) => item === work)
  if (index != -1) {
    characterTemp.value.work.splice(index, 1)
  } else {
    characterTemp.value.work.push(work)
  }
}

const open = ref(false)
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})
function addCharacter(): void {
  characterListTemp.value.push(new Character())
  aciveIndex.value = characterListTemp.value.length - 1
  characterTemp.value = JSON.parse(JSON.stringify(characterListTemp.value[aciveIndex.value]))
  open.value = true
}
function edit(index: number): void {
  aciveIndex.value = index
  characterTemp.value = JSON.parse(JSON.stringify(characterListTemp.value[aciveIndex.value]))
  open.value = true
}
function confirmEdit(): void {
  characterListTemp.value[aciveIndex.value] = characterTemp.value
  close()
}
function close(): void {
  open.value = false
}
function deleteWork(): void {
  if (confirm('你确定要删除此作品吗？')) {
    characterListTemp.value.splice(aciveIndex.value, 1)
    alert('删除成功！')
  }
}

function outPutRes() {
  const json: Character[] = JSON.parse(JSON.stringify(characterListTemp.value))
    .sort((a: Character, b: Character) => a.date - b.date)
    .map((item: Character, index: number) => {
      item.id = String(index + 1)
      return item
    })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'application/json' }))
  a.download = 'CharacterWork.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
