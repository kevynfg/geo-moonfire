// async function getGeocodeLocation() {
//     if (searchAdressInput) {
//         let geoCoder = new google.maps.Geocoder() as google.maps.Geocoder;
//         geoCoder.geocode({componentRestrictions: {
//             country: "BR",
//         }, address: searchAdressInput}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
//             if (status !== "OK") {
//                 console.log('zero results');
//                 return;
//             }
            
//             if (status === "OK") {
//                 console.log('result', results);
//                 props.setLocations(results as google.maps.GeocoderResult[]);
//                 return;
//             }
//         })
//     }
// }