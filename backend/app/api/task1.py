from fastapi import APIRouter
from app.models.task1 import Task1Request
from app.db.supabase import supabase
from datetime import date, timedelta

router = APIRouter()


@router.get("/ping")
def ping():
    return {"task": "task1", "status": "alive"}


@router.post("/search")
def search_properties(payload: Task1Request):
    return {
        "received": payload
    }


@router.get("/budget-range/{city}")
def get_budget_range(city: str):
    response = supabase.table("properties") \
        .select("price") \
        .eq("city", city) \
        .execute()

    prices = [item["price"] for item in response.data if item["price"] is not None]

    if not prices:
        return []

    slabs = []

    if max(prices) < 500:
        slabs.append("Below 500")
    if min(prices) <= 750 and max(prices) >= 500:
        slabs.append("500-750")
    if min(prices) <= 1000 and max(prices) >= 750:
        slabs.append("750-1000")
    if min(prices) > 1000 or max(prices) > 1000:
        slabs.append("Above 1000")

    return slabs


@router.get("/property-types/{city}")
def get_property_types(city: str):
    response = supabase.table("properties") \
        .select("property_type") \
        .eq("city", city) \
        .execute()

    types = sorted(
        set(item["property_type"].strip() for item in response.data if item["property_type"])
    )
    return types


@router.get("/availability")
def check_availability(city: str, move_in: str):
    today = date.today()

    if move_in == "Immediately":
        target_date = today
    elif move_in == "Within 1 month":
        target_date = today + timedelta(days=30)
    elif move_in == "In 2-3 months":
        target_date = today + timedelta(days=90)
    else:  # Flexible
        target_date = today + timedelta(days=180)

    response = supabase.table("properties") \
        .select("id") \
        .eq("city", city) \
        .lte("available_from", target_date.isoformat()) \
        .execute()

    return {"count": len(response.data)}


@router.get("/results")
def get_results(
    city: str,
    budget: str | None = None,
    property_type: str | None = None,
    move_in: str | None = None,
    furnishing: str | None = None,
    amenities: str | None = None,
    rules: str | None = None,
    commute: str | None = None
):
    try:
        query = supabase.table("properties") \
            .select(
                "id, title, city, price, cover_image, available_from, "
                "furnishing, amenities, things_to_know, commute_time"
            ) \
            .eq("city", city)

        # Q2 – Budget
        if budget == "Below 500":
            query = query.lt("price", 500)
        elif budget == "500-750":
            query = query.gte("price", 500).lte("price", 750)
        elif budget == "750-1000":
            query = query.gte("price", 750).lte("price", 1000)
        elif budget == "Above 1000":
            query = query.gt("price", 1000)

        # Q3 – Property type
        if property_type:
            query = query.filter(
                "property_type",
                "ilike",
                f"%{property_type.strip()}%"
            )

        # Q4 – Move-in date
        if move_in:
            today = date.today()

            if move_in == "Immediately":
                target_date = today
            elif move_in == "Within 1 month":
                target_date = today + timedelta(days=30)
            elif move_in == "In 2-3 months":
                target_date = today + timedelta(days=90)
            else:  # Flexible
                target_date = today + timedelta(days=180)

            query = query.or_(
                f"available_from.lte.{target_date.isoformat()},available_from.is.null"
            )

        # Q5 – Furnishing (multi-select OR)
        if furnishing:
            options = [f.strip() for f in furnishing.split(",")]
            or_conditions = ",".join(
                [f"furnishing.ilike.%{opt}%" for opt in options]
            )
            query = query.or_(or_conditions)

        # Q6 – Amenities (multi-select AND)
        if amenities:
            amenity_list = [a.strip() for a in amenities.split(",")]
            for amenity in amenity_list:
                query = query.contains("amenities", [amenity])

        # Q7 – House rules (exclude violators)
        if rules:
            rule_list = [r.strip() for r in rules.split(",")]
            for rule in rule_list:
                query = query.not_.contains("things_to_know", [rule])

        # Q8 – Commute time (multi-select → max threshold)
        if commute:
            commute_values = []
            for c in commute.split(","):
                if "15" in c:
                    commute_values.append(15)
                elif "30" in c:
                    commute_values.append(30)
                elif "45" in c:
                    commute_values.append(45)

            if commute_values:
                max_allowed = max(commute_values)
                query = query.lte("commute_time", max_allowed)

        response = query.execute()
        return response.data

    except Exception as e:
        return {"error": str(e)}
