export class House {
  public houseName: string;
  private houses = ["Stark",
    "Lannister",
    "Arryn",
    "Tully",
    "Baratheon",
    "Greyjoy",
    "Targaryen",
    "Martell",
    "Tyrell"
  ];

  constructor(
    public houseId: number
  ) {
    this.houseName = this.houses[houseId-1];
  }
}
