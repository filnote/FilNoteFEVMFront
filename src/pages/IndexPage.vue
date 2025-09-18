<template>
  <q-page>
    <!-- header -->
    <div class="bg-video">
      <video class="video" src="/bg.mp4?v=1" autoplay loop muted />
      <div class="title-box space-y-5">
        <h1 class="text-white text-5xl font-bold">FilNoteFEVM</h1>
        <div class="text-lg text-zinc-300">
          Decentralized SP Pledge Investment and Financing DAPP
        </div>
        <div>
          <CreateNote />
        </div>
      </div>
    </div>
    <!-- index -->
    <div class="container py-5">
      <ReadContract ref="readContract">
        <template #body>
          <div class="grid grid-cols-3 gap-5">
            <template v-for="(item, index) in notes" v-bind:key="index">
              <NoteItem :item="item" />
            </template>
          </div>
        </template>
      </ReadContract>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { ReadArgs } from 'components/ReadContract.vue';
import ReadContract from 'components/ReadContract.vue';
import { onMounted, ref } from 'vue';
import NoteItem from 'components/NoteItem.vue';
import CreateNote from 'components/CreateNote.vue';
import type { Note } from 'src/common/types';
const notes = ref<Note[]>([]);

onMounted(() => {
  void getNotes();
});
const readContract = ref<{ read: (args: ReadArgs) => Promise<unknown> }>();
async function getNotes() {
  console.log(readContract);
  try {
    notes.value = await readContract.value?.read({ functionName: 'getNotes', args: [0, 10] }) as Note[];
  } catch (error) {
    console.error(error);
  }
}
</script>
