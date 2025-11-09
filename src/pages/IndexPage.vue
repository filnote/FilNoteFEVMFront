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
          <CreateNote :refresh-data="getNotes" />
        </div>
      </div>
    </div>
    <!-- index -->
    <div class="container py-5">
      <div class="flex items-center">
        <q-toggle label="My investments" v-model="onlyShowWhatIInvested" />
        <q-toggle label="My creations" v-model="onlyShowWhatIFinanced" />
      </div>
      <ReadContract ref="readContract">
        <template #body>
          <div v-if="notes.length > 0" class="grid grid-cols-3 gap-5">
            <template v-for="(item, index) in notes" v-bind:key="index">
              <NoteItem :item="item" :refresh-data="getNotes" :show-agreement-details="showAgreementDetails" />
            </template>
          </div>
          <div v-else class="text-center py-10">
            <q-icon name="inbox" size="4em" color="grey" />
            <p class="text-grey text-lg mt-4">No notes found</p>
          </div>
        </template>
      </ReadContract>
    </div>
    <AgreementDetails ref="agreementDetails" />
  </q-page>
</template>

<script setup lang="ts">
import type { ReadArgs } from 'components/ReadContract.vue';
import ReadContract from 'components/ReadContract.vue';
import { onMounted, ref, watch } from 'vue';
import NoteItem from 'components/NoteItem.vue';
import CreateNote from 'components/CreateNote.vue';
import type { Note } from 'src/common/types';
import { useDAppStore } from 'src/stores/d-app';
import { storeToRefs } from 'pinia';
import AgreementDetails from 'components/AgreementDetails.vue';

const notes = ref<Note[]>([]);
const onlyShowWhatIInvested = ref(false);
const onlyShowWhatIFinanced = ref(false);

const dAppStore = useDAppStore();
const { address } = storeToRefs(dAppStore);

// Watch for toggle changes to implement mutual exclusion
watch(onlyShowWhatIInvested, (newValue) => {
  if (newValue && onlyShowWhatIFinanced.value) {
    onlyShowWhatIFinanced.value = false;
  }
});

watch(onlyShowWhatIFinanced, (newValue) => {
  if (newValue && onlyShowWhatIInvested.value) {
    onlyShowWhatIInvested.value = false;
  }
});

onMounted(() => {
  void getNotes();
});

const readContract = ref<{ read: (args: ReadArgs) => Promise<unknown> }>();
const allNotes = ref<Note[]>([]);
const agreementDetails = ref<{ showAgreementDetails: (note: Note) => void }>();

async function getNotes() {
  try {
    const result = await readContract.value?.read({ functionName: 'getNotes', args: [0, 10] });
    if (result) {
      allNotes.value = result as Note[];
      filterNotes();
    }
  } catch {
    // Error is already handled by ReadContract component or axios interceptor
  }
}

function filterNotes() {
  if (!address.value) {
    notes.value = allNotes.value;
    return;
  }

  let filteredNotes = allNotes.value;

  if (onlyShowWhatIInvested.value) {
    // Show only notes where current user is the investor
    filteredNotes = allNotes.value.filter(note =>
      note.investor.toLowerCase() === address.value.toLowerCase()
    );
  } else if (onlyShowWhatIFinanced.value) {
    // Show only notes where current user is the creator
    filteredNotes = allNotes.value.filter(note =>
      note.creator.toLowerCase() === address.value.toLowerCase()
    );
  }

  notes.value = filteredNotes;
}

function showAgreementDetails(note: Note) {
  agreementDetails.value?.showAgreementDetails(note);
}

// Watch for address changes to re-filter notes
watch(address, () => {
  filterNotes();
});

// Watch for toggle changes to re-filter notes
watch([onlyShowWhatIInvested, onlyShowWhatIFinanced], () => {
  filterNotes();
});
</script>
