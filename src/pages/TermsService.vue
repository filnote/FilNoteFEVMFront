<template>
  <q-page>
    <div class="bg-video">
      <video class="video" src="/bg.mp4?v=1" autoplay loop muted />
      <div class="title-box space-y-5">
        <h1 class="text-white text-5xl font-bold">Terms of Service</h1>
        <div class="text-lg text-zinc-300">
          Platform Terms of Service
        </div>
      </div>
    </div>
    <div class="container relative z-50 -mt-20">
      <q-card flat class="platform-terms-of-service">
        <q-card-section>
          <h3>1. Service Nature</h3>
          <p>FilNote provides decentralized technical tools enabling Storage Providers (SPs) and Investors to manage
            FIL-denominated debt notes on-chain.</p>
          <p>FilNote does not act as a financial intermediary, custodian, or guarantor.</p>
          <h3>2. User Responsibilities</h3>
          <p>Users are solely responsible for the accuracy of all information and for compliance with applicable laws.
          </p>
          <p>Users shall not use the platform for illegal fundraising, money laundering, or other prohibited activities.
          </p>
          <h3>3. Platform Liability Limitation</h3>
          <p>FilNote bears no responsibility for losses arising from on-chain contract interactions, default of SPs, or
            user negligence.</p>
          <h3>4. Data Integrity</h3>
          <p>All transaction data are stored on-chain; users are encouraged to verify details independently via Filscan.
          </p>
          <h3>5. Amendments</h3>
          <p>FilNote may update these terms periodically. Continued use of the platform constitutes acceptance of the
            updated terms.</p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
</script>
