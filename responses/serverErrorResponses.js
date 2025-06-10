/**
 *
 * @param {*} res
 * @param {*} data
 * @returns 500
 */

const internalServerResponse = (res, data) => {
  return res.status(500).json({
    status: false,
    data,
    message: data,
  });
};
export { internalServerResponse };
