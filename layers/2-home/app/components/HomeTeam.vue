<script setup lang="ts">
/**
 * Seção de equipe D2DNA
 * Grid com membros da equipe
 */
const { sectionRef, isVisible } = useSectionVisibility({ threshold: 0.1 })

const teamMembers = [
  {
    name: 'Dr. Deney Araújo',
    role: 'CEO & Dev',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/Deney.png',
    color: 'green' as const
  },
  {
    name: 'Dr. Helder Nakaya',
    role: 'CSO',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/helder.png',
    color: 'blue' as const
  },
  {
    name: 'Dr. Jorge Kalil',
    role: 'Consultor Sênior',
    image: 'https://d2dna.com/wp-content/uploads/2024/04/Jorge.png',
    color: 'amber' as const
  },
  {
    name: 'Dra. Joana Azevedo',
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
  <section
    id="team"
    ref="sectionRef"
    aria-labelledby="team-heading"
    class="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 transition-all duration-700 ease-out"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
  >
    <h2 id="team-heading" class="font-mono text-3xl font-bold text-foreground mb-4 text-center">
      Quem Está por Trás
    </h2>
    <p class="text-center text-muted-foreground mb-10 text-base">
      Quem fez ciência, constrói a tecnologia.
    </p>

    <!-- Grid de membros -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      <HomeTeamMember
        v-for="member in teamMembers"
        :key="member.name"
        :name="member.name"
        :role="member.role"
        :image="member.image"
        :color="member.color"
      />
    </div>
  </section>
</template>
