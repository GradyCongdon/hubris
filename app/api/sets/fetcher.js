
getGroups = (form) => {
  const groups = [];
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  for (let letter in alphabet) {
    let group = {};
    const inputs = ["rCode", "char", "name"];
    for (let input in inputs) {
      try {
        const key = input + letter;
        const val = form[key];
        if (val) {
          group[input] = val;
        }
      } catch (e) {
        //skip
        break;
      }
    }
    if (group.rCode) {
      groups.push(group);
    }
  }
};

getData = (formGroup) => {
  const { rCode, char, name } = formGroup;
  const url = `https://hubris-sable.vercel.app/api/sets/${rCode}/${char}`;
  const data = fetch(url, { headers: { Accept: "application/json" } })
    .then(response => response.json())
    .then(json => {
      return json.map(set => ({
        ...set,
        RCode: rCode,
        Name: name,
      }));
    });
  return data;
}
getAll = async (form) => {
  const formGroup = getGroups(form);
  const dataSetsPromises = await formGroup.map((group) => getData(group));
  const data = dataSetsPromises.flat(Infinity);
  return data;
}

data = getAll(form); 
