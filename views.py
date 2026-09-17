import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Employee

def home(request):
    return render(request, "index.html")

def employee_to_dict(employee):
    return {
        "id": employee.id,
        "name": employee.name,
        "email": employee.email,
        "department": employee.department,
        "salary": str(employee.salary),
        "joining_date": employee.joining_date.isoformat(),
    }

@csrf_exempt
def employee_list_create(request):
    if request.method == "GET":
        employees = Employee.objects.all().order_by("-id")
        return JsonResponse([employee_to_dict(e) for e in employees], safe=False)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name", "").strip()
            email = data.get("email", "").strip()
            department = data.get("department", "").strip()
            salary = data.get("salary", "")
            joining_date = data.get("joining_date", "")

            if not all([name, email, department, salary, joining_date]):
                return JsonResponse({"error": "All fields are required."}, status=400)

            if Employee.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists."}, status=400)

            employee = Employee.objects.create(
                name=name,
                email=email,
                department=department,
                salary=salary,
                joining_date=joining_date,
            )
            return JsonResponse(employee_to_dict(employee), status=201)
        except Exception as exc:
            return JsonResponse({"error": f"Invalid data: {exc}"}, status=400)

    return JsonResponse({"error": "Method not allowed."}, status=405)

@csrf_exempt
def employee_detail(request, employee_id):
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return JsonResponse({"error": "Employee not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(employee_to_dict(employee))

    if request.method in ["PUT", "PATCH"]:
        try:
            data = json.loads(request.body)
            employee.name = data.get("name", employee.name).strip()
            employee.email = data.get("email", employee.email).strip()
            employee.department = data.get("department", employee.department).strip()
            employee.salary = data.get("salary", employee.salary)
            employee.joining_date = data.get("joining_date", employee.joining_date)
            employee.save()
            return JsonResponse(employee_to_dict(employee))
        except Exception as exc:
            return JsonResponse({"error": f"Invalid data: {exc}"}, status=400)

    if request.method == "DELETE":
        employee.delete()
        return JsonResponse({"message": "Employee deleted successfully."})

    return JsonResponse({"error": "Method not allowed."}, status=405)
