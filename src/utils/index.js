export const getIndex = (items, id) => {
  return items.findIndex(item => item.id === id);
};

export const getCategoryIndexByActivity = (categories, activityId) => {
  return categories.slice().findIndex(({ activities = [] }) => {
    if (!activities.length) {
      return false;
    }

    return activities.find((activity) => (
      activityId === activity.id
    ))
  })
};

export const sortCategories = (categories, categoryId) => {
  return categories.slice().sort((activity) => {
    if (activity.id !== categoryId) {
      return 1
    } else {
      return -1
    }
  });
};

export const getActivityByCategoryId = (categoryId, activityId, categories = []) => {
  const id = String(activityId);
  const index = categories.findIndex(category => category.id === categoryId);
  const { activities = [] } = categories[index] || {};
  if (!activities.length) {
    return;
  }

  return activities.find(activity => activity.id === id);
};

export const getCategory = ({ categories = [] }, id) => {
  if (!categories.length) {
    return;
  }

  return categories.slice().find((category) => (
    category.id === id
  ));
};

export const getCategoriesWithActiveSet = ({ categories = [] }, id) => {
  if (!categories.length) {
    return;
  }

  return categories.slice().map((category) => ({
    ...category,
    active: category.id === id
  }));
};

export const setProperties = (obj, property) => {
  const inputReferences = [], data = {};
  const inputObj = { ...obj };
  const keys = Object.keys(inputObj);
  for (const key of keys) {
    const inputValue = (((inputObj[key] || {}).inputRef || {}).value || '').trim();
    if (inputObj[key] === property || !inputValue) {
      continue;
    }
    data[key] = inputValue;
    inputReferences.push(obj[key].inputRef);
  }

  return {
    data,
    inputReferences
  };
};

export const clearInputFields = (inputReferences) => {
  for (let i = 0, len = inputReferences.length; i < len; i++) {
    inputReferences[i].value = '';
  }
};

export const isInteger = (x) => {
  return parseInt(x) === x;
};

export const splitNodeId = (nodeId) => {
  return nodeId.split(":")[1].trim();
};

export const classify = (text = " ") => {
  return text.trim().toLowerCase().replace(" ", "-");
};
