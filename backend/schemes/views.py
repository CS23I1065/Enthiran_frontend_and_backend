import json
import together  # Using Together AI for LLM
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Scheme

@csrf_exempt
def process_query(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_query = data.get("query", "").strip()

            if not user_query:
                return JsonResponse({"error": "Query cannot be empty"}, status=400)

            # Generate AI response
            prompt = f"""
            You are an expert on government schemes. Answer in this format:

            Name: <Scheme Name>
            Eligibility: <Eligibility Details>
            Documents Required: <Documents List>
            Offline Support: <Yes/No>
            Website: <URL>

            User query: {user_query}
            """
            response = together.Complete.create(
                model="mistralai/Mistral-7B-Instruct-v0.1",
                prompt=prompt,
                max_tokens=300
            )

            response_text = response["output"].strip()
            return JsonResponse({"response": response_text})

        except Exception as e:
            return JsonResponse({"error": f"API Error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

