const sth1 = () => {
  console.log("ONE!");
};

const sth2 = () => {
  console.log("TWO!");
};

funcList = [sth1, sth2];

funcList2 = {
  sth1: sth1,
  sth2: sth2
};

for (func of funcList) {
  func();
}

for (func in funcList2) {
  funcList2[func]();
}

funcList2.sth1()