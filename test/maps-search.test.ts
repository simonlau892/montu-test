import { config } from 'dotenv'
import { describe } from '@jest/globals'
import { getPlaceAutocomplete } from '../src/maps-api'
import { getAutoCompleteDetails } from '../src'
import { DEFAULT_COUNTRY, ERROR_MISSING_ADDRESS, ERROR_MISSING_API_KEY } from '../src/constants';

config();

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
    let apiKey

    beforeAll(()=>{
      apiKey = process.env.TOMTOM_API_KEY;
    })

    describe('getAutoCompleteDetails', () => {
        it ('returns a promise', () => {
            const res = getAutoCompleteDetails('Charlotte Street')
            expect(res).toBeInstanceOf(Promise)
        })

        it('can fetch from the autocomplete api', async () => {
            const res = await getAutoCompleteDetails('Charlotte Street')
            const firstRes = res[0];
            expect(firstRes).toHaveProperty('placeId')
            expect(firstRes).toHaveProperty('streetNumber')
            expect(firstRes).toHaveProperty('countryCode')
            expect(firstRes).toHaveProperty('country')
            expect(firstRes).toHaveProperty('freeformAddress')
            expect(firstRes).toHaveProperty('municipality')
        })

        it('Should not contain results outside of Australia', async () => {
            const res = await getAutoCompleteDetails('Charlotte Street')
            const checkCountry = res.every((item)=> item.countryCode === DEFAULT_COUNTRY);
            expect(checkCountry).toBe(true)
        })

        it('handles missing address', async () => {
            expect(getAutoCompleteDetails('')).rejects.toThrow(ERROR_MISSING_ADDRESS)
        })
        it('handles missing API key', async () => {
            process.env.TOMTOM_API_KEY = '';
            expect(getAutoCompleteDetails('Charlotte Street')).rejects.toThrow(ERROR_MISSING_API_KEY)
        })
    })

    describe('getPlaceAutocomplete', () => {

        it('handles no results', async () => {
            if(apiKey) {
                const res = await getPlaceAutocomplete('asfasffasfasafsafs', {key: apiKey});
                expect(res).toStrictEqual([])
            }
        })

        it('handles error', async () => {
            if(apiKey) {
                expect(getPlaceAutocomplete('', {key: apiKey})).rejects.toThrow()
            }
        })

        it('handles missing API key', async () => {
            // @ts-ignore We are deliberately testing when the key is undefined.
            expect(getPlaceAutocomplete('sss', {key: ''})).rejects.toThrow(ERROR_MISSING_API_KEY)
        })
    })

})
