import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contactLinkSchema = z.object({
  label: z.string(),
  url: z.string().url()
});

const itemBaseSchema = z.object({
  order: z.number().optional()
});

const displaySchema = z.object({
  displayOn: z.array(z.string()).optional(),
  priority: z.record(z.string(), z.number()).optional(),
  collapsedOn: z.array(z.string()).optional(),
  stars: z.number().int().nonnegative().optional()
});

export const collections = {
  site: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/site' }),
    schema: z.object({
      title: z.string(),
      role: z.string(),
      location: z.string(),
      website: z.string().url(),
      pdfPath: z.string(),
      displayOn: z.array(z.string()).optional(),
      order: z.number().optional()
    })
  }),
  aboutMe: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/about-me' }),
    schema: z.object({
      title: z.string(),
      headline: z.string(),
      location: z.string(),
      email: z.string().email(),
      github: z.string().url(),
      linkedin: z.string().url(),
      displayOn: z.array(z.string()).optional(),
      order: z.number().optional()
    })
  }),
  education: defineCollection({
    loader: glob({ pattern: 'education.md', base: './content' }),
    schema: itemBaseSchema.extend({
      title: z.string()
    })
  }),
  contact: defineCollection({
    loader: glob({ pattern: 'contact.md', base: './content' }),
    schema: itemBaseSchema.extend({
      title: z.string(),
      phone: z.string(),
      email: z.string().email(),
      location: z.string(),
      links: z.array(contactLinkSchema)
    })
  }),
  versions: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/versions' }),
    schema: itemBaseSchema.extend({
      name: z.string(),
      slug: z.string(),
      collapse: z
        .object({
          workExperiences: z.enum(['all', 'none', 'mixed']).optional(),
          products: z.enum(['all', 'none', 'mixed']).optional()
        })
        .optional()
    })
  }),
  workExperiences: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/work-experiences' }),
    schema: itemBaseSchema.extend(displaySchema.shape).extend({
      company: z.string(),
      position: z.string(),
      start: z.string(),
      end: z.string(),
      location: z.string(),
      engagementType: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Hourly', 'Internship']),
      technologies: z.array(z.string()).default([])
    })
  }),
  products: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/products' }),
    schema: itemBaseSchema.extend(displaySchema.shape).extend({
      name: z.string(),
      group: z.string(),
      status: z.string(),
      technologies: z.array(z.string()).default([])
    })
  }),
  ecosystems: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/ecosystems' }),
    schema: itemBaseSchema.extend(displaySchema.shape).extend({
      name: z.string(),
      focus: z.string(),
      status: z.string(),
      link: z.string().url(),
      scale: z.string().optional()
    })
  }),
  professionalWork: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/professional-work' }),
    schema: itemBaseSchema.extend({
      name: z.string(),
      status: z.string()
    })
  }),
  skills: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/skills' }),
    schema: itemBaseSchema.extend({
      title: z.string(),
      displayOn: z.array(z.string()).optional(),
      items: z.array(
        z.union([
          z.string(),
          z.object({
            name: z.string(),
            order: z.number().optional(),
            displayOn: z.array(z.string()).optional()
          })
        ])
      )
    })
  })
};
