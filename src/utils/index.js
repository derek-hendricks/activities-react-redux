export const getIndex = (items, itemId) => {
  return items.findIndex(({ id }) => itemId === id);
};

export const getEdgeIndex = (edges, edgeId) => {
  return edges.findIndex(({ node: { id } }) => edgeId === id)
};

export const getCategoryIndexByActivity = (categories, activityId) => {
  return categories.findIndex(({ activityEdges = [] }) => {
    if (!activityEdges.length) {
      return false;
    }

    return activityEdges.find(({ node: { id } }) => (
      activityId === id
    ))
  })
};

export const sortCategories = (categories, categoryId) => {
  return categories.slice().sort(({ id }) => {
    if (categoryId !== id) {
      return 1
    } else {
      return -1
    }
  });
};

export const getActivityByCategoryId = (categoryId, activityId, categories = []) => {
  const index = categories.findIndex(({ id }) => categoryId === id);
  if (index < 0) {
    return;
  }
  const { activityEdges = [] } = categories[ index ];
  if (!activityEdges.length) {
    return;
  }

  return activityEdges.find(({ node: { id } }) => (
    activityId === id
  ));
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
    active: id === category.id
  }));
};

export const setProperties = (obj, property) => {
  const inputReferences = [], data = {};
  const inputObj = { ...obj };
  const keys = Object.keys(inputObj);
  for (const key of keys) {
    const inputValue = (((inputObj[ key ] || {}).inputRef || {}).value || '').trim();
    if (inputObj[ key ] === property || !inputValue) {
      continue;
    }
    data[ key ] = inputValue;
    inputReferences.push(obj[ key ].inputRef);
  }

  return {
    data,
    inputReferences
  };
};

export const clearFormFields = (inputReferences, selectReference) => {
  for (let i = 0, len = inputReferences.length; i < len; i++) {
    inputReferences[ i ].value = '';
  }
  if (selectReference) {
    selectReference.selectedIndex = 0;
  }
};

export const sqliteDate = (date) => {
  return date.toISOString().split('.')[0].replace(/T/, ' ');
};

export const isInteger = (x) => {
  return parseInt(x) === x;
};

export const splitNodeId = (nodeId) => {
  return nodeId.split(":")[ 1 ].trim();
};

export const classify = (text = " ") => {
  return text.trim().toLowerCase().replace(" ", "-");
};

export const capitalize = (text) => {
  return `${text[ 0 ].toUpperCase()}${text.slice(1)}`
};
