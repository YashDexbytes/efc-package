// data/countries.ts
const countries = [
  {
    id: 1,
    name: "India",
    states: [
      {
        name: "Maharashtra",
        cities: ["Mumbai", "Pune", "Nagpur"],
      },
      {
        name: "Gujarat",
        cities: ["Ahmedabad", "Surat", "Vadodara"],
      },
    ],
  },
  {
    id: 2,
    name: "USA",
    states: [
      {
        name: "California",
        cities: ["Los Angeles", "San Francisco", "San Diego"],
      },
      {
        name: "New York",
        cities: ["New York City", "Buffalo", "Rochester"],
      },
    ],
  },
  {
    id: 3,
    name: "Canada",
    states: [
      {
        name: "Ontario",
        cities: ["Toronto", "Ottawa", "Hamilton"],
      },
      {
        name: "Quebec",
        cities: ["Montreal", "Quebec City", "Laval"],
      },
    ],
  },
];

export default countries;
