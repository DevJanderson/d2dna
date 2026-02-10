import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    docs: defineCollection(
      asSeoCollection({
        type: 'page',
        source: 'docs/**/*.md',
        schema: z.object({
          icon: z.string().optional(),
          order: z.number().optional(),
          hidden: z.boolean().optional()
        })
      })
    )
  }
})
