import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const searchAdressInput = req.body.address;
    if (searchAdressInput) {
        let geoCoder = new google.maps.Geocoder() as google.maps.Geocoder;
        geoCoder.geocode({componentRestrictions: {
            country: "BR",
        }, address: searchAdressInput}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status !== "OK") {
                console.log('zero results');
                return res.status(400).json({ error: 'zero results' });
            }
            
            if (status === "OK") {
                console.log('result', results);
                return res.status(200).json({ location: results });
            }
        })
    }
    return res.status(400).json({ error: 'no address' });
}