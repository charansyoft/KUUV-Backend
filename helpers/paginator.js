/**
 *
 * @param {*} requestData
 * @returns
 * helper for determinig paginator
 */
export default function paginatior(requestData) {
  /**
   * page,limit,skip are assigning to default values
   */
  let pageData = { page: null, limit: null, skip: 0 };
  if (requestData.page && requestData.limit) {
    /**
     * parging the page and limit to int
     */
    pageData.page = parseInt(requestData.page);
    pageData.limit = parseInt(requestData.limit);
    /**
     * finding skip by page and limit
     */
    pageData.skip = (pageData.page - 1) * pageData.limit;
  }
  return pageData;
}
