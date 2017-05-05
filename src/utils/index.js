export const sortCategories = (categories, categoryId) => {
  return categories.slice().sort((activity) => {
    if (activity.id !== categoryId) {
      return 1
    } else {
      return -1
    }
  });
};

export const getActivity = (categoryId, id = String(id), categories = []) => {
  const index = categories.findIndex(category => category.id === categoryId);
  const { activities } = categories[index] || {};
  if (!activities) {
    return;
  }
  return activities.find(activity => activity.id === id);
};

export const setProperties = (obj, property) => {
  const keys = Object.keys(obj);
  const data = {};
  for (const key of keys) {
    if (obj[key] === property || !(((obj[key] || {}).inputRef || {}).value || '').trim()) {
      continue;
    }
    data[key] = obj[key].inputRef.value;
  }

  return data;
};

export const isInteger = (x) => {
  return parseInt(x) === x;
};

export const splitNodeId = (nodeId) => {
  return nodeId.split(":")[1].trim();
};
