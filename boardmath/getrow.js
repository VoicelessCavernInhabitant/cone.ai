export function getRow(pos) {
  row = 0;
  while (pos > 0) {
    pos -= 17 - Math.abs(row - 8);
    row++;
  }
  return row;
}
