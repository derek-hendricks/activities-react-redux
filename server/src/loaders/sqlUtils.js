const sqlSearchDateTimeFormat = (data) => {
  return data.replace(/:/, '+')
    .split('+')
    .map((x) => x.trim())[ 1 ];
};

const sqlWhereSearchConditions = (table, idValue, propertyName, beforeDate) => {
  const queryClauses = {
    whereClauseText: `where "${table}"."${propertyName}" = $1`,
    whereClauseValues: [ idValue ]
  };

  if (beforeDate) {
    const beforeDateValue = sqlSearchDateTimeFormat(beforeDate);
    const beforeDateText = ` and "${table}"."createdAt" < Datetime($2)`;

    queryClauses.whereClauseValues.push(beforeDateValue);
    queryClauses.whereClauseText = queryClauses.whereClauseText.concat(beforeDateText);
  }

  return queryClauses;
};

module.exports = {
  sqlWhereSearchConditions
};

