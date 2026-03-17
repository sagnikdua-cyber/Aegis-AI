import httpx
import math
import logging
from typing import List, Dict
from models.schemas import HospitalInfo, PharmacyInfo

logger = logging.getLogger(__name__)

class LocationService:
    OVERPASS_URL = "https://overpass-api.de/api/interpreter"

    def _calculate_distance(self, lat1, lon1, lat2, lon2):
        # Haversine formula
        R = 6371  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    async def _query_overpass(self, lat: float, lng: float, amenity_types: List[str], radius: int = 5000) -> List[Dict]:
        """
        Query Overpass API for specific amenities within a radius (meters).
        """
        amenities_str = "|".join(amenity_types)
        query = f"""
        [out:json];
        (
          node["amenity"~"{amenities_str}"](around:{radius},{lat},{lng});
          way["amenity"~"{amenities_str}"](around:{radius},{lat},{lng});
          rel["amenity"~"{amenities_str}"](around:{radius},{lat},{lng});
        );
        out center;
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.OVERPASS_URL, data={"data": query})
                response.raise_for_status()
                data = response.json()
                return data.get("elements", [])
        except Exception as e:
            logger.error(f"Overpass API Error: {e}")
            return []

    async def get_nearby_hospitals(self, lat: float, lng: float) -> List[HospitalInfo]:
        elements = await self._query_overpass(lat, lng, ["hospital", "clinic"])
        
        results = []
        for el in elements:
            # Overpass returns 'center' for ways/rels if 'out center' is used
            e_lat = el.get("lat") or el.get("center", {}).get("lat")
            e_lng = el.get("lon") or el.get("center", {}).get("lon")
            
            if not e_lat or not e_lng:
                continue
                
            name = el.get("tags", {}).get("name", "Unnamed Facility")
            address = el.get("tags", {}).get("addr:full") or \
                      f"{el.get('tags', {}).get('addr:street', '')} {el.get('tags', {}).get('addr:housenumber', '')}".strip() or \
                      "Address not available"
            
            dist = self._calculate_distance(lat, lng, e_lat, e_lng)
            
            results.append(HospitalInfo(
                name=name,
                distance=f"{dist:.2f} km",
                lat=e_lat,
                lng=e_lng,
                address=address,
                map_link=f"https://www.google.com/maps/search/?api=1&query={e_lat},{e_lng}"
            ))
            
        # Sort by distance and return top 5
        results.sort(key=lambda x: float(x.distance.split()[0]))
        return results[:5]

    async def get_nearby_pharmacies(self, lat: float, lng: float) -> List[PharmacyInfo]:
        elements = await self._query_overpass(lat, lng, ["pharmacy", "medical_store", "chemist", "drugstore"], radius=20000)
        
        results = []
        for el in elements:
            e_lat = el.get("lat") or el.get("center", {}).get("lat")
            e_lng = el.get("lon") or el.get("center", {}).get("lon")
            
            if not e_lat or not e_lng:
                continue
                
            name = el.get("tags", {}).get("name", "Unnamed Pharmacy")
            address = el.get("tags", {}).get("addr:full") or \
                      f"{el.get('tags', {}).get('addr:street', '')} {el.get('tags', {}).get('addr:housenumber', '')}".strip() or \
                      "Address not available"
            
            dist = self._calculate_distance(lat, lng, e_lat, e_lng)
            
            results.append(PharmacyInfo(
                name=name,
                distance=f"{dist:.2f} km",
                lat=e_lat,
                lng=e_lng,
                address=address,
                map_link=f"https://www.google.com/maps/search/?api=1&query={e_lat},{e_lng}"
            ))
            
        # Sort by distance and return top 5
        results.sort(key=lambda x: float(x.distance.split()[0]))
        return results[:5]
