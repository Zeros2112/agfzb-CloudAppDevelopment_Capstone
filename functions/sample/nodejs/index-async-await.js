/**
 * Get all dealerships
 */

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');


async function getDealershipsByState(params) {
    const authenticator = new IamAuthenticator({ apikey: params.IAM_API_KEY });
    const cloudant = CloudantV1.newInstance({
        authenticator: authenticator,
    });
    cloudant.setServiceUrl(params.COUCH_URL);

    try {
        const dbName = 'dealerships'; // Change this to your actual database name
        const state = params.state;

        // Check if state exists
        const stateExists = await getMatchingRecords(cloudant, dbName, { state });
        if (stateExists.result.length === 0) {
            return { statusCode: 404, body: "The state does not exist" };
        }

        const result = await getMatchingRecords(cloudant, dbName, { state });
        const dealerships = result.result;
        return { statusCode: 200, body: dealerships };
    } catch (error) {
        return { statusCode: 500, body: "Something went wrong on the server" };
    }
}

async function getAllDealerships(params) {
    const authenticator = new IamAuthenticator({ apikey: params.IAM_API_KEY });
    const cloudant = CloudantV1.newInstance({
        authenticator: authenticator,
    });
    cloudant.setServiceUrl(params.COUCH_URL);

    try {
        const dbName = 'dealerships'; // Change this to your actual database name
        const result = await getAllRecords(cloudant, dbName);

        if (result.result.rows.length === 0) {
            return { statusCode: 404, body: "The database is empty" };
        }

        const dealerships = result.result.rows.map((row) => row.doc);
        return { statusCode: 200, body: dealerships };
    } catch (error) {
        return { statusCode: 500, body: "Something went wrong on the server" };
    }
}



async function main(params) {
      const authenticator = new IamAuthenticator({ apikey: params.IAM_API_KEY })
      const cloudant = CloudantV1.newInstance({
          authenticator: authenticator
      });
      cloudant.setServiceUrl(params.COUCH_URL);
      try {
        let dbList = await cloudant.getAllDbs();
        return { "dbs": dbList.result };
      } catch (error) {
          return { error: error.description };
      }
}
exports.main = getAllDealerships;
exports.main = getDealershipsByState;
