export const faq = {
  name: "faq",
  title: "Frequently Asked Question",
  type: "document",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "The Blend & Ingredients", value: "ingredients" },
          { title: "Brewing & Ritual", value: "brewing" },
          { title: "Orders & Shipping", value: "shipping" },
          { title: "Wholesale & Export", value: "wholesale" },
        ],
      },
      validation: (rule: { required: () => unknown }) => rule.required(),
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
      title: "question",
      subtitle: "category",
    },
  },
};
