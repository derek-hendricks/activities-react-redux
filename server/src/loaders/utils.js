const dbIdToNodeId = (dbId, tableName) => {
  return `${tableName}:${dbId}`;
};

const dbIdNodeId = (data) => {
  return data.replace(/ /g, '').split(':');
};

const omitProperty = (property, propertiesToOmit) => {
  let omitProperty = false;
  for (let i = 0, len = propertiesToOmit.length; i < len; i++) {
    if (property === propertiesToOmit[i]) {
      omitProperty = true;
      break;
    }
  }

  return omitProperty;
};

const setProperties = (obj, propertiesToOmit) => {
  const data = {};
  for (const key of Object.keys(obj)) {
    const propertyValueNotUpdated = !obj[ key ].trim();
    const omit = omitProperty(key, propertiesToOmit);

    if (omit || propertyValueNotUpdated) {
      continue;
    }
    data[ key ] = obj[ key ];
  }

  return data;
};

module.exports = {
  setProperties,
  dbIdToNodeId,
  dbIdNodeId
};
