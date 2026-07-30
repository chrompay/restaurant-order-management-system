const buildPagination = ({ page, limit, totalRecords }) => {

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    page,
    limit,
    totalRecords,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };

};

module.exports = buildPagination;
