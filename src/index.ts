import { config } from 'dotenv'
import { getPlaceAutocomplete } from './maps-api'
import { ERROR_DEFAULT, ERROR_MISSING_API_KEY } from './constants';

import type { GetPlaceResponseT} from './maps-api'

config();

type GetDetailsResponseT = GetPlaceResponseT & {};

export async function getAutoCompleteDetails(address: string): Promise<GetDetailsResponseT> {
    const apiKey = process.env.TOMTOM_API_KEY;
    try {
        if(apiKey) {
            const options = {
                key: apiKey
            }
            const res = await getPlaceAutocomplete(address, options)
            return res  
        }
      throw new Error(ERROR_MISSING_API_KEY)
    } catch(e) {
        if(e instanceof Error) {
           throw new Error(e.message)
        }
        throw new Error(ERROR_DEFAULT)
    }
}
