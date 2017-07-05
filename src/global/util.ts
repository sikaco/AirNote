function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function addToList<T>(list: Array<T>, node: T, index?: number): void {
  if (index) {
    list.splice(index, 0, node)
  } else {
    list.push(node)
  }
}

export {
  assertNever,
  addToList
}