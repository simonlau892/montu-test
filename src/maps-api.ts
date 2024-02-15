import axios from 'axios'
import {
    BASE_URL,
    DEFAULT_COUNTRY,
    DEFAULT_LIMIT,
    ERROR_DEFAULT,
    ERROR_MISSING_ADDRESS,
    ERROR_MISSING_API_KEY
} from './constants'

export interface GetPlaceOptionsT {
    key: string;
    query?: string;
    typeahead?: boolean;
    limit?: number;
    ofs?: number;
    countrySet?: string;
    lat?: number;
    lon?: number;
    radius?: number;
    topLeft?: string;
    btmRight?: string;
    geobias?: string;
    language?: string;
    extendedPostalCodesFor?: string;
    minFuzzyLevel?: number;
    maxFuzzyLevel?: number;
    idxSet?: string;
    brandSet?: string;
    connectorSet?: string;
    minPowerKW?: number;
    fuelSet?: string;
    vehicleTypeSet?: string;
    view?: string;
    openingHours?: string;
    timeZone?: string;
    mapcodes?: string;
    relatedPois?: string;
    entityTypeSet?: string;
  }

export interface AddressT {
    streetNumber: string
    streetName: string
    municipality: string
    neighbourhood: string,
    countrySecondarySubdivision: string,
    countrySubdivision: string,
    countrySubdivisionName: string,
    countrySubdivisionCode: string,
    postalCode: string,
    extendedPostalCode: string,
    countryCode: string,
    country: string,
    countryCodeISO3: string,
    freeformAddress: string,
    localName: string
}

export interface PointAddressT {
    id:  string
    address:  AddressT
}
  
export interface SearchResponseT {
    results:  Array<PointAddressT>
}

export interface PointAddressResponseT extends AddressT {
    placeId:  string
}

export type GetPlaceResponseT = Array<PointAddressResponseT>

const defaultOptions = {
    limit: DEFAULT_LIMIT,
    countrySet: DEFAULT_COUNTRY
};
  

export async function getPlaceAutocomplete(address: string, options: GetPlaceOptionsT ): Promise<GetPlaceResponseT> {
    const optionWithDefaults = {...defaultOptions, ...options};

    if (!address) {
        throw new Error(ERROR_MISSING_ADDRESS)
    }

    if (!('key' in optionWithDefaults) || !optionWithDefaults['key']) {
        throw new Error(ERROR_MISSING_API_KEY)
    }

    try {
        const autocomplete = await axios.get<SearchResponseT>(`${BASE_URL}/${address}.json`, {params: optionWithDefaults})
        return autocomplete.data.results.map((result) => {
            const {
                id,
                address: {
                    streetNumber,
                    streetName,
                    municipality,
                    neighbourhood,
                    countrySecondarySubdivision,
                    countrySubdivision,
                    countrySubdivisionName,
                    countrySubdivisionCode,
                    postalCode,
                    extendedPostalCode,
                    countryCode,
                    country,
                    countryCodeISO3,
                    freeformAddress,
                    localName
                }
            } = result;
            return {
                placeId: id,
                streetNumber,
                streetName,
                municipality,
                neighbourhood,
                countrySecondarySubdivision,
                countrySubdivision,
                countrySubdivisionName,
                countrySubdivisionCode,
                postalCode,
                extendedPostalCode,
                countryCode,
                country,
                countryCodeISO3,
                freeformAddress,
                localName
            }
        })

    } catch(e) {
        if(e instanceof Error) {
            throw new Error(e.message)
        }
        throw new Error(ERROR_DEFAULT)
    }
}
