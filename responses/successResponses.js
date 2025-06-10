/**
 *
 * @param {*} res
 * @param {*} data
 * @returns 200
 */
const response200 = (res, data) => {
  return res.status(200).json({
    status: true,
    data,
  });
};
/**
 *
 * @param {*} res
 * @param {*} data
 * @returns 201
 */
const createdResponse = (res, data) => {
  return res.status(201).json({
    status: 201,
    data,
  });
};

/**
 *
 * @param {*} res
 * @param {*} data
 * @returns 202
 * for long running process
 */
const acceptedResponse = (res, data) => {
  return res.status(202).json({
    status: 202,
    data,
  });
};
/**
 *
 * @param {*} res
 * @param {*} data
 * @returns 204
 * for no content
 */
const noContentResponse = (res, data) => {
  return res.status(204).json({
    status: 204,
    data,
  });
};
export { response200, createdResponse, acceptedResponse, noContentResponse };
