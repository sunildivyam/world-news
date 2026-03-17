import { CountryList } from "@/types/CountryList.interface";

export const countryList: CountryList = [
  {
    code: "US",
    name: "United States",
    regions: [
      {
        code: "CA",
        name: "California",
        cities: [
          {
            code: "LA",
            name: "Los Angeles",
            languages: [
              { code: "en", name: "English" },
              { code: "es", name: "Spanish" },
            ],
          },
          {
            code: "SF",
            name: "San Francisco",
            languages: [{ code: "en", name: "English" }],
          },
        ],
        languages: [
          { code: "en", name: "English" },
          { code: "es", name: "Spanish" },
        ],
      },
      {
        code: "NY",
        name: "New York",
        cities: [
          {
            code: "NYC",
            name: "New York City",
            languages: [{ code: "en", name: "English" }],
          },
        ],
        languages: [{ code: "en", name: "English" }],
      },
    ],
    languages: [
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
    ],
  },
  {
    code: "FI",
    name: "Finland",
    regions: [
      {
        code: "UU",
        name: "Uusimaa",
        cities: [
          {
            code: "HEL",
            name: "Helsinki",
            languages: [
              { code: "fi", name: "Finnish" },
              { code: "sv", name: "Swedish" },
              { code: "en", name: "English" },
            ],
          },
        ],
        languages: [
          { code: "fi", name: "Finnish" },
          { code: "sv", name: "Swedish" },
        ],
      },
    ],
    languages: [
      { code: "fi", name: "Finnish" },
      { code: "sv", name: "Swedish" },
      { code: "en", name: "English" },
    ],
  },
  {
    code: "PH",
    name: "Philippines",
    regions: [
      {
        code: "NCR",
        name: "Metro Manila",
        cities: [
          {
            code: "MNL",
            name: "Manila",
            languages: [
              { code: "tl", name: "Tagalog" },
              { code: "en", name: "English" },
            ],
          },
        ],
        languages: [
          { code: "tl", name: "Tagalog" },
          { code: "en", name: "English" },
        ],
      },
    ],
    languages: [
      { code: "tl", name: "Tagalog" },
      { code: "en", name: "English" },
    ],
  },
  {
    code: "NO",
    name: "Norway",
    regions: [
      {
        code: "OS",
        name: "Oslo",
        cities: [
          {
            code: "OSL",
            name: "Oslo City",
            languages: [
              { code: "no", name: "Norwegian" },
              { code: "en", name: "English" },
            ],
          },
        ],
        languages: [{ code: "no", name: "Norwegian" }],
      },
    ],
    languages: [
      { code: "no", name: "Norwegian" },
      { code: "en", name: "English" },
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    regions: [
      {
        code: "SP",
        name: "São Paulo",
        cities: [
          {
            code: "SAO",
            name: "São Paulo City",
            languages: [{ code: "pt", name: "Portuguese" }],
          },
        ],
        languages: [{ code: "pt", name: "Portuguese" }],
      },
    ],
    languages: [{ code: "pt", name: "Portuguese" }],
  },
  {
    code: "IN",
    name: "India",
    regions: [
      {
        code: "DL",
        name: "Delhi NCR",
        cities: [
          {
            code: "NDLS",
            name: "New Delhi",
            languages: [
              { code: "hi", name: "Hindi" },
              { code: "en", name: "English" },
            ],
          },
          {
            code: "NDA",
            name: "Noida",
            languages: [
              { code: "hi", name: "Hindi" },
              { code: "en", name: "English" },
            ],
          },
        ],
        languages: [
          { code: "hi", name: "Hindi" },
          { code: "en", name: "English" },
        ],
      },
      {
        code: "MH",
        name: "Maharashtra",
        cities: [
          {
            code: "MUM",
            name: "Mumbai",
            languages: [
              { code: "mr", name: "Marathi" },
              { code: "hi", name: "Hindi" },
              { code: "en", name: "English" },
            ],
          },
        ],
        languages: [
          { code: "mr", name: "Marathi" },
          { code: "hi", name: "Hindi" },
        ],
      },
    ],
    languages: [
      { code: "hi", name: "Hindi" },
      { code: "en", name: "English" },
      { code: "bn", name: "Bengali" },
      { code: "te", name: "Telugu" },
    ],
  },
];
