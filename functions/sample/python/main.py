"""IBM Cloud Function that gets all reviews for a dealership

Returns:
    List: List of reviews for the given dealership
"""
from cloudant.client import Cloudant
from cloudant.error import CloudantException
import requests

def get_reviews_by_dealer_id(param_dict):
    try:
        client = Cloudant.iam(
            account_name=param_dict["COUCH_USERNAME"],
            api_key=param_dict["IAM_API_KEY"],
            connect=True,
        )
        db_name = 'reviews-full'  # Change this to your actual database name
        dealer_id = param_dict.get("dealerId")

        # Check if dealerId exists
        if not dealer_id or dealer_id not in client[db_name]:
            return {"statusCode": 404, "body": "dealerId does not exist"}

        # Fetch reviews for the given dealerId
        reviews = [doc for doc in client[db_name][dealer_id]]
        return {"statusCode": 200, "body": reviews}
    except CloudantException as cloudant_exception:
        return {"statusCode": 500, "body": "Something went wrong on the server"}
    except (requests.exceptions.RequestException, ConnectionResetError) as err:
        return {"statusCode": 500, "body": "Something went wrong on the server"}



def post_review(param_dict):
    try:
        client = Cloudant.iam(
            account_name=param_dict["COUCH_USERNAME"],
            api_key=param_dict["IAM_API_KEY"],
            connect=True,
        )
        db_name = 'reviews-full'  # Change this to your actual database name
        review_data = param_dict.get("review")

        # Insert the new review into the database
        new_review = client[db_name].create_document(review_data)
        return {"statusCode": 200, "body": {"message": "Review added successfully", "reviewId": new_review["_id"]}}
    except CloudantException as cloudant_exception:
        return {"statusCode": 500, "body": "Something went wrong on the server"}
    except (requests.exceptions.RequestException, ConnectionResetError) as err:
        return {"statusCode": 500, "body": "Something went wrong on the server"}




def main(param_dict):
    """Main Function

    Args:
        param_dict (Dict): input paramater

    Returns:
        _type_: _description_ TODO
    """

    try:
        client = Cloudant.iam(
            account_name=param_dict["COUCH_USERNAME"],
            api_key=param_dict["IAM_API_KEY"],
            connect=True,
        )
        print(f"Databases: {client.all_dbs()}")
    except CloudantException as cloudant_exception:
        print("unable to connect")
        return {"error": cloudant_exception}
    except (requests.exceptions.RequestException, ConnectionResetError) as err:
        print("connection error")
        return {"error": err}

    return {"dbs": client.all_dbs()}
