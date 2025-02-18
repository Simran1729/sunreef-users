export interface Department {
  id: string;
  name: string;
  teams: string[];
}

export const departments: Department[] = [
  {
    id: "481842000003244029",
    name: "Planning Department",
    teams: ["Planning Team"],
  },
  {
    id: "481842000003250467",
    name: "Production Department",
    teams: ["Production Team 1", "Production Team 2", "Production Team 3"],
  },
  {
    id: "481842000003257905",
    name: "Service Department",
    teams: ["Service Team"],
  },
  {
    id: "481842000003265343",
    name: "Engineering Department",
    teams: [
      "ALUSS",
      "Composite",
      "Interior Engineering",
      "Yacht Design",
      "Interior Design",
      "Yacht Design 3D Visuals",
      "Deck outfitting",
      "Electrical",
      "Integrated Solutions",
      "Machinery and Piping",
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
