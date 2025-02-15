import json
import requests  # For making HTTP requests to DeepSeek API
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def process_query(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_query = data.get("query", "").strip()

            if not user_query:
                return JsonResponse({"error": "Query cannot be empty"}, status=400)

            # Generate AI response using DeepSeek
            prompt = f"""
            You are an expert on government schemes. Answer in this format:

            Name: <Scheme Name>
            Eligibility: <Eligibility Details>
            Documents Required: <Documents List>
            Offline Support: <Yes/No>
            Website: <URL>

            User query: {user_query}
            """

            # Make a request to DeepSeek API
            deepseek_url = "https://api.deepseek.com/chat/completions"  # Example endpoint
            headers = {
                "Authorization": env.API_KEY,
                "Content-Type": "application/json"
            }
            payload = {
                "model": "deepseek-model-name",  # Replace with the specific DeepSeek model
                "messages": [
                    {"role": "system", "content": "You are an expert on government schemes."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 300
            }

            response = requests.post(deepseek_url, headers=headers, json=payload)
            response_data = response.json()

            # Extract the response text
            response_text = response_data["choices"][0]["message"]["content"].strip()
            return JsonResponse({"response": response_text})

        except Exception as e:
            return JsonResponse({"error": f"API Error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

