<script setup lang="ts">
/**
 * Seção de equipe D2DNA
 * Grid com membros da equipe
 */

const teamMembers = [
  {
    name: 'Deney Araújo',
    role: 'CEO & Dev',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/Deney.png',
    color: 'green' as const
  },
  {
    name: 'Helder Nakaya',
    role: 'CSO',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/helder.png',
    color: 'blue' as const
  },
  {
    name: 'Jorge Kalil',
    role: 'Consultor Sênior',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/Jorge.png',
    color: 'amber' as const
  },
  {
    name: 'Joana Azevedo',
    role: 'Bioinformata',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/Joana.png',
    color: 'fuchsia' as const
  },
  {
    name: 'Willian Caldas',
    role: 'Backend & Data Engineer',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/willian.png',
    color: 'indigo' as const
  },
  {
    name: 'Janderson Lira',
    role: 'Frontend & DevOps',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/janderson.png',
    color: 'orange' as const
  }
]
</script>

<template>
  <div>
    <p class="text-xs font-mono text-muted-foreground/60 mb-10 text-center uppercase tracking-widest">Equipe</p>

    <!-- Grid de membros -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      <HomeTeamMember
        v-for="member in teamMembers"
        :key="member.name"
        :name="member.name"
        :role="member.role"
        :image="member.image"
        :color="member.color"
      />
    </div>
  </div>
</template>
