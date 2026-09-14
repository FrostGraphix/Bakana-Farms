export const productEditorial = {
  name: "productEditorial",
  title: "Product editorial",
  type: "document",
  fields: [
    { name: "commerceProductId", title: "Commerce product ID", type: "string", readOnly: true, validation: (rule: { required: () => unknown }) => rule.required() },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "overview", title: "Overview", type: "array", of: [{ type: "block" }] },
    { name: "preparationNotes", title: "Preparation notes", type: "array", of: [{ type: "block" }] },
    { name: "gallery", title: "Gallery", type: "array", of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alternative text", type: "string", validation: (rule: { required: () => unknown }) => rule.required() }] }] },
  ],
};
