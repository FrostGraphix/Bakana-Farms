export const siteSettings = {
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    { name: "founderStory", title: "Founder story", type: "array", of: [{ type: "block" }] },
    { name: "sourcingStatement", title: "Sourcing statement", type: "array", of: [{ type: "block" }] },
    { name: "supportNotice", title: "Support notice", type: "string" },
  ],
};
