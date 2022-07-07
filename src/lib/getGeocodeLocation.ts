export async function getGeocodeLocation(input: {address?: string, location?: {lat: number, lng: number}}): Promise<google.maps.GeocoderResult[]> {
    let result: google.maps.GeocoderResult[] = [];
    if (input.address) {
        let geoCoder = new google.maps.Geocoder() as google.maps.Geocoder;
        geoCoder.geocode({componentRestrictions: {
            country: "BR",
        }, address: input.address}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status !== "OK") {
                console.log('zero results');
                return;
            }
            
            if (status === "OK") {
                console.log('result', results);
                result.push(...results as google.maps.GeocoderResult[]);
            }
        })
        return result;
    }
    return [];
}