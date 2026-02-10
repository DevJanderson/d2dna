<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Tucuxi',
    description: 'Record Linkage com Bioinformática'
  }
)
</script>

<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#09090b',
      color: '#fafafa',
      fontFamily: 'Space Grotesk',
      padding: '60px'
    }"
  >
    <!-- Borda superior estilo terminal -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }"
    >
      <div
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '16px',
          color: '#3b82f6',
          letterSpacing: '0.1em'
        }"
      >
        &#9608;&#9608;&#9608; TUCUXI
      </div>
      <div
        :style="{
          width: '100%',
          height: '2px',
          backgroundColor: '#3b82f6',
          opacity: '0.3'
        }"
      />
    </div>

    <!-- Conteúdo principal -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }"
    >
      <div
        :style="{
          fontSize: '52px',
          fontWeight: '700',
          lineHeight: '1.1',
          maxWidth: '900px'
        }"
      >
        {{ title }}
      </div>
      <div
        v-if="description"
        :style="{
          fontSize: '24px',
          color: '#a1a1aa',
          fontFamily: 'Space Mono',
          lineHeight: '1.4',
          maxWidth: '800px'
        }"
      >
        {{ description }}
      </div>
    </div>

    <!-- Footer -->
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }"
    >
      <div
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '18px',
          color: '#3b82f6'
        }"
      >
        tucuxi.d2dna.com
      </div>
      <div
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '16px',
          color: '#52525b'
        }"
      >
        D2DNA
      </div>
    </div>
  </div>
</template>
