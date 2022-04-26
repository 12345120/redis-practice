async function awaitHandle(promise) {
  try {
    const res = await promise;
    return [res, null];
  } catch (e) {
    return [null, e];
  }
}

export { awaitHandle };
