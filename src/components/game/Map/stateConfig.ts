export const STATE_CONFIG = {
  colors: {
    default: "#FFFFFF",
    selected: "#81c784",
    hover: "#a5d6a7",
    completed: "#E0E0E0",
  },
  stateAbbreviations: {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
  } as { [key: string]: string },
};

// You might also find these utility functions helpful:
export const getStateAbbreviation = (stateName: string): string => {
  return STATE_CONFIG.stateAbbreviations[stateName] || stateName;
};

export const getStateNameFromAbbreviation = (abbreviation: string): string => {
  return (
    Object.entries(STATE_CONFIG.stateAbbreviations).find(
      ([_, abbr]) => abbr === abbreviation
    )?.[0] || abbreviation
  );
};
