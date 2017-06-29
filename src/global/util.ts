function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

// 往ret对象的keys指定位置插入product作为叶子节点
// function set

export {
  assertNever
}