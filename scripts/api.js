const getData = async () => {
  const response = await fetch('./data/recipes.json');
  const data = await response.json();
  return data;
};
