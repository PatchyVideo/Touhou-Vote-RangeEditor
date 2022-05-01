<template>
  <div class="text-3xl p-2 border-b">音乐部门-投票范围编辑</div>
  <div class="w-full space-y-5 p-2 md:w-1/2 md:m-auto">
    <div>{{ '共' + musicListTemp.length + '个作品' }}</div>
    <div>
      <div>说明：</div>
      <div>*曲目命名等信息以THBWiki的信息为准</div>
      <div>
        *同一曲名收录在不同专辑的时候视为相同的曲目（如“東方星蓮船 〜 Undefined Fantastic
        Object.”收录的”感情的摩天楼　～ Cosmic Mind“和”鸟船遗迹~Trojan Green Asteroid.“收录的”感情的摩天楼　～ Cosmic
        Mind“视为相同曲目）
      </div>
      <div>*同一曲目在不同作品出现的时候以第一次出现的曲目为准</div>
      <div>*没有专辑的曲目，其所属专辑视为“幻想的音乐”，曲目发布日期以第一次可考的、正式出现的时间为准</div>
      <div>*请勿抬杠</div>
    </div>
    <div v-for="(item, index) in musicListTemp" :key="item.id" class="flex justify-between p-5 rounded shadow">
      <div class="flex flex-col space-y-3">
        <div>{{ '曲目名称：' + item.name }}</div>
        <div>{{ '专辑：' + item.album }}</div>
        <div class="flex items-center space-x-1">
          <label>试听：</label>
          <button
            class="flex items-center px-3 md:px-5 py-1 shadow rounded text-sm md:text-base"
            :class="{ 'ring ring-red-600': musicPlaying === item.music }"
            @click="playAudio(item.music)"
          >
            <label v-if="musicPlaying === item.music && musicLoading" class="animate-spin"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M18.562 14.634L14 12l4.562-2.634a1 1 0 0 0-1-1.732L13 10.268V5a1 1 0 0 0-2 0v5.268L6.438 7.634a1 1 0 0 0-1 1.732L10 12l-4.562 2.634a1 1 0 0 0 1 1.732L11 13.732V19a1 1 0 0 0 2 0v-5.268l4.562 2.634a1 1 0 0 0 1-1.732Z"
                /></svg
            ></label>
            试听
          </button>
        </div>
        <div>
          {{
            '登场日期：' +
            Math.trunc(item.date / 10000) +
            '-' +
            Math.trunc((item.date % 10000) / 100) +
            '-' +
            Math.trunc(item.date % 100)
          }}
        </div>
        <div>
          {{
            '曲目种类：' +
            item.kind.map((item) => kindList.find((item2) => item2.value === item)?.name || kindList[4].name).join(' ')
          }}
        </div>
      </div>
      <div class="flex flex-col space-y-1">
        <button class="px-4 py-1 rounded text-white bg-green-400" @click="edit(index)">编辑</button>
        <button class="px-4 py-1 rounded text-white bg-red-400" @click="deleteWork()">删除</button>
        <div class="pt-6">专辑封面：<img class="w-30" title="形象" :src="item.image || defaultMusicImage" /></div>
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
          <label class="whitespace-nowrap">曲目名称：</label>
          <input
            v-model="musicTemp.name"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="曲目名称"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">专辑：</label>
          <input
            v-model="musicTemp.album"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="专辑"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">专辑封面：</label>
          <input
            v-model="musicTemp.image"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="专辑封面的THBWiki的链接"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">曲目链接：</label>
          <input
            v-model="musicTemp.music"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="专辑封面的THBWiki的链接"
            type="text"
          />
        </div>
        <div class="flex items-center py-1 px-2">
          <label class="whitespace-nowrap">登场日期：</label>
          <input
            v-model="musicTemp.date"
            maxlength="1000"
            class="w-full bg-transparent border rounded rounded px-2 py-1"
            placeholder="八位数字"
            type="text"
          />
        </div>
        <div class="py-1 px-2 space-y-2">
          <label class="whitespace-nowrap">曲目种类：</label>
          <div class="flex flex-wrap">
            <label
              v-for="item in kindList"
              @click="updateMusicKind(item.value)"
              class="px-2 py-1 m-1 rounded whitespace-nowrap border text-sm cursor-pointer"
              :class="{
                'bg-amber-400 text-white': musicTemp.kind.findIndex((item2) => item2 === item.value) != -1,
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
    @click="addMusic()"
  >
    添加曲目
  </button>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { Music, musicList } from '../lib/music'
import { kindList } from '../lib/musicWork'
import defaultMusicImage from '../assets/defaultMusicImage.jpg?url'

const aciveIndex = ref(0)
const musicListTemp = ref<Music[]>(musicList)
const musicTemp = ref<Music>(JSON.parse(JSON.stringify(musicListTemp.value[0])))

function updateMusicKind(kind: 'game' | 'book' | 'CD' | 'others' | ''): void {
  const index = musicTemp.value.kind.findIndex((item) => item === kind)
  if (index != -1) {
    musicTemp.value.kind.splice(index, 1)
  } else {
    musicTemp.value.kind.push(kind)
  }
}

const audio = ref(new Audio())
audio.value.addEventListener('canplay', () => {
  musicLoading.value = false
})
audio.value.addEventListener('waiting', () => {
  musicLoading.value = true
})
const musicLoading = ref(false)
const musicPlaying = ref<string>('')
function playAudio(musicSrc: string): void {
  if (musicLoading.value) return
  if (musicSrc === audio.value.src && !audio.value.paused) audio.value.pause()
  else {
    audio.value.src = musicSrc
    musicPlaying.value = musicSrc
    audio.value.play()
  }
}

const open = ref(false)
watchEffect(() => {
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})
function addMusic(): void {
  musicListTemp.value.push(new Music())
  aciveIndex.value = musicListTemp.value.length - 1
  musicTemp.value = JSON.parse(JSON.stringify(musicListTemp.value[aciveIndex.value]))
  open.value = true
}
function edit(index: number): void {
  aciveIndex.value = index
  musicTemp.value = JSON.parse(JSON.stringify(musicListTemp.value[aciveIndex.value]))
  open.value = true
}
function confirmEdit(): void {
  musicListTemp.value[aciveIndex.value] = musicTemp.value
  close()
}
function close(): void {
  open.value = false
}
function deleteWork(): void {
  if (confirm('你确定要删除此作品吗？')) {
    musicListTemp.value.splice(aciveIndex.value, 1)
    alert('删除成功！')
  }
}

function outPutRes() {
  const json: Music[] = JSON.parse(JSON.stringify(musicListTemp.value))
    .sort((a: Music, b: Music) => a.date - b.date)
    .map((item: Music, index: number) => {
      item.id = String(index + 1)
      return item
    })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'application/json' }))
  a.download = 'MusicWork.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
