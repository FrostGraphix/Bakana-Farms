export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings & Global Content",
  type: "document",
  fields: [
    {
      name: "announcementBanner",
      title: "Header Announcement Banner",
      type: "string",
      description: "Optional top announcement message (leave empty to hide)",
    },
    {
      name: "founderStory",
      title: "Founder Story Summary",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "sourcingStatement",
      title: "Sourcing & Harvest Statement",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "supportNotice",
      title: "Customer Support Notice",
      type: "string",
      description: "Displayed on the contact / support intake page",
    },
  ],
};
