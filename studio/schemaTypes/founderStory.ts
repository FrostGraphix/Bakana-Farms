export const founderStory = {
  name: "founderStory",
  title: "Founder & Farm Provenance",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Story Title",
      type: "string",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle / Chapter Name",
      type: "string",
    },
    {
      name: "year",
      title: "Provenance Year / Milestone",
      type: "string",
      description: "e.g. '2024' or 'Origin'",
    },
    {
      name: "narrative",
      title: "Narrative Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "photo",
      title: "Farm / Heritage Photography",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative Text",
          type: "string",
          description: "Required for accessibility (WCAG 2.2 AA)",
          validation: (rule: { required: () => unknown }) => rule.required(),
        },
        {
          name: "caption",
          title: "Photo Caption",
          type: "string",
        },
      ],
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 1,
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "photo",
    },
  },
};
