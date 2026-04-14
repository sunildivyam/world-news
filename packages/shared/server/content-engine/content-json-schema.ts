export const articleContentJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "array",

  minItems: 7,

  items: {
    oneOf: [
      {
        title: "Title Block (ONLY ONE)",
        type: "object",
        properties: {
          type: { const: "title" },
          value: { type: "string", minLength: 20 },
        },
        required: ["type", "value"],
        additionalProperties: false,
      },
      {
        title: "Summary Block (ONLY ONE)",
        type: "object",
        properties: {
          type: { const: "summary" },
          value: { type: "string", minLength: 60 },
        },
        required: ["type", "value"],
        additionalProperties: false,
      },
      {
        title: "Heading Block",
        type: "object",
        properties: {
          type: {
            enum: ["h2", "h3", "h4", "h5", "h6"],
          },
          value: { type: "string" },
        },
        required: ["type", "value"],
        additionalProperties: false,
      },
      {
        title: "Paragraph Block",
        type: "object",
        properties: {
          type: { const: "p" },
          value: { type: "string", minLength: 30 },
        },
        required: ["type", "value"],
        additionalProperties: false,
      },
      {
        title: "List Block (NO TITLE ALLOWED)",
        type: "object",
        properties: {
          type: { enum: ["ul", "ol"] },
          items: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
          },
        },
        required: ["type", "items"],
        additionalProperties: false,
      },
      {
        title: "Keywords Block (ONLY ONE)",
        type: "object",
        properties: {
          type: { const: "keywords" },
          items: {
            type: "array",
            items: { type: "string" },
            minItems: 5,
            maxItems: 8,
          },
        },
        required: ["type", "items"],
        additionalProperties: false,
      },
      {
        title: "Tags Block (ONLY ONE)",
        type: "object",
        properties: {
          type: { const: "tags" },
          items: {
            type: "array",
            items: { type: "string" },
            minItems: 5,
            maxItems: 8,
          },
        },
        required: ["type", "items"],
        additionalProperties: false,
      },
    ],
  },
};
