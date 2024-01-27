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



function main(params) {

    const authenticator = new IamAuthenticator({ apikey: params.IAM_API_KEY })
    const cloudant = CloudantV1.newInstance({
      authenticator: authenticator
    });
    cloudant.setServiceUrl(params.COUCH_URL);

    let dbListPromise = getDbs(cloudant);
    return dbListPromise;
}

function getDbs(cloudant) {
     return new Promise((resolve, reject) => {
         cloudant.getAllDbs()
             .then(body => {
                 resolve({ dbs: body.result });
             })
             .catch(err => {
                  console.log(err);
                 reject({ err: err });
             });
     });
 }
 
 
 /*
 Sample implementation to get the records in a db based on a selector. If selector is empty, it returns all records. 
 eg: selector = {state:"Texas"} - Will return all records which has value 'Texas' in the column 'State'
 */
 function getMatchingRecords(cloudant,dbname, selector) {
     return new Promise((resolve, reject) => {
         cloudant.postFind({db:dbname,selector:selector})
                 .then((result)=>{
                   resolve({result:result.result.docs});
                 })
                 .catch(err => {
                    console.log(err);
                     reject({ err: err });
                 });
          })
 }
 
                        
 /*
 Sample implementation to get all the records in a db.
 */
 function getAllRecords(cloudant,dbname) {
     return new Promise((resolve, reject) => {
         cloudant.postAllDocs({ db: dbname, includeDocs: true, limit: 10 })            
             .then((result)=>{
               resolve({result:result.result.rows});
             })
             .catch(err => {
                console.log(err);
                reject({ err: err });
             });
         })
 }
 exports.main = getAllDealerships;
 exports.main = getDealershipsByState;
