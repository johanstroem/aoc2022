export type Map<T extends string | number = number> = ReadonlyArray<ReadonlyArray<T>>;
export type Index = [row: number, col: number];

function printMap<T extends string | number = number>({
  map,
  size = {
    minRow: 0,
    rows: map.length,
    minCol: 0,
    cols: map[0].length,
  },
}: {
  map: ReadonlyArray<ReadonlyArray<T>>;
  size?: {
    minRow: number;
    rows: number;
    minCol: number;
    cols: number;
  };
}) {
  const { minRow, rows, minCol, cols } = size;

  map.slice(minRow, rows).forEach((row, i) => {
    console.log(
      `${i.toString().padStart(3, " ")}: [${row
        .slice(minCol, cols)
        .map((n) => `${n}`.padStart(2, " "))
        .join("")}]`
    );
  });
}

export default printMap;
