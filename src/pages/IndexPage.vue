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
          <CreateNote :refresh-data="resetAndLoadNotes" />
        </div>
      </div>
    </div>
    <!-- index -->
    <div class="container py-5">
      <div class="flex items-center">
        <q-toggle label="My investments" v-model="onlyShowWhatIInvested" />
        <q-toggle label="My creations" v-model="onlyShowWhatIFinanced" />
      </div>
      <q-infinite-scroll @load="loadMore" :offset="250" :disable="hasMore === false || isLoading">
        <div v-if="isInitialLoading" class="text-center py-10">
          <q-spinner color="primary" size="3em" />
          <p class="text-grey text-lg mt-4">Loading notes...</p>
        </div>
        <template v-else>
          <div v-if="notes.length > 0" class="grid grid-cols-3 gap-5">
            <template v-for="item in notes" v-bind:key="item.id.toString()">
              <NoteItem :item="item" :refresh-data="resetAndLoadNotes" :show-agreement-details="showAgreementDetails" />
            </template>
          </div>
          <div v-else class="text-center py-10">
            <q-icon name="inbox" size="4em" color="grey" />
            <p class="text-grey text-lg mt-4">No notes found</p>
          </div>
        </template>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" size="2em" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
    <AgreementDetails ref="agreementDetails" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import NoteItem from 'components/NoteItem.vue';
import CreateNote from 'components/CreateNote.vue';
import type { Note } from 'src/common/types';
import { useDAppStore } from 'src/stores/d-app';
import { storeToRefs } from 'pinia';
import AgreementDetails from 'components/AgreementDetails.vue';
import { contractRead } from 'src/common/dApp';

const notes = ref<Note[]>([]);
const onlyShowWhatIInvested = ref(false);
const onlyShowWhatIFinanced = ref(false);

const dAppStore = useDAppStore();
const { address } = storeToRefs(dAppStore);

// Pagination state
const offset = ref(0);
const limit = ref(10);
const hasMore = ref(true);
const isLoading = ref(false);
const isInitialLoading = ref(true);
const allNotes = ref<Note[]>([]);

// Watch for toggle changes to implement mutual exclusion
watch(onlyShowWhatIInvested, (newValue) => {
  if (newValue && onlyShowWhatIFinanced.value) {
    onlyShowWhatIFinanced.value = false;
  }
  void resetAndLoadNotes();
});

watch(onlyShowWhatIFinanced, (newValue) => {
  if (newValue && onlyShowWhatIInvested.value) {
    onlyShowWhatIInvested.value = false;
  }
  void resetAndLoadNotes();
});

const agreementDetails = ref<{ showAgreementDetails: (note: Note) => void }>();

function resetAndLoadNotes() {
  offset.value = 0;
  allNotes.value = [];
  notes.value = [];
  hasMore.value = true;
  isInitialLoading.value = true;
  // Don't manually call loadMore here, let q-infinite-scroll trigger it
  // This prevents race conditions and ensures proper loading state
}

async function loadMore(index: number, done: (stop?: boolean) => void) {
  if (isLoading.value || !hasMore.value) {
    done(true);
    return;
  }

  try {
    isLoading.value = true;
    const result = await contractRead({
      functionName: 'getNotes',
      args: [offset.value, limit.value]
    });

    if (result && Array.isArray(result)) {
      const newNotes = result as Note[];

      if (newNotes.length === 0) {
        hasMore.value = false;
        filterNotes();
        // If this was initial load, set isInitialLoading to false after filtering
        if (isInitialLoading.value) {
          isInitialLoading.value = false;
        }
        done(true);
        return;
      }

      // Append new notes to allNotes
      allNotes.value = [...allNotes.value, ...newNotes];
      offset.value += limit.value;

      // If we got fewer notes than requested, there are no more
      if (newNotes.length < limit.value) {
        hasMore.value = false;
      }

      // Filter notes based on current filters
      filterNotes();

      // If this was initial load, set isInitialLoading to false after filtering
      if (isInitialLoading.value) {
        isInitialLoading.value = false;
      }

      done(false);
    } else {
      hasMore.value = false;
      filterNotes();
      // If this was initial load, set isInitialLoading to false after filtering
      if (isInitialLoading.value) {
        isInitialLoading.value = false;
      }
      done(true);
    }
  } catch {
    // Error is already handled by ReadContract component or axios interceptor
    hasMore.value = false;
    filterNotes();
    // If this was initial load, set isInitialLoading to false after filtering
    if (isInitialLoading.value) {
      isInitialLoading.value = false;
    }
    done(true);
  } finally {
    isLoading.value = false;
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
</script>
