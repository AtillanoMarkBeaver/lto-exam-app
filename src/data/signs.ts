export type Sign = {
  id: number;
  name: string;
  meaning: string;
};

export const signs: Sign[] = [
  {
    id: 1,
    name: "Red Triangle (Warning)",
    meaning: "Alerts drivers to a hazard ahead, such as a curve, intersection, or pedestrian crossing.",
  },
  {
    id: 2,
    name: "Red Circle (Prohibition)",
    meaning: "Indicates an action is not allowed, such as No Entry, No U-Turn, or No Overtaking.",
  },
  {
    id: 3,
    name: "Blue Circle (Mandatory)",
    meaning: "Indicates an action drivers must follow, such as a mandatory direction or minimum speed.",
  },
  {
    id: 4,
    name: "Blue Rectangle (Information)",
    meaning: "Gives helpful information, like parking areas, hospitals, or gas stations.",
  },
];