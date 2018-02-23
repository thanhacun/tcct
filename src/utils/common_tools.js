export const randomRange = (start, end) => {
  return Math.round(Math.random() * (end - start)) + start;
}

export const randomListElement = aList => {
  return aList[Math.round(Math.random() * (aList.length - 1))];
}
