export interface Department {
  id: string;
  name: string;
  teams: string[];
}

export const departments: Department[] = [
  {
    id: "1142108000000409029",
    name: "Planning Department",
    teams: ["Planning Team"],
  },
  {
    id: "1142108000000422807",
    name: "Production Department",
    teams: ["Production Team 1", "Production Team 2", "Production Team 3"],
  },
  {
    id: "1142108000000437582",
    name: "Service Department",
    teams: ["Service Team"],
  },
  {
    id: "1142108000000452357",
    name: "Engineering Department",
    teams: [
      "Naval Architecture and Hydrodynamics",
      "Structural Engineering",
      "Mechanical Propulsion and Systems Engineering",
      "Electrical and Electrical Power Systems",
      "Interior Design and Fitout Engineering",
      "Outfitting and Deck Systems",
      "3D CAD / Master Modelling Cell"
    ],
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((dept) => dept.id === id);
}

export function getDepartmentByName(name: string): Department | undefined {
  return departments.find((dept) => dept.name === name);
}

export function getTeamsForDepartment(departmentId: string): string[] {
  return getDepartmentById(departmentId)?.teams || [];
}
