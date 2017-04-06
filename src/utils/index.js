export const setProperties = (obj, property, value) => {
  const keys = Object.keys(obj);
  let data = {};
  for (let key of keys) {
    if (obj[key] === property) continue;
    if (!obj[key].value.trim()) continue;
    data[key] = obj[key].value;
  }
  return data;
};

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export const initialFetch = () => {
  const categoryListQuery = `{
      categoryList {
        categories {
          id
          description
          name
        }
      }
    }`;

  const activitiesQuery = (category_id) => {
    return `{
        categoryInterface(id: "categories: ${category_id}") {
          ... on Category {
            activities {
              id
              name
              about
              date
              location
              categoryId
            }
          }
        }
      }`;
  };

  function loadActivities(categoryList, activeIndex, activeCategory) {
    return fetch(activitiesQuery(activeCategory.id)).then((results) => {
      const { errors, data: { categoryInterface } } = results;
      if (errors) {
        return categoryList;
      }
      return {
        activeCategory: activeCategory.id,
        categories: [
          ...categoryList.categories.slice(0, activeIndex),
          Object.assign({}, activeCategory, categoryInterface),
          ...categoryList.categories.slice(activeIndex + 1, categoryList.categories.length)
        ]
      };
    });
  }

  return new Promise((resolve) => {
    fetch(categoryListQuery).then((results) => {
      const { errors, data: { categoryList } } = results;
      const index = 0;
      if (errors) {
        return errors;
      }
      const category = categoryList.categories[index];
      return loadActivities(categoryList.categories, index, category);
    }).then(resolve);
  });
};
