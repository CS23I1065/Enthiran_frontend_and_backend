from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .scraper import scrape_schemes  # Assuming you'll move the scraping logic to a separate file

logger = logging.getLogger(__name__)

@csrf_exempt
def search_schemes(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            user_query = data.get('query', '')

            if not user_query:
                return JsonResponse({'error': 'Query parameter is required'}, status=400)

            # Call the scrape_schemes function
            relevant_schemes = scrape_schemes(user_query)

            # Prepare the response
            response_data = {
                'status': 'success',
                'query': user_query,
                'results': relevant_schemes
            }

            return JsonResponse(response_data)

        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)